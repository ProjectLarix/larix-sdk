import {Connection, PublicKey} from "@solana/web3.js";
import {State, LpInfo, Reserve, ReserveParser, TokenAccount, TokenAccountParser, RaydiumPair} from "../models";
import {getConnection} from "../utils";
import {
    MarketConfig,
    LpReserveConfig, ReserveConfig
} from "../config";
import { AccountInfo } from "@solana/web3.js";
import BN from "bn.js";
import {MarketPrice, PriceParser} from "../models";
import { Amm, AmmParser } from "../models";
import { AmmOpenOrders, AmmOpenOrdersLayoutParser } from "../models";
import { eX } from "../utils";
import {MintInfo} from "@solana/spl-token";
import BigNumber from "bignumber.js";
import { MintParser } from "../models";
import { FarmPoolParser } from "../models";
import {
    BIG_NUMBER_ONE,
    BIG_NUMBER_WAD,
    BIG_NUMBER_ZERO,
    REAL_SLOTS_PER_DAY,
    REAL_SLOTS_PER_YEAR,
    SLOTS_PER_YEAR,
    WAD,
    ZERO
} from "../constant";
import {LarixMarket, LarixReserve} from "./type";
import {getLarixPrice, getMndePrice, getRaydiumPools} from "../utils";
import {MARKETS} from "../config/production";
import {DEFAULT_PRICE_INFO, PriceInfo} from "../type";

