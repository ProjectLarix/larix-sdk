import {Account, Connection, PublicKey, Signer, TransactionInstruction} from "@solana/web3.js";
import {
    State,
    Obligation,
    refreshObligationInstruction,
    Reserve
} from "../../../models";
import {refreshReserves} from "./refreshReserves";
import {getAllReserveOfObligation} from "./getAllReserveOfObligation";
import {MarketConfig} from "../../../config";

export async function refreshObligation(
    connection:Connection,
    marketConfig:MarketConfig,
    signers: Signer[],
    instructions: TransactionInstruction[],
    cleanupInstructions: TransactionInstruction[],
    obligation: State<Obligation>,
    allReserve:Array<State<Reserve>>,
    lendingProgramID:PublicKey,
    borrowReserve?:State<Reserve>
){
    const reserveSet = new Set<State<Reserve>>()
    getAllReserveOfObligation(obligation,allReserve,reserveSet)
    if (borrowReserve){
        reserveSet.add(borrowReserve)
    }
    const refreshReserveArray = new Array<State<Reserve>>();
    reserveSet.forEach((reserve)=>{
        refreshReserveArray.push(reserve)
    });

    await refreshReserves(
        connection,
        marketConfig,
        instructions,
        refreshReserveArray,
        lendingProgramID
    )

    instructions.push(refreshObligationInstruction(
        obligation.pubkey,
        obligation.info.deposits.map(collateral => collateral.depositReserve),
        obligation.info.borrows.map(liquidity => liquidity.borrowReserve),
        lendingProgramID
    ))
}