import BN from "bn.js";
import {State, Reserve} from "../../../models";
import {Connection, PublicKey, Signer, TransactionInstruction} from "@solana/web3.js";
import {createDepositMiningInstruction} from "../../../models/instructions/depositMining";

export const depositMining = async (
    connection:Connection,
    signers: Signer[],
    instructions: TransactionInstruction[],
    cleanupInstructions: TransactionInstruction[],
    sourceAccount:PublicKey,
    depositReserve:State<Reserve>,
    depositAmount:BN,
    wallet:PublicKey,
    lendingMarket:PublicKey,
    mining:PublicKey,
    lendingProgramID:PublicKey,
    lendingMarketAuthority:PublicKey
) => {
    instructions.push(createDepositMiningInstruction(
        mining,
        depositAmount,
        sourceAccount,
        depositReserve,
        lendingMarket,
        lendingProgramID,
        lendingMarketAuthority,
        wallet,
        wallet
    ))
}