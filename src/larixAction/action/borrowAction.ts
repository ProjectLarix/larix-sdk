
import { State, Reserve,borrowObligationLiquidityInstruction } from "../../models";

import { refreshObligation } from "./util/refreshObligation";
import { LarixInstructionCollector } from "../../utils/larixInstructionCollector";
import {BaseAction} from "./util/baseAction";
import {findOrCreateAccountByMint} from "../../utils/account";
import {LarixReserve} from "../../larixMarket";
import {LarixObligation} from "../../larixUserInfo";
import BN from "bn.js";

export class BorrowAction extends BaseAction{

    public async borrow (
        amount: BN,
        borrowReserveData: LarixReserve,
        larixObligation?:LarixObligation
    ){
        const borrowReserve: State<Reserve> = borrowReserveData.state

        const allReserve = this.marketData.reserveStates
        const lendingProgramId = this.marketConfig.programId
        let liquidityTokenAccount = this.userInfo.getLiquidityTokenAccount(borrowReserveData)
        let obligation = larixObligation?.state
        if (obligation===undefined){
            const myObligations = await this.userInfo.getObligationOfMarket(this.marketConfig.marketId,lendingProgramId)
            if (myObligations.length>0){
                obligation = myObligations[0]
            }
        }
        if (obligation===undefined){
            throw new Error("Invalid obligation undefined")
        }
        const larixTransaction = new LarixInstructionCollector(this.wallet)



        const destinationLiquidityPubkey = await findOrCreateAccountByMint(
            this.connection,
            this.userInfo.publicKey,
            this.userInfo.publicKey,
            larixTransaction.instructions,
            larixTransaction.cleanupInstructions,
            borrowReserve.info.liquidity.mintPubkey,
            larixTransaction.signers,
            liquidityTokenAccount
        )
        await refreshObligation(
            this.connection,
            this.marketConfig,
            larixTransaction.signers,
            larixTransaction.instructions,
            larixTransaction.cleanupInstructions,
            obligation,
            allReserve,
            lendingProgramId,
            borrowReserve,

        )
        larixTransaction.instructions.push(
            borrowObligationLiquidityInstruction(
                amount,
                borrowReserve.info.liquidity.supplyPubkey,
                destinationLiquidityPubkey,
                borrowReserve.pubkey,
                borrowReserve.info.liquidity.feeReceiver,
                obligation.pubkey,
                borrowReserve.info.lendingMarket,
                this.marketConfig.authorityId,
                obligation.info.owner,
                this.marketConfig.larixOracleProgramId,
                this.marketConfig.mineMint,
                this.marketConfig.mineSupply,
                lendingProgramId,
            ),
        );
        return larixTransaction
    };
}