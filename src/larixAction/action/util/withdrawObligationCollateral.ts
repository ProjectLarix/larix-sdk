import {
    Connection,
    PublicKey, Signer,
    TransactionInstruction,
} from '@solana/web3.js';
import {
    withdrawObligationCollateralInstruction,
    Reserve,
    State,
    Obligation,
} from '../../../models';
import BN from "bn.js";
import {refreshObligation} from "./refreshObligation";
import {refreshReserves} from "./refreshReserves";
import {MarketConfig} from "../../../config";

export const withdrawObligationCollateral = async (
    connection: Connection,
    marketConfig:MarketConfig,
    signers: Signer[],
    instructions: TransactionInstruction[],
    cleanupInstructions: TransactionInstruction[],
    obligationDetail: State<Obligation>,
    collateralAmount: BN,
    destinationCollateral: PublicKey,
    withdrawReserveDetail: State<Reserve>,
    wallet: PublicKey,
    allReserve: Array<State<Reserve>>,
    lendingProgramID:PublicKey,
    lendingMarketAuthority:PublicKey
) => {
    const withdrawReserve = withdrawReserveDetail.info
    const reserveAddress = withdrawReserveDetail.pubkey

    if (obligationDetail.info.borrows.length > 0) {
        await refreshObligation(
            connection,
            marketConfig,
            signers,
            instructions,
            cleanupInstructions,
            obligationDetail,
            allReserve,
            lendingProgramID
        )
    } else {
        await refreshReserves(
            connection,
            marketConfig,
            instructions,
            [withdrawReserveDetail],
            lendingProgramID

        )
    }

    instructions.push(
        withdrawObligationCollateralInstruction(
            collateralAmount,
            withdrawReserve.collateral.supplyPubkey,
            destinationCollateral,
            reserveAddress,
            obligationDetail.pubkey,
            withdrawReserve.lendingMarket,
            lendingMarketAuthority,
            wallet,
            lendingProgramID
        ),
    );
};
