import {AccountInfo, Connection, PublicKey} from "@solana/web3.js";
import { TokenAccount, TokenAccountParser } from "../models";
import {ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID, u64} from "@solana/spl-token";
import {WRAPPED_SOL_MINT} from "../config";
import BufferLayout from "buffer-layout";
import {Obligation, ObligationLayout, ObligationParser } from "../models";
import { LastUpdateLayout } from "../models";
import { State } from "../models";
import {Mining, MiningLayout, MiningParser } from "../models";
import {LarixMarket, LarixReserve} from "../larixMarket";
import {
    UserMarketDetail,
    LarixMining,
    LarixMiningDetail,
    LarixObligation,
    LarixObligationCollateral,
    LarixObligationLiquidity
} from "./type";
import { eX } from "../utils";
import BigNumber from "bignumber.js";
import {getConnection} from "../utils";


export class LarixUserInfo{
    public publicKey:PublicKey;
    public connection: Connection;
    public markets:LarixMarket[];
    public marketDetails:UserMarketDetail[];
    public tokenAccounts:Map<string,Array<TokenAccount>> = new Map<string, Array<TokenAccount>>()
    constructor(
        publicKey:PublicKey,
        connection: Connection,
        markets:LarixMarket[]
    ) {
        this.publicKey = publicKey
        this.connection = connection
        this.markets = markets
        this.marketDetails = []
    }
    public async loadTokenAccounts(){
        this.tokenAccounts = await this.getTokenAccounts()
    }
    public setTokenAccounts(tokenAccounts:Map<string,Array<TokenAccount>>){
        this.tokenAccounts = tokenAccounts
    }
    public async loadUserInfo(){
        this.marketDetails = []
        const promiseArray:any[] = []
        this.markets.forEach(market=>{
            const programId = market.config.programId
            const marketId = market.config.marketId
            promiseArray.push(this.getMining(programId,[marketId]))
            promiseArray.push(this.getObligation(programId,[marketId]))
        })
        const response = await Promise.all(promiseArray)
        let index = 0
        for (const market of this.markets) {
            const userDetail:UserMarketDetail = {
                market,
                mining:undefined,
                obligations:[]
            }
            // @ts-ignore
            const minings:State<Mining>[] = response[index++].get(market.config.marketId.toString())
            if (minings && minings.length>0){
                const mining:State<Mining> = minings[0] // always only one now
                userDetail.mining = this.getLarixMining(market,mining)
                // @ts-ignore
                const obligations:State<Obligation>[] = response[index++].get(market.config.marketId.toString())
                if (obligations && obligations.length>0){
                    for (const obligationState of obligations) {
                        const obligation = this.getLarixObligation(market,obligationState)
                        userDetail.obligations.push(obligation)
                    }
                }
            } else {
                index++
            }
            this.marketDetails.push(userDetail)
        }
    }
    public bindTokenAccountToReserve(){
        this.markets.forEach(market=>{
            market.reserves.forEach(reserve=>{
                let tokenAccounts = this.tokenAccounts.get(reserve.state.info.collateral.mintPubkey.toString())
                if (tokenAccounts && tokenAccounts.length>0){
                    reserve.userCollateralTokenAccount = tokenAccounts[0]
                }
                tokenAccounts = this.tokenAccounts.get(reserve.state.info.liquidity.mintPubkey.toString())
                if (tokenAccounts && tokenAccounts.length>0){
                    reserve.userLiquidityTokenAccount = tokenAccounts[0]
                    reserve.userLiquidityAmount = eX(reserve.userLiquidityTokenAccount.info.amount.toString(),-reserve.state.info.liquidity.mintDecimals)
                } else {
                    reserve.userLiquidityAmount = new BigNumber(0)
                }
            })
        })
    }
    public getLiquidityTokenAccount(reserve:LarixReserve){
        if (reserve.userLiquidityTokenAccount){
            return reserve.userLiquidityTokenAccount
        }
        const tokenAccounts = this.tokenAccounts.get(reserve.state.info.liquidity.mintPubkey.toString())
        return tokenAccounts&&tokenAccounts.length>0?tokenAccounts[0]:undefined
    }
    public getCollateralTokenAccount(reserve:LarixReserve){
        if ( reserve.userCollateralTokenAccount){
            return reserve.userCollateralTokenAccount
        }
        const tokenAccounts = this.tokenAccounts.get(reserve.state.info.collateral.mintPubkey.toString())
        return tokenAccounts&&tokenAccounts.length>0?tokenAccounts[0]:undefined
    }
    private getLarixObligation(market:LarixMarket, obligationSate:State<Obligation>){
        const obligation:LarixObligation = {
            state:obligationSate,
            market,
            totalDeposit:new BigNumber(0),
            borrowLimit:new BigNumber(0),
            liquidateLimit:new BigNumber(0),
            totalBorrow:new BigNumber(0),
            rewardAmount:new BigNumber(0),
            deposits:[],
            borrows:[]
        }
        obligationSate.info.deposits.forEach(deposit=>{
            const reserve = market.reservesMap.get(deposit.depositReserve.toString())
            if (reserve===undefined){
                return
            }
            const amount = eX(deposit.depositedAmount.toString(),-reserve.state.info.liquidity.mintDecimals)
            const value = amount.times(reserve.liquidityPrice)
            const collateral:LarixObligationCollateral={
                reserve,
                amount,
                value,
                rewardAmount:new BigNumber(0)
            }
            obligation.deposits.push(collateral)
            obligation.totalDeposit = obligation.totalDeposit.plus(value)
            obligation.borrowLimit = obligation.borrowLimit.plus(value.times(reserve.collateralFactor))
            obligation.liquidateLimit = obligation.liquidateLimit.plus(value.times(reserve.liquidationThreshold))
        })
        obligationSate.info.borrows.forEach(borrow=>{
            const reserve = market.reservesMap.get(borrow.borrowReserve.toString())
            if (reserve===undefined){
                return
            }
            const userCumulativeBorrowRate = eX(borrow.cumulativeBorrowRateWads.toString(),-18)
            const compoundedInterestRate = reserve.cumulativeBorrowRate.div(userCumulativeBorrowRate)
            const amount = eX(borrow.borrowedAmountWads.toString(),-18-reserve.state.info.liquidity.mintDecimals).times(compoundedInterestRate)
            const liquidity:LarixObligationLiquidity = {
                reserve,
                amount,
                value:amount.times(reserve.liquidityPrice),
                rewardAmount:new BigNumber(0),
            }
            obligation.borrows.push(liquidity)
            obligation.totalBorrow = obligation.totalBorrow.plus(liquidity.value)
        })
        return obligation
    }
    private getLarixMining(market:LarixMarket, miningState:State<Mining>){
        const mining:LarixMining = {
            state:miningState,
            market:market,
            totalValue:new BigNumber(0),
            rewardAmount:new BigNumber(0),
            detail:[]
        }
        miningState.info.miningIndices.forEach(miningIndex=>{

            const reserve = market.reservesMap.get(miningIndex.reserve.toString())
            if (reserve===undefined){
                return
            }
            const amount = eX(miningIndex.unCollLTokenAmount.toString(),-reserve.state.info.liquidity.mintDecimals);
            const value = amount.times(reserve.liquidityPrice)
            const miningDetail:LarixMiningDetail = {
                reserve:reserve,
                amount,
                value
            }
            mining.totalValue = mining.totalValue.plus(value)
            mining.detail.push(miningDetail)
        })

        return mining

    }


