import {State, Reserve} from "../../../models";
import {Connection, PublicKey, Signer, TransactionInstruction} from "@solana/web3.js";
import {refreshReserves} from "./refreshReserves";
import {MarketConfig} from "../../../config";

export const refreshReserve = async (
    connection:Connection,
    marketConfig:MarketConfig,
    signers: Signer[],
    instructions: TransactionInstruction[],
    cleanupInstructions: TransactionInstruction[],
    reserve:State<Reserve>,
    lendingProgramID:PublicKey
)=>{
    await refreshReserves(
        connection,
        marketConfig,
        instructions,
        [reserve],
        lendingProgramID
    )
}