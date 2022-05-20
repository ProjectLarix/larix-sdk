
import { U64_MAX } from "../../constant";
import { depositMining } from "./util/depositMining";
import { refreshReserve } from "./util/refreshReserve";
import { withdrawObligationCollateral } from "./util/withdrawObligationCollateral";
import {LarixInstructionCollector} from "../../utils/larixInstructionCollector";
import {BaseAction} from "./util/baseAction";
import {LarixReserve} from "../../larixMarket";
import {LarixMining, LarixObligation} from "../../larixUserInfo";
import {getOrCreateAssociatedTokenAccount} from "../../utils/account";
export class UnCollateralAction extends BaseAction{

    public async unCollateral  (
        reserveData:LarixReserve,
        larixMining:LarixMining,
        larixObligation:LarixObligation,
    ){
        let obligation = larixObligation?.state
        if (obligation==undefined){
            throw new Error("Invalid obligation")
        }
        let mining = larixMining?.state
        if (mining==undefined){
            throw new Error("Invalid mining account")
        }
        const detailReserve = reserveData.state
        const lendingMarket = this.marketConfig.marketId
        const connection = this.userInfo.connection
        const lendingProgramID = this.marketConfig.programId
        const larixTransaction = new LarixInstructionCollector(this.wallet)
        const destinationCollateral = this.userInfo.getCollateralTokenAccount(reserveData)
        if (destinationCollateral==undefined){
            throw new Error("Invalid collateral token account")
        }
        if (mining===undefined){
            const myMinings = await this.userInfo.getMiningOfMarket(lendingMarket,lendingProgramID)
            if (myMinings.length>0){
                mining = myMinings[0]
            }
        }
        if (obligation===undefined){
            const myObligations = await this.userInfo.getObligationOfMarket(lendingMarket,lendingProgramID)
            if (myObligations.length>0){
                obligation = myObligations[0]
            }
        }
        let destinationCollateralAddress;
        if (obligation == undefined){
            destinationCollateralAddress = await getOrCreateAssociatedTokenAccount(
                connection,
                larixTransaction.instructions,
                this.userInfo.publicKey,
                detailReserve.info.collateral.mintPubkey,
                this.userInfo.publicKey,
            )
            larixTransaction.newTransaction()
        } else {
            destinationCollateralAddress = destinationCollateral.pubkey
        }
        await withdrawObligationCollateral(
            this.connection,
            this.marketConfig,
            larixTransaction.signers,
            larixTransaction.instructions,
            larixTransaction.cleanupInstructions,
            obligation,
            U64_MAX,
            destinationCollateralAddress,
            detailReserve,
            this.userInfo.publicKey,
            this.marketData.reserveStates,
            lendingProgramID,
            this.marketConfig.authorityId
        )
        if (obligation.info.deposits.length+obligation.info.borrows.length>=4){
            larixTransaction.newTransaction()
        }
        await refreshReserve(
            this.connection,
            this.marketConfig,
            larixTransaction.signers,
            larixTransaction.instructions,
            larixTransaction.cleanupInstructions,
            detailReserve,
            lendingProgramID
        )
        await depositMining(
            connection,
            larixTransaction.signers,
            larixTransaction.instructions,
            larixTransaction.cleanupInstructions,
            destinationCollateralAddress,
            detailReserve,
            U64_MAX,
            this.userInfo.publicKey,
            detailReserve.info.lendingMarket,
            mining.pubkey,
            lendingProgramID,
            this.marketConfig.authorityId
        )
        return larixTransaction
    }
}