export class LarixMarkets{
    public marketConfigs:MarketConfig[]
    public markets:LarixMarket[] = []
    private connection: Connection;
    private allId:PublicKey[] = []
    private priceInfoMap:Map<string,PriceInfo>|undefined
    constructor(
        connection:Connection,
        marketsConfig:MarketConfig[] = MARKETS
    ){
        this.connection = connection
        this.marketConfigs = marketsConfig
        this.marketConfigs.forEach(marketConfig=>{
            marketConfig.reserves.forEach(reserve=>{
                this.allId.push(reserve.reserveId)
                this.allId.push(reserve.larixOraclePriceId)
            })
            marketConfig.lpReserves?.forEach(lpReserve=>{
                this.allId.push(lpReserve.reserveId);
                this.allId.push(lpReserve.ammID);
                this.allId.push(lpReserve.lpMint);
                this.allId.push(lpReserve.coinMintPrice);
                this.allId.push(lpReserve.pcMintPrice);
                this.allId.push(lpReserve.ammOpenOrders);
                this.allId.push(lpReserve.ammCoinMintSupply);
                this.allId.push(lpReserve.ammPcMintSupply);
                this.allId.push(lpReserve.farmPoolID);
                this.allId.push(lpReserve.farmPoolLpSupply);
            })
        })
    }
    public async loadReservesAndRewardApy(){
        this.priceInfoMap = undefined
        const response = await Promise.all([
            this.getSlot(),
            this.getAllAccountsInfo(),
            getRaydiumPools(),
            getLarixPrice(),
            getMndePrice(),
        ])
        const currentSlot = new BN(response[0])
        const allAccountInfo = response[1]
        const raydiumPairs = response[2]
        const larixPrice = response[3]
        const mndePrice = response[4]
        this.parserReserve(currentSlot,allAccountInfo!)
        const priceInfo:Map<string,PriceInfo> = new Map<string, PriceInfo>()
        priceInfo.set("MNDE",{price:mndePrice,decimals:9})
        priceInfo.set("LARIX",{price:larixPrice,decimals:6})
        this.calcRewardApy(raydiumPairs, priceInfo)
    }
    public async loadReserves(){
        this.priceInfoMap = undefined
        const res = await Promise.all([
            this.getSlot(),
            this.getAllAccountsInfo()
        ])
        const currentSlot = new BN(res[0])
        const allAccountInfo = res[1]
        this.parserReserve(currentSlot,allAccountInfo!)
    }
    public async loadRewardApy(){
        const response = await Promise.all(
            [
                getRaydiumPools(),
                getLarixPrice(),
                getMndePrice(),
            ]
        )
        const raydiumPairs = response[0]
        const larixPrice = response[1]
        const mndePrice = response[2]
        const priceInfo:Map<string,PriceInfo> = new Map<string, PriceInfo>()
        priceInfo.set("MNDE",{price:mndePrice,decimals:9})
        priceInfo.set("LARIX",{price:larixPrice,decimals:6})
        this.calcRewardApy(raydiumPairs, priceInfo)
    }
    public calcRewardApy(
        raydiumPairs:[],
        priceInfo:Map<string,PriceInfo>
    ){
        const larixPriceInfo = this.getPriceInfo(priceInfo,"LARIX")
        this.markets.forEach(marketData=>{
            marketData.reserves.forEach(reserve=>{
                if (reserve.state.info.isLP){
                    this.calcReserveRewardApy(reserve,larixPriceInfo.price)
                    const lpInfo = reserve.lpInfo
                    // @ts-ignore
                    const rewardAPriceInfo = this.getPriceInfo(priceInfo,lpInfo.rewardASymbol)
                    // @ts-ignore
                    const rewardBPriceInfo = this.getPriceInfo(priceInfo,lpInfo.rewardBSymbol)
                    this.calcPoolFeeApy(lpInfo,raydiumPairs)
                    this.calcLpApyDetails(lpInfo,reserve.liquidityPrice,rewardAPriceInfo,rewardBPriceInfo)
                }else {
                    this.calcReserveRewardApy(reserve,larixPriceInfo.price)
                }

            })
        })
    }
    private parserReserve(currentSlot:BN,accounts: (AccountInfo<Buffer> | null)[]){
        let index=0
        this.markets = []
        for (const marketConfig of this.marketConfigs) {
            const marketData:LarixMarket = {
                config:marketConfig,
                reserves:[],
                reservesMap:new Map<string, LarixReserve>(),
                reserveStates:[]
            }
            marketConfig.reserves.forEach(reserveConfig=>{
                const reserveState = ReserveParser(reserveConfig.reserveId,accounts[index++])
                const marketPrice = PriceParser(reserveConfig.larixOraclePriceId,accounts[index++])
                reserveState.info.liquidity.marketPrice = marketPrice.info.price.mul(
                    new BN(10)
                        .pow(
                            new BN(18-marketPrice.info.expo)
                        )
                )
                const reserve = this.afterLoad(currentSlot,reserveState,reserveConfig)
                reserve.market = marketData
                marketData.reserveStates.push(reserveState)
                marketData.reservesMap.set(reserveConfig.reserveId.toString(),reserve)
                marketData.reserves.push(reserve)
            })

            marketConfig.lpReserves?.forEach(lpConfig=>{
                const reserveState = ReserveParser(lpConfig.reserveId,accounts[index++])
                const amm = AmmParser(lpConfig.ammID,accounts[index++])
                const lpMint = MintParser(lpConfig.lpMint,accounts[index++])
                const coinMintPrice = PriceParser(lpConfig.coinMintPrice,accounts[index++])
                const pcMintPrice = PriceParser(lpConfig.pcMintPrice,accounts[index++])
                const ammOpenOrders = AmmOpenOrdersLayoutParser(lpConfig.ammOpenOrders,accounts[index++])
                const ammCoinMint = TokenAccountParser(lpConfig.ammCoinMintSupply,accounts[index++])
                const ammPcMint = TokenAccountParser(lpConfig.ammPcMintSupply,accounts[index++])
                const poolInfo = FarmPoolParser(lpConfig.farmPoolID,accounts[index++])
                const farmPoolLpToken =  TokenAccountParser(lpConfig.farmPoolLpSupply,accounts[index++])


                const lpPrice = this.getLpPrice(amm, ammOpenOrders,ammCoinMint,ammPcMint,coinMintPrice,pcMintPrice,lpMint)
                reserveState.info.liquidity.marketPrice = eX(lpPrice,18)

                const reserve = this.afterLoad(currentSlot,reserveState,lpConfig)
                reserve.market = marketData
                reserve.lpInfo = this.getLpInfo(lpConfig,poolInfo,lpMint,farmPoolLpToken)
                marketData.reserveStates.push(reserveState)
                marketData.reservesMap.set(lpConfig.reserveId.toString(),reserve)
                marketData.reserves.push(reserve)
            })
            this.markets.push(marketData)
        }
    }
    private afterLoad(currentSlot:BN,reserveState:State<Reserve>,reserveConfig:ReserveConfig|LpReserveConfig){
        const reserve = {} as LarixReserve
        reserve.reserveConfig = reserveConfig
        reserve.state = reserveState
        this.formatReserveBeforeRefresh(reserve)
        this.refreshReserve(currentSlot,reserve)
        this.formatReserveAfterRefresh(reserve)
        this.calcApy(reserve)
        return reserve
    }