    private async getTokenAccounts(){
        const tokenAccountsMap = new Map<string,Array<TokenAccount>>()
        await Promise.all([
            LarixUserInfo.getSolToken(this.connection,tokenAccountsMap,this.publicKey),
            this.getOtherToken(this.connection,tokenAccountsMap,this.publicKey),
        ])
        return tokenAccountsMap
    }
    private async getObligation(programID:PublicKey,marketIDs:PublicKey[]):Promise<Map<string,State<Obligation>[]>>{
        const accountInfos = await this.connection.getProgramAccounts(programID,{
            filters:[
                {
                    dataSize: ObligationLayout.span
                },
                {
                    memcmp: {
                        offset: BufferLayout.u8('version').span+LastUpdateLayout.span+32,
                        /** data to match, as base-58 encoded string and limited to less than 129 bytes */
                        bytes: this.publicKey.toBase58()
                    }
                }
            ]})
        const result:Map<string,State<Obligation>[]> = new Map<string, State<Obligation>[]>()
        marketIDs.forEach(marketID=>{
            let obligations = new Array<State<Obligation>>();
            accountInfos.map(function (item):any{
                const obligation = ObligationParser(item.pubkey,item.account)
                if (obligation.info.lendingMarket.equals(marketID)){
                    obligations.push(obligation)
                }
            })
            obligations =
                obligations.sort( ( a, b)=>{
                    return b.pubkey.toString().localeCompare(a.pubkey.toString())
                })
            result.set(marketID.toString(),obligations)
        })
        return result
    }
    private async getMining(lendingProgramID:PublicKey,lendingMarketIDs:PublicKey[]):Promise<Map<string,State<Mining>[]>>{
        const accountInfos = await this.connection.getProgramAccounts(lendingProgramID,{
            filters:[
                {
                    dataSize: MiningLayout.span
                },
                {
                    memcmp: {
                        offset: BufferLayout.u8('version').span,
                        /** data to match, as base-58 encoded string and limited to less than 129 bytes */
                        bytes: this.publicKey.toBase58()
                    }
                }]
        })
        const result:Map<string,State<Mining>[]> = new Map<string, State<Mining>[]>()
        lendingMarketIDs.forEach(lendingMarketID=>{
            const minings = new Array<State<Mining>>();
            accountInfos.map(function (item):any{
                const mining = MiningParser(item.pubkey,item.account)
                if (mining.info.lendingMarket.equals(lendingMarketID)){
                    minings.push(mining)
                }
            })
            result.set(lendingMarketID.toString(),minings)
        })
        return result
    }
    public async getObligationOfMarket(programID:PublicKey,marketID:PublicKey){
        const accountInfos = await this.connection.getProgramAccounts(programID,{
            filters:[
                {
                    dataSize: ObligationLayout.span
                },
                {
                    memcmp: {
                        offset: BufferLayout.u8('version').span+LastUpdateLayout.span+32,
                        /** data to match, as base-58 encoded string and limited to less than 129 bytes */
                        bytes: this.publicKey.toBase58()
                    }
                }
            ]})
        let obligations = new Array<State<Obligation>>();
        accountInfos.map(function (item):any{
            const obligation = ObligationParser(item.pubkey,item.account)
            if (obligation.info.lendingMarket.equals(marketID)){
                obligations.push(obligation)
            }
        })
        obligations =
            obligations.sort( ( a, b)=>{
                return b.pubkey.toString().localeCompare(a.pubkey.toString())
            })
        return obligations
    }
    public async getMiningOfMarket(lendingProgramID:PublicKey,lendingMarketID:PublicKey){
        const accountInfos = await this.connection.getProgramAccounts(lendingProgramID,{
            filters:[
                {
                    dataSize: MiningLayout.span
                },
                {
                    memcmp: {
                        offset: BufferLayout.u8('version').span,
                        /** data to match, as base-58 encoded string and limited to less than 129 bytes */
                        bytes: this.publicKey.toBase58()
                    }
                }]
        })
        const minings = new Array<State<Mining>>();
        accountInfos.map(function (item):any{
            const mining = MiningParser(item.pubkey,item.account)
            if (mining.info.lendingMarket.equals(lendingMarketID)){
                minings.push(mining)
            }
        })
        return minings
    }
    private static async getSolToken(connection:Connection, tokenAccountsMap:Map<string,Array<TokenAccount>>, userAddress:PublicKey){
        const userAccount = await connection.getAccountInfo(userAddress)
        if (userAccount!==null){
            tokenAccountsMap.set(WRAPPED_SOL_MINT.toString(),[{
                pubkey: userAddress,
                account:userAccount,
                info: {
                    address: userAddress,
                    mint: WRAPPED_SOL_MINT,
                    owner: userAddress,
                    amount: new u64(userAccount.lamports),
                    delegate: null,
                    delegatedAmount: new u64(0),
                    isInitialized: true,
                    isFrozen: false,
                    isNative: true,
                    rentExemptReserve: null,
                    closeAuthority: null,
                }
            }])
        }
    }
    private async getOtherToken(connection:Connection,tokenAccountsMap:Map<string,Array<TokenAccount>>,userAddress:PublicKey){
        const accountsInfo = await connection.getTokenAccountsByOwner(userAddress,{
            programId: TOKEN_PROGRAM_ID
        })
        accountsInfo.value
            .map(function (item: { pubkey: PublicKey; account: AccountInfo<Buffer> }){
                const tokenAccount = TokenAccountParser(item.pubkey,item.account)
                if (tokenAccountsMap.has(tokenAccount.info.mint.toString())){
                    const tokenAccounts = tokenAccountsMap.get(tokenAccount.info.mint.toString());
                    if (tokenAccounts!=undefined){
                        tokenAccounts.push(tokenAccount)
                    }
                } else {
                    const tokenAccounts = new Array<TokenAccount>();

                    tokenAccounts.push(tokenAccount)
                    tokenAccountsMap.set(tokenAccount.info.mint.toString(),tokenAccounts)
                }
            })
        for (const tokenAccounts of tokenAccountsMap.values()){
            if (tokenAccounts.length>1){
                const associatedAccount = await Token.getAssociatedTokenAddress(ASSOCIATED_TOKEN_PROGRAM_ID,TOKEN_PROGRAM_ID,tokenAccounts[0].info.mint,userAddress)
                tokenAccounts.sort((a,b)=>{
                    if (b.info.isNative||b.pubkey.equals(associatedAccount)){
                        return 1;
                    } else if (a.info.isNative||a.pubkey.equals(associatedAccount)){
                        return -1;
                    } else {
                        return b.info.amount.toNumber()-a.info.amount.toNumber()
                    }
                })
            }
        }
    }
}