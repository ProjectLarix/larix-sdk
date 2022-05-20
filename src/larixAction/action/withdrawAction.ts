import {LarixMining, LarixObligation} from "../../larixUserInfo";
import {
    Keypair,
    PublicKey,
    SystemProgram,
    SYSVAR_CLOCK_PUBKEY,
} from "@solana/web3.js";
import {NATIVE_MINT, TOKEN_PROGRAM_ID} from "@solana/spl-token";
import { getBridgePool, getBridgeProgram } from "../../utils";
import { BN } from "@project-serum/anchor";
import { State} from "../../models";
import {withdrawObligationCollateral} from "./util/withdrawObligationCollateral";
import { U64_MAX } from "../../constant";
import { refreshReserve } from "./util/refreshReserve";
import { withdrawMining } from "./util/withdrawMining";
import { WithdrawLpAccount } from "../../models/state/withdrawLpAccount";
import { redeemReserveCollateral } from "./util/redeemReserveCollateral";
import {LarixInstructionCollector} from "../../utils/larixInstructionCollector";
import {BaseAction} from "./util/baseAction";
import {LarixReserve} from "../../larixMarket";
import {findOrCreateAccountByMint, getOrCreateAssociatedTokenAccount} from "../../utils/account";

export class WithdrawAction extends BaseAction{

    public async withdraw(
        collateralAmount: BN,
        reserve: LarixReserve,
        larixMining?:LarixMining,
        larixObligation?:LarixObligation,

    ) {
        const allReserve = this.marketData.reserveStates
        let mining = larixMining?.state
        let obligation = larixObligation?.state
        const redeemReserveDetail = reserve.state
        const lendingProgramID = this.marketConfig.programId

         const  sourceTokenAccount = this.userInfo.getCollateralTokenAccount(reserve)
         const  destinationTokenAccount = this.userInfo.getLiquidityTokenAccount(reserve)

        const larixTransaction = new LarixInstructionCollector(this.wallet)
        const connection = this.connection

        let sourceAddress;
        if (sourceTokenAccount == undefined) {
            sourceAddress = await getOrCreateAssociatedTokenAccount(
                connection,
                larixTransaction.instructions,
                this.userInfo.publicKey,
                redeemReserveDetail.info.collateral.mintPubkey,
                this.userInfo.publicKey,
            )
        } else {
            sourceAddress = sourceTokenAccount.pubkey
        }
        if (mining === undefined) {
            const myMinings = await this.userInfo.getMiningOfMarket(redeemReserveDetail.info.lendingMarket,lendingProgramID)
            if (myMinings.length > 0) {
                mining = myMinings[0]
            }
        }
        if (obligation === undefined) {
            const myObligations = await this.userInfo.getObligationOfMarket(redeemReserveDetail.info.lendingMarket,lendingProgramID)
            if (myObligations.length > 0) {
                obligation = myObligations[0]
            }
        }

        let hasObligation: boolean = false
        if (obligation != undefined) {
            obligation.info.deposits.map((collateral:any) => {
                if (collateral.depositReserve.equals(redeemReserveDetail.pubkey)) {
                    hasObligation = true
                }
            })
        }
        if (hasObligation) {
            if (obligation != undefined) {
                await withdrawObligationCollateral(
                    connection,
                    this.marketConfig,
                    larixTransaction.signers,
                    larixTransaction.instructions,
                    larixTransaction.cleanupInstructions,
                    obligation,
                    collateralAmount.cmp(new BN(-1)) == 0 ? U64_MAX : collateralAmount,
                    sourceAddress,
                    redeemReserveDetail,
                    this.userInfo.publicKey,
                    allReserve,
                    lendingProgramID,
                    this.marketConfig.authorityId
                )
                //deal withdraw SOL
                if (redeemReserveDetail.info.liquidity.mintPubkey.equals(NATIVE_MINT)) {
                    if (obligation.info.deposits.length + obligation.info.borrows.length >= 4) {
                        let hasLpDeposit = false
                        obligation.info.deposits.map(deposit => {
                            this.marketConfig.lpReserves?.map(lpReserveConfig => {
                                if (deposit.depositReserve.equals(lpReserveConfig.reserveId)) {
                                    hasLpDeposit = true
                                }
                            })
                        })
                        if (hasLpDeposit){
                            larixTransaction.newTransaction()
                        }
                    }
                }

            }
        } else {

            await refreshReserve(
                connection,
                this.marketConfig,
                larixTransaction.signers,
                larixTransaction.instructions,
                larixTransaction.cleanupInstructions,
                redeemReserveDetail,
                lendingProgramID
            )
            await withdrawMining(
                connection,
                larixTransaction.signers,
                larixTransaction.instructions,
                larixTransaction.cleanupInstructions,
                // @ts-ignore
                mining.pubkey,
                sourceAddress,
                redeemReserveDetail,
                collateralAmount.cmp(new BN(-1)) == 0 ? U64_MAX : collateralAmount,
                this.userInfo.publicKey,
                redeemReserveDetail.info.lendingMarket,
                lendingProgramID,
                this.marketConfig.authorityId
            )
        }
        const destinationLiquidityPubkey = await findOrCreateAccountByMint(
            this.connection,
            this.userInfo.publicKey,
            this.userInfo.publicKey,
            larixTransaction.instructions,
            larixTransaction.cleanupInstructions,
            redeemReserveDetail.info.liquidity.mintPubkey,
            larixTransaction.signers,
            destinationTokenAccount
        )
        const withdrawLpPublicKeys: PublicKey[] = []
        if (redeemReserveDetail.info.isLP) {
            const withdrawLpAccounts = await this.withdrawLpAccountProvider(this.userInfo.publicKey, redeemReserveDetail.info.liquidity.params_1)
            if (withdrawLpAccounts.length == 0) {
                const bridgePoolProgram = await getBridgeProgram(connection,this.marketConfig)
                const withdrawLpAccount = Keypair.generate()
                larixTransaction.instructions.push(bridgePoolProgram.instruction.initializeWithdrawLpAccount({
                    accounts: {
                        withdrawLpAccount: withdrawLpAccount.publicKey,
                        owner:  this.userInfo.publicKey,
                        pool: redeemReserveDetail.info.liquidity.params_1,
                        systemProgram: SystemProgram.programId
                    }
                }))
                larixTransaction.signers.push(withdrawLpAccount)
                withdrawLpPublicKeys.push(withdrawLpAccount.publicKey)
                if (obligation){
                    // Transactions may exceed
                    if (obligation.info?.deposits.length+obligation.info?.borrows.length>=4){
                        larixTransaction.newTransaction()
                    }
                }
            } else {
                withdrawLpAccounts.map(account => {
                    withdrawLpPublicKeys.push(account.pubkey)
                })
            }
        }

        await redeemReserveCollateral(
            connection,
            this.marketConfig,
            larixTransaction.signers,
            larixTransaction.instructions,
            larixTransaction.cleanupInstructions,
            sourceAddress,
            collateralAmount.cmp(new BN(-1)) == 0 ? U64_MAX : collateralAmount,
            this.userInfo.publicKey,
            redeemReserveDetail,
            destinationLiquidityPubkey,
            lendingProgramID,
            this.marketConfig.authorityId,
            withdrawLpPublicKeys[0]
        )
        if (redeemReserveDetail.info.isLP) {
            larixTransaction.newTransaction()
            const bridgePoolProgram = await getBridgeProgram(this.connection,this.marketConfig)
            const bridgePool = await getBridgePool(redeemReserveDetail.info.liquidity.params_1,this.connection,this.marketConfig)
            const withdrawLpAccount = withdrawLpPublicKeys[0]
            this.marketConfig.lpReserves?.map(lpReserveConfig => {
                if (redeemReserveDetail.pubkey.equals(lpReserveConfig.reserveId)) {
                    if (bridgePool.isFarm) {
                        //@ts-ignore
                        larixTransaction.instructions.push(bridgePoolProgram.instruction.withdrawFarmLp({
                            accounts: {
                                pool: redeemReserveDetail.info.liquidity.params_1,
                                bridgePoolLpSupply: bridgePool.lpSupply,
                                withdrawAccount: withdrawLpAccount,
                                owner:  this.userInfo.publicKey.toString(),
                                farmPoolProgramId: lpReserveConfig.farmPoolProgramId,
                                farmPool: bridgePool.farmPoolId,
                                farmPoolAuthority: lpReserveConfig.farmPoolAuthority,
                                farmLedger: bridgePool.farmLedger,
                                userLpTokenAccount: destinationLiquidityPubkey,
                                farmPoolLpSupply: lpReserveConfig.farmPoolLpSupply,
                                rewardAccount: bridgePool.rewardSupply[0],
                                rewardVault: lpReserveConfig.farmRewardVault,
                                sysvarClock: SYSVAR_CLOCK_PUBKEY,
                                tokenProgram: TOKEN_PROGRAM_ID,
                                rewardAccountB: bridgePool.rewardSupply.length == 1 ? bridgePool.rewardSupply[0] : bridgePool.rewardSupply[1],
                                rewardVaultB: bridgePool.rewardSupply.length == 1 ? lpReserveConfig.farmRewardVault : lpReserveConfig.farmRewardVaultB
                            }
                        }))
                    } else {
                        larixTransaction.instructions.push(bridgePoolProgram.instruction.withdrawLp({
                            accounts: {
                                pool: redeemReserveDetail.info.liquidity.params_1,
                                bridgePoolLpSupply: bridgePool.lpSupply,
                                withdrawAccount: withdrawLpAccount,
                                owner:  this.userInfo.publicKey,
                                tokenProgram: TOKEN_PROGRAM_ID,
                                userLpTokenAccount: destinationLiquidityPubkey,
                            }
                        }))
                    }

                }
            })

        }
        return larixTransaction
    }



    private async withdrawLpAccountProvider(ownerAddress:PublicKey, bridgePoolAddress:PublicKey):Promise<State<WithdrawLpAccount>[]>{
        const bridgeProgram = await getBridgeProgram(this.connection,this.marketConfig), accounts = await bridgeProgram.account.withdrawLpAccount.all([
            {
                dataSize: bridgeProgram.account.withdrawLpAccount.size
            },
            {
                memcmp: {
                    offset: 8,
                    bytes: ownerAddress.toBase58()
                }
            }
        ]);
        const result:State<WithdrawLpAccount>[] = [];
        accounts.map((account:any) =>{
            if (bridgePoolAddress.equals(account.account.poolId)){
                result.push( {
                    pubkey:account.publicKey,
                    account: null,
                    info: account.account as WithdrawLpAccount,
                } as State<WithdrawLpAccount>)
            }
        })
        return result
    }
}