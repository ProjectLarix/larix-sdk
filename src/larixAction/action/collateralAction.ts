import {PublicKey} from "@solana/web3.js";
import { depositObligationCollateralInstruction } from "../../models";
import { refreshReserve } from "./util/refreshReserve";
import { initObligation } from "./util/initObligation";
import { withdrawMining } from "./util/withdrawMining";
import { U64_MAX } from "../../constant";
import {LarixInstructionCollector} from "../../utils/larixInstructionCollector";
import {BaseAction} from "./util/baseAction";
import {LarixReserve} from "../../larixMarket";
import {LarixMining, LarixObligation} from "../../larixUserInfo";

export class CollateralAction extends BaseAction{

    public async collateral(
        reserveData:LarixReserve,
        larixMining:LarixMining,
        larixObligation?:LarixObligation,
    ){
        const depositReserveDetail = reserveData.state
        const lendingProgramID = this.marketConfig.programId
        const collateralTokenAccount = this.userInfo.getCollateralTokenAccount(reserveData)
        if (collateralTokenAccount==undefined){
            throw new Error("Invalid collateral token account")
        }
        let mining = larixMining?.state

        let obligation = larixObligation?.state
        const connection = this.userInfo.connection
        const larixTransaction = new LarixInstructionCollector(this.wallet)
        const depositReserveAddress = depositReserveDetail.pubkey
        if (mining===undefined){
            const myMinings = await this.userInfo.getMiningOfMarket(depositReserveDetail.info.lendingMarket,lendingProgramID)
            if (myMinings.length>0){
                mining = myMinings[0]
            }
        }
        if (mining===undefined){
            throw new Error("Invalid mining account")
        }
        const appendReserves: PublicKey[] = []
        if (obligation==undefined){
            const myObligations = await this.userInfo.getObligationOfMarket(depositReserveDetail.info.lendingMarket,lendingProgramID)
            if (myObligations.length>0){
                obligation = myObligations[0]
            }
        }

        let myObligationAddress:PublicKey
        if (obligation == undefined){
            myObligationAddress = await initObligation(
                connection,
                larixTransaction.signers,
                larixTransaction.instructions,
                larixTransaction.cleanupInstructions,
                this.userInfo.publicKey,
                depositReserveDetail.info.lendingMarket,
                lendingProgramID
            )
        } else {
            myObligationAddress = obligation.pubkey
            let newDeposit = true
            obligation.info.deposits.map(deposit => {
                if (deposit.depositReserve.equals(depositReserveAddress)) {
                    newDeposit = false
                }
            })
            if (newDeposit){
                if (obligation!==undefined){
                    obligation.info.deposits.map(deposit2 => {
                        appendReserves.push(deposit2.depositReserve)
                    })
                    obligation.info.borrows.map(borrow => {
                        appendReserves.push(borrow.borrowReserve)
                    })
                }
            }
            console.log("appendReserves",appendReserves);
        }
        await refreshReserve(
            connection,
            this.marketConfig,
            larixTransaction.signers,
            larixTransaction.instructions,
            larixTransaction.cleanupInstructions,
            depositReserveDetail,
            lendingProgramID
        )
        mining.info.miningIndices.map(async (miningIndex) => {
            if (miningIndex.reserve.equals(depositReserveDetail.pubkey)) {
                await withdrawMining(
                    connection,
                    larixTransaction.signers,
                    larixTransaction.instructions,
                    larixTransaction.cleanupInstructions,
                    // @ts-ignore
                    mining.pubkey,
                    collateralTokenAccount.pubkey,
                    depositReserveDetail,
                    U64_MAX,
                    this.userInfo.publicKey,
                    depositReserveDetail.info.lendingMarket,
                    lendingProgramID,
                    this.marketConfig.authorityId
                )
            }
        })


        await refreshReserve(
            connection,
            this.marketConfig,
            larixTransaction.signers,
            larixTransaction.instructions,
            larixTransaction.cleanupInstructions,
            depositReserveDetail,
            lendingProgramID
        )
        larixTransaction.instructions.push(
            depositObligationCollateralInstruction(
                U64_MAX,
                collateralTokenAccount.pubkey,
                depositReserveDetail.info.collateral.supplyPubkey,
                depositReserveAddress,
                myObligationAddress,
                depositReserveDetail.info.lendingMarket,
                lendingProgramID,
                this.marketConfig.authorityId,
                this.userInfo.publicKey,
                this.userInfo.publicKey,
                appendReserves
            ),
        );
        return larixTransaction
    }
}