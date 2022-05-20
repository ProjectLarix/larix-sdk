import {PublicKey} from "@solana/web3.js";
import {Token} from "@solana/spl-token";
import {ObligationCollateral } from "../../models";
import { BN } from "@project-serum/anchor";
import {ensureSplAccount, getOrCreateAssociatedTokenAccount} from "../../utils/account";
import { refreshReserve } from "./util/refreshReserve";
import { depositObligationCollateral } from "./util/depositObligationCollateral";
import { depositReserveLiquidity } from "./util/depositReserveLiquidity";
import { U64_MAX } from "../../constant";
import { initMining } from "./util/initMining";
import { depositMining } from "./util/depositMining";
import {LarixInstructionCollector} from "../../utils/larixInstructionCollector";
import {BaseAction} from "./util/baseAction";
import {LarixReserve} from "../../larixMarket";
import {LarixMining, LarixObligation} from "../../larixUserInfo";

export class DepositAction extends BaseAction{

    public async deposit(
        amount: BN,
        depositReserve: LarixReserve,
        larixMining?:LarixMining,
        larixObligation?:LarixObligation,

    ):Promise<LarixInstructionCollector>{
        const lendingProgramID = this.marketConfig.programId
        let mining = larixMining?.state
        let obligation = larixObligation?.state
        const liquidityTokenAccount = this.userInfo.getLiquidityTokenAccount(depositReserve)
        if (liquidityTokenAccount==undefined){
            throw new Error("Invalid liquidity token account")
        }
        let collateralTokenAccountPubkey = this.userInfo.getCollateralTokenAccount(depositReserve)?.pubkey
        const larixTransaction = new LarixInstructionCollector(this.wallet)

        if (mining===undefined){
            const myMinings = await this.userInfo.getMiningOfMarket(this.marketConfig.marketId,this.marketConfig.programId)
            if (myMinings.length>0){
                mining = myMinings[0]
            }
        }
        if (obligation==undefined){
            const myObligations = await this.userInfo.getObligationOfMarket(this.marketConfig.marketId,this.marketConfig.programId)
            if (myObligations.length>0){
                obligation = myObligations[0]
            }
        }
        const balanceNeeded = await Token.getMinBalanceRentForExemptAccount(this.connection)
        const sourcePubkey = ensureSplAccount(
            larixTransaction.instructions,
            larixTransaction.cleanupInstructions,
            liquidityTokenAccount,
            this.userInfo.publicKey,
            amount.toNumber()+balanceNeeded,
            larixTransaction.signers
        )
        if (depositReserve.state.pubkey.toString() == "GaX5diaQz7imMTeNYs5LPAHX6Hq1vKtxjBYzLkjXipMh"){
            await getOrCreateAssociatedTokenAccount(
                this.connection,
                larixTransaction.instructions,
                this.userInfo.publicKey,
                new PublicKey("MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey"),
                this.userInfo.publicKey
            )
        } else if (depositReserve.state.pubkey.toString() == "FStv7oj29DghUcCRDRJN9sEkB4uuh4SqWBY9pvSQ4Rch"){
            await getOrCreateAssociatedTokenAccount(
                this.connection,
                larixTransaction.instructions,
                this.userInfo.publicKey,
                new PublicKey("HZRCwxP2Vq9PCpPXooayhJ2bxTpo5xfpQrwB1svh332p"),
                this.userInfo.publicKey
            )
        }
        let miningID:PublicKey
        await refreshReserve(
            this.connection,
            this.marketConfig,
            larixTransaction.signers,
            larixTransaction.instructions,
            larixTransaction.cleanupInstructions,
            depositReserve.state,
            lendingProgramID
        )
        collateralTokenAccountPubkey = await depositReserveLiquidity(
            this.connection,
            larixTransaction.signers,
            larixTransaction.instructions,
            larixTransaction.cleanupInstructions,
            sourcePubkey,
            amount,
            this.userInfo.publicKey,
            depositReserve.state,
            lendingProgramID,
            this.marketConfig.authorityId,
            collateralTokenAccountPubkey
        )
        if (mining == undefined){
            miningID = await initMining(
                this.connection,
                larixTransaction.signers,
                larixTransaction.instructions,
                larixTransaction.cleanupInstructions,
                this.marketConfig.marketId,
                this.wallet.publicKey,
                lendingProgramID
            )
        } else {

            miningID = mining.pubkey
        }
        if (obligation != undefined) {
            let opened = false
            obligation.info.deposits.map((collateralDetail: ObligationCollateral) => {
                if (collateralDetail.depositReserve.equals(depositReserve.state.pubkey)) {
                    opened = true
                }
            })
            if (opened) {
                await refreshReserve(
                    this.connection,
                    this.marketConfig,
                    larixTransaction.signers,
                    larixTransaction.instructions,
                    larixTransaction.cleanupInstructions,
                    depositReserve.state,
                    lendingProgramID
                )
                await depositObligationCollateral(
                    this.connection,
                    larixTransaction.signers,
                    larixTransaction.instructions,
                    larixTransaction.cleanupInstructions,
                    this.userInfo.publicKey,
                    U64_MAX,
                    collateralTokenAccountPubkey!,
                    depositReserve.state,
                    obligation,
                    lendingProgramID,
                    this.marketConfig.authorityId
                )
            } else {
                await refreshReserve(
                    this.connection,
                    this.marketConfig,
                    larixTransaction.signers,
                    larixTransaction.instructions,
                    larixTransaction.cleanupInstructions,
                    depositReserve.state,
                    lendingProgramID
                )
                await depositMining(
                    this.connection,
                    larixTransaction.signers,
                    larixTransaction.instructions,
                    larixTransaction.cleanupInstructions,
                    collateralTokenAccountPubkey!,
                    depositReserve.state,
                    U64_MAX,
                    this.userInfo.publicKey,
                    this.marketConfig.marketId,
                    miningID,
                    lendingProgramID,
                    this.marketConfig.authorityId
                )
            }
        } else {
            await refreshReserve(
                this.connection,
                this.marketConfig,
                larixTransaction.signers,
                larixTransaction.instructions,
                larixTransaction.cleanupInstructions,
                depositReserve.state,
                lendingProgramID
            )
            await depositMining(
                this.connection,
                larixTransaction.signers,
                larixTransaction.instructions,
                larixTransaction.cleanupInstructions,
                collateralTokenAccountPubkey!,
                depositReserve.state,
                U64_MAX,
                this.userInfo.publicKey,
                this.marketConfig.marketId,
                miningID,
                lendingProgramID,
                this.marketConfig.authorityId
            )

        }
        return larixTransaction
    }
}