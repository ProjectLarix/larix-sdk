
import BN from "bn.js";
import {State, Reserve} from "../../../models";
import {Connection, PublicKey, Signer, TransactionInstruction} from "@solana/web3.js";
import {createWithdrawMiningInstruction} from "../../../models/instructions/withdrawMining";

export const withdrawMining = async (
    connection:Connection,
    signers: Signer[],
    instructions: TransactionInstruction[],
    cleanupInstructions: TransactionInstruction[],
    mining:PublicKey,
    destinationAccount:PublicKey,
    reserve:State<Reserve>,
    withdrawAmount:BN,
    wallet:PublicKey,
    lendingMarket:PublicKey,
    lendingProgramID:PublicKey,
    lendingMarketAuthority:PublicKey
) => {
    instructions.push(createWithdrawMiningInstruction(
        mining,
        withdrawAmount,
        destinationAccount,
        reserve,
        lendingMarket,
        lendingMarketAuthority,
        wallet,
        lendingProgramID
    ))
}