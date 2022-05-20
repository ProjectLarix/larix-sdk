import {MiningLayout} from "../../../models/state/mining";
import {createInitMiningInstruction} from "../../../models/instructions/initMining";
import {Connection, PublicKey, Signer, TransactionInstruction} from "@solana/web3.js";
import {createUninitializedMiningAccount} from "../../../utils/account";


export const initMining = async (
    connection:Connection,
    signers: Signer[],
    instructions: TransactionInstruction[],
    cleanupInstructions: TransactionInstruction[],
    lendingMarket:PublicKey,
    wallet:PublicKey,
    lendingProgramID:PublicKey
) => {
    const accountRentExempt = await connection.getMinimumBalanceForRentExemption(
        MiningLayout.span
    )
    const miningAccount = createUninitializedMiningAccount(
        instructions,
        lendingProgramID,
        wallet,
        accountRentExempt,
        signers
    )
    instructions.push(
        createInitMiningInstruction(
            miningAccount,
            wallet,
            lendingMarket,
            lendingProgramID
        )
    )
    return miningAccount
}