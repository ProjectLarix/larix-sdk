import {Connection, PublicKey, Signer, TransactionInstruction} from "@solana/web3.js";
import {initObligationInstruction, ObligationLayout } from "../../../models";
import {createUninitializedObligationAccount} from "../../../utils/account";

export const initObligation = async (
    connection:Connection,
    signers: Signer[],
    instructions: TransactionInstruction[],
    cleanupInstructions: TransactionInstruction[],
    wallet:PublicKey,
    lendingMarket:PublicKey,
    lendingProgramId:PublicKey,
) => {
    const accountRentExempt = await connection.getMinimumBalanceForRentExemption(
        ObligationLayout.span,
    );

    const obligationAddress = createUninitializedObligationAccount(
        instructions,
        wallet,
        accountRentExempt,
        signers,
        lendingProgramId
    )
    instructions.push(
        initObligationInstruction(
            obligationAddress,
            lendingMarket,
            wallet,
            lendingProgramId
        ),
    );
    return obligationAddress;
};