    private formatReserveBeforeRefresh(reserve:LarixReserve){
        const info = reserve.state.info
        reserve.collateralFactor = new BigNumber(info.config.loanToValueRatio.toString()).div(100)
        reserve.liquidationThreshold = info.config.liquidationThreshold / 100

        reserve.miningSpeed = eX(info.bonus.totalMiningSpeed.toString(),-6)
        reserve.dailyMining = reserve.miningSpeed.times(REAL_SLOTS_PER_DAY)
        reserve.supplyMiningRate = new BigNumber(info.bonus.kinkUtilRate.toNumber()).div(100)
        reserve.borrowMiningRate = reserve.state.info.isLP?new BigNumber(0):new BigNumber(1).minus(reserve.supplyMiningRate)

        reserve.depositLimit = eX(info.depositLimit.toString(),-info.liquidity.mintDecimals)
        reserve.totalCollateralTokenSupply = eX(info.collateral.mintTotalSupply.toString(),-1*Number( info.liquidity.mintDecimals))
        reserve.borrowInterestFee = eX(info.config.fees.borrowInterestFeeWad.toString(),-18)
        reserve.liquidityPrice = eX(info.liquidity.marketPrice.toString()||"0",-18)

        const totalAvailable = new BigNumber(info.liquidity.availableAmount.toString()).minus(eX(info.liquidity.ownerUnclaimed.toString(),-18)).toString()
        reserve.totalAvailableAmount = totalAvailable.startsWith("-")?BIG_NUMBER_ZERO:eX(totalAvailable,-info.liquidity.mintDecimals)
        reserve.totalAvailableValue =  reserve.totalAvailableAmount.times( reserve.liquidityPrice)

        reserve.utilizationRate = this.getUtilizationRate(info)
    }
    private refreshReserve(currentSlot:BN,reserve:LarixReserve){
        this.accrueInterest(currentSlot,reserve)
        this.refreshRewardIndex(currentSlot,reserve)
    }
    private accrueInterest(currentSlot:BN,reserve:LarixReserve){
        const currentBorrowRate = this.getCurrentBorrowRate(reserve.state.info ,reserve.utilizationRate)
        const slotInterestRate = currentBorrowRate.div(SLOTS_PER_YEAR)
        const slotDiff = currentSlot.sub(reserve.state.info.lastUpdate.slot)
        const compoundedInterestRate = new BigNumber(slotInterestRate.plus(1).pow(slotDiff.toNumber()))
        const info = reserve.state.info
        info.liquidity.cumulativeBorrowRateWads =
            new BN(
                new BigNumber(info.liquidity.cumulativeBorrowRateWads.toString())
                    .times(compoundedInterestRate).toFixed(0)
            )
        const newUnclaimed =
            new BN(
                new BigNumber(info.liquidity.borrowedAmountWads.toString())
                    .times(compoundedInterestRate.minus(1))
                    .times(
                        new BigNumber(info.config.fees.borrowInterestFeeWad.toString()).
                        div(BIG_NUMBER_WAD)
                    )
                    .toFixed(0)
            )

        info.liquidity.ownerUnclaimed = info.liquidity.ownerUnclaimed.add(newUnclaimed)
        info.liquidity.borrowedAmountWads =
            new BN(
                new BigNumber(info.liquidity.borrowedAmountWads.toString())
                    .times(compoundedInterestRate).toFixed(0)
            )
    }
    private refreshRewardIndex(currentSlot:BN,reserve:LarixReserve){
        const info = reserve.state.info
        const slotDiff = currentSlot.sub(info.lastUpdate.slot)

        const slotDiffTotalMining = new BigNumber(info.bonus.totalMiningSpeed.toString()).times(new BigNumber(slotDiff.toString()))
        if (!reserve.supplyMiningRate.eq(0)){
            if (info.collateral.mintTotalSupply.cmp(ZERO)!==0){
                const plus = slotDiffTotalMining.times(reserve.supplyMiningRate).div(new BigNumber(info.collateral.mintTotalSupply.toString())).times(BIG_NUMBER_WAD)

                const newIndex = new BigNumber(info.bonus.lTokenMiningIndex.toString()).plus(
                    plus
                ).toString()

                info.bonus.lTokenMiningIndex = new BN(newIndex.split(".")[0])
            }
        }
        if (!reserve.borrowMiningRate.eq(0)){
            if (info.liquidity.borrowedAmountWads.cmp(ZERO)!==0){
                const newIndex = new BigNumber(info.bonus.borrowMiningIndex.toString()).plus(
                    slotDiffTotalMining.times(reserve.borrowMiningRate).div(
                        new BigNumber(info.liquidity.borrowedAmountWads.toString()).div(BIG_NUMBER_WAD).div(eX(info.liquidity.cumulativeBorrowRateWads.toString(),-18))
                    ).times(BIG_NUMBER_WAD)
                )
                info.bonus.borrowMiningIndex = new BN(newIndex.toFixed(0))
            }
        }
    }

    private formatReserveAfterRefresh(reserve:LarixReserve){
        const info = reserve.state.info

        reserve.cumulativeBorrowRate  = eX(info.liquidity.cumulativeBorrowRateWads.toString(),-18)

        reserve.totalBorrowedAmount = eX(info.liquidity.borrowedAmountWads.toString(),-18-info.liquidity.mintDecimals)
        reserve.totalBorrowedValue = reserve.totalBorrowedAmount.times( reserve.liquidityPrice)

        reserve.totalDepositAmount = eX(info.liquidity.availableAmount.toString(),-info.liquidity.mintDecimals)
            .plus(reserve.totalBorrowedAmount)
            .minus(eX(info.liquidity.ownerUnclaimed.toString(),-18-info.liquidity.mintDecimals))
        reserve.totalDepositValue =  reserve.totalDepositAmount.times( reserve.liquidityPrice)


        if (reserve.totalCollateralTokenSupply.isZero() || reserve.totalDepositAmount.isZero()){
            reserve.exchangeRate = BIG_NUMBER_ONE
        } else {
            reserve.exchangeRate = reserve.totalCollateralTokenSupply.div(reserve.totalDepositAmount)
        }
        // set utilizationRate again
        reserve.utilizationRate = this.getUtilizationRate(reserve.state.info)
    }
    private calcApy(reserve:LarixReserve){
        const currentBorrowRate = this.getCurrentBorrowRate(reserve.state.info ,reserve.utilizationRate)
        const slotInterestRate = currentBorrowRate.div(SLOTS_PER_YEAR)
        if (reserve.state.info.isLP) {
            reserve.borrowApy = new BigNumber(0)
        } else {
            reserve.borrowApy = new BigNumber(slotInterestRate.plus(1).toNumber()**REAL_SLOTS_PER_YEAR).minus(1)
        }

        reserve.supplyApy = reserve.borrowApy.times(0.8).times(reserve.utilizationRate)

    }
    private getCurrentBorrowRate(reserve:Reserve,utilizationRate:BigNumber):BigNumber{

        const optimalUtilizationRate = new BigNumber(reserve.config.optimalUtilizationRate).div(100)
        const lowUtilization = utilizationRate.lt(optimalUtilizationRate)
        if (lowUtilization || optimalUtilizationRate.eq(1)){
            const normalizedRate = utilizationRate.div(optimalUtilizationRate)
            const minRate = new BigNumber(reserve.config.minBorrowRate).div(100)
            const rateRange = new BigNumber(reserve.config.optimalBorrowRate-reserve.config.minBorrowRate).div(100)
            return normalizedRate.times(rateRange).plus(minRate)
        } else {
            const normalizedRate = utilizationRate.minus(optimalUtilizationRate).div(new BigNumber(1).minus(optimalUtilizationRate))
            const minRate = reserve.config.optimalBorrowRate/100
            const rateRange = new BigNumber(reserve.config.maxBorrowRate-reserve.config.optimalBorrowRate).div(100)
            return normalizedRate.times(rateRange).plus(minRate)
        }
    }
    private getUtilizationRate(reserve:Reserve):BigNumber{
        const borrowedAmount = new BigNumber(reserve.liquidity.borrowedAmountWads.toString())
            .div(BIG_NUMBER_WAD);
        const totalSupply = new BigNumber(reserve.liquidity.availableAmount.toString()).plus(borrowedAmount).minus(eX(reserve.liquidity.ownerUnclaimed.toString(),-18));
        if (totalSupply.eq(0)){
            return BIG_NUMBER_ZERO
        }
        if (reserve.liquidity.borrowedAmountWads.lt(WAD)){
            return BIG_NUMBER_ZERO
        }
        if (borrowedAmount.gt(totalSupply)){
            return BIG_NUMBER_ONE
        } else {
            return borrowedAmount.div(
                totalSupply
            )
        }

    }


    private calcReserveRewardApy(reserve:LarixReserve,larixPrice:BigNumber){
        if (larixPrice.eq(0)){
            reserve.supplyRewardApy = 0
            reserve.borrowRewardApy = 0
        }else {
            reserve.supplyRewardApy =
                reserve.supplyMiningRate
                    .times(reserve.miningSpeed).times(REAL_SLOTS_PER_DAY).times(365)
                    .times(larixPrice)
                    .div(reserve.totalDepositValue.isZero()?1:reserve.totalDepositValue)
                    .times(reserve.market.config.name==='main'?10:1)
            reserve.borrowRewardApy =
                reserve.borrowMiningRate
                    .times(reserve.miningSpeed).times(REAL_SLOTS_PER_DAY).times(365)
                    .times(larixPrice)
                    .div(reserve.totalBorrowedValue.isZero()?1:reserve.totalBorrowedValue)
                    .times(reserve.market.config.name==='main'?10:1)
        //    reserve.reserveConfig.name!=='main'
        }
    }
    private calcPoolFeeApy(lpInfo:LpInfo,raydiumPairs :RaydiumPair[]){
        const res =  raydiumPairs.find((item:any) => item.amm_id === lpInfo.amm_id.toString())?.apy
        lpInfo.lpFeesApr = res!/100
    }
    private calcLpApyDetails(lpInfo:LpInfo,lpPrice:BigNumber,rewardAPriceInfo:PriceInfo, rewardBPriceInfo:PriceInfo){
        const tvl = lpInfo.farmPoolLpSupply.times(lpPrice)
        const rewardAOneYear = eX(lpInfo.perBlock.times(rewardAPriceInfo.price).times(2*60*60*24*365).toString(),-rewardAPriceInfo.decimals)
        const rewardBOneYear = eX(lpInfo.perBlockB.times(rewardBPriceInfo.price).times(2*60*60*24*365).toString(),-rewardBPriceInfo.decimals)
        const aprA = rewardAOneYear.div(tvl.isEqualTo(0)?1:tvl).times(100)
        const aprB = rewardBOneYear.div(tvl.isEqualTo(0)?1:tvl).times(100)
        const apyA = (1+Number(aprA.toFixed(4))/365/100)**365-1
        const apyB = (1+Number(aprB.toFixed(4))/365/100)**365-1
        const totalApy =  apyA + apyB
        lpInfo.lpApr = new BigNumber(totalApy)
        lpInfo.lpRewardApyA = new BigNumber(apyA)
        lpInfo.lpRewardApyB = new BigNumber(apyB)
    }
    private async getSlot(){
        return await this.connection.getSlot("processed")
    }
    private async getAllAccountsInfo(){
        if (this.allId.length<=100){
            return  await this.connection.getMultipleAccountsInfo(this.allId)
        } else if (this.allId.length<=200){
            const multipleAccountsInfo = await Promise.all(
                [
                    this.connection.getMultipleAccountsInfo(this.allId.slice(0,100)),
                    this.connection.getMultipleAccountsInfo(this.allId.slice(100,this.allId.length))
                ]
            )
            return multipleAccountsInfo[0].concat(multipleAccountsInfo[1])
        } else if (this.allId.length<=300){
            const multipleAccountsInfo = await Promise.all(
                [
                    this.connection.getMultipleAccountsInfo(this.allId.slice(0,100)),
                    this.connection.getMultipleAccountsInfo(this.allId.slice(100,200)),
                    this.connection.getMultipleAccountsInfo(this.allId.slice(200,this.allId.length))
                ]
            )
            return multipleAccountsInfo[0].concat(multipleAccountsInfo[1]).concat(multipleAccountsInfo[2])
        }

    }

    private getPriceInfo(otherPriceInfo:Map<string,PriceInfo>,symbol:string):PriceInfo{
        if (symbol===undefined||symbol===""){
            return DEFAULT_PRICE_INFO
        }
        let priceInfo:PriceInfo|undefined = otherPriceInfo.get(symbol)
        if (priceInfo==undefined){
            if (this.priceInfoMap==undefined) {
                this.loadPriceInfo()
            }
            priceInfo = this.priceInfoMap?.get(symbol)
        }
        if (priceInfo==undefined){
            priceInfo = DEFAULT_PRICE_INFO
        }
        return priceInfo
    }
    private loadPriceInfo(){
        this.priceInfoMap = new Map<string,PriceInfo>()
        this.markets.forEach(marketDta=>{
            marketDta.reserves.forEach(reserve=>{
                // @ts-ignore
                this.priceInfoMap.set(
                    reserve.reserveConfig.name,
                    {
                        price:reserve.liquidityPrice,
                        decimals:reserve.state.info.liquidity.mintDecimals
                    }
                )
            })
        })
    }



    private getLpPrice(
        amm:State<Amm>,
        ammOpenOrders:State<AmmOpenOrders>,
        ammCoinMint:TokenAccount,
        ammPcMint:TokenAccount,
        coinMintPrice:State<MarketPrice>,
        pcMintPrice:State<MarketPrice>,
        lpMint:State<MintInfo>,
    ){
        const totalAmount = this.getLpTotalAmount(amm,ammOpenOrders,ammCoinMint,ammPcMint)
        const coinTotalAmount = totalAmount.coinTotalAmount
        const pcTotalAmount = totalAmount.pcTotalAmount
        const coinPrice = eX(coinMintPrice.info.price.toString(),-coinMintPrice.info.expo)
        const pcPrice = eX(pcMintPrice.info.price.toString(),-pcMintPrice.info.expo)
        const lpTotalSupplyAmount = eX(lpMint.info.supply.toString(),-lpMint.info.decimals)
        const price = (2 * Math.sqrt(coinTotalAmount.times(coinPrice).toNumber())*Math.sqrt(pcTotalAmount.times(pcPrice).toNumber()))/lpTotalSupplyAmount.toNumber()
        return price
    }
    private getLpInfo(
        lpConfig:LpReserveConfig,
        poolInfo:State<any>,
        lpMint:State<MintInfo>,
        farmPoolLpToken:TokenAccount
    ){
        const lpInfo ={} as LpInfo
        // @ts-ignore
        lpInfo.rewardASymbol = lpConfig.rewardA
        // @ts-ignore
        lpInfo.rewardBSymbol = lpConfig.rewardB
        if ([4,5].includes(lpConfig.version)) {
            lpInfo.perBlock = new BigNumber(poolInfo.info.perBlock)
            lpInfo.perBlockB = new BigNumber(poolInfo.info.perBlockB)
        }else {
            lpInfo.perBlock = new BigNumber(0)
            lpInfo.perBlockB = new BigNumber(poolInfo.info.rewardPerBlock)
        }
        lpInfo.farmPoolLpSupply = eX(farmPoolLpToken.info.amount.toString(),-lpMint.info.decimals)
        lpInfo.amm_id = lpConfig.ammID
        return lpInfo
    }
    private getLpTotalAmount(
        amm:State<Amm>,
        ammOpenOrders:State<AmmOpenOrders>,
        ammCoinMint:TokenAccount,
        ammPcMint:TokenAccount,
    ){
        const coinTotalAmount = eX(
            ammCoinMint.info.amount.add(ammOpenOrders.info.baseTokenTotal).sub(amm.info.needTakePnlCoin).toString(),
            -amm.info.coinDecimals.toNumber()
        )
        const pcTotalAmount = eX(
            ammPcMint.info.amount.add(ammOpenOrders.info.quoteTokenTotal).sub(amm.info.needTakePnlPc).toString(),
            -amm.info.pcDecimals.toNumber()
        )
        return {
            coinTotalAmount:coinTotalAmount,
            pcTotalAmount:pcTotalAmount,
        }
    }
}