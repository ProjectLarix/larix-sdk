
import { refreshReserves } from "./util/refreshReserves";
import {repayObligationLiquidityInstruction } from "../../models";
import { BN } from "@project-serum/anchor";
import { LarixInstructionCollector } from "../../utils/larixInstructionCollector";
import {BaseAction} from "./util/baseAction";
import {ensureSplAccount} from "../../utils/account";
import {LarixReserve} from "../../larixMarket";
import {LarixObligation} from "../../larixUserInfo";

export class RepayAction extends BaseAction{
    /**
     *
     * @param amount U64_MAX will repay all
     * @param repayReserve
     * @param larixObligation
     */
    public async repay(
        amount: BN,
        repayReserve: LarixReserve,
        larixObligation:LarixObligation,
    ){
        const lendingProgramID = this.marketConfig.programId
        const repayReserveDetail = repayReserve.state
        const liquidityTokenAccount = this.userInfo.getLiquidityTokenAccount(repayReserve)
        if (liquidityTokenAccount===undefined){
            throw new Error("Invalid liquidity token account")
        }
        let obligation = larixObligation?.state
        if (obligation === undefined) {
            const myObligations = await this.userInfo.getObligationOfMarket(repayReserveDetail.info.lendingMarket,lendingProgramID)
            if (myObligations.length > 0) {
                obligation = myObligations[0]
            }
        }
        if (obligation==undefined){
            throw new Error("Invalid obligation")
        }
        const larixTransaction = new LarixInstructionCollector(this.wallet)

        const sourceLiquidity = ensureSplAccount(
            larixTransaction.instructions,
            larixTransaction.cleanupInstructions,
            liquidityTokenAccount,
            this.userInfo.publicKey,
            liquidityTokenAccount.info.amount.toNumber() - 10000,
            larixTransaction.signers
        );
        await refreshReserves(
            this.connection,
            this.marketConfig,
            larixTransaction.instructions,
            [repayReserveDetail],
            lendingProgramID)
        larixTransaction.instructions.push(
            repayObligationLiquidityInstruction(
                amount,
                sourceLiquidity,
                repayReserveDetail.info.liquidity.supplyPubkey,
                repayReserveDetail.pubkey,
                obligation.pubkey,
                repayReserveDetail.info.lendingMarket,
                lendingProgramID,
                this.userInfo.publicKey,
            ),
        );
        return larixTransaction
    }
}