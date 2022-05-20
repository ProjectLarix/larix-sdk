import {PublicKey, TransactionInstruction} from "@solana/web3.js";
import BufferLayout from "buffer-layout";
import {TOKEN_PROGRAM_ID} from "@solana/spl-token";
import * as Layout from "../../../utils/layout";
import BN from "bn.js";

export function removeLiquidityInstructionV4(
    programId: PublicKey,
    ammId: PublicKey,
    ammAuthority: PublicKey,
    ammOpenOrders: PublicKey,
    ammTargetOrders: PublicKey,
    lpMintAddress: PublicKey,
    poolCoinTokenAccount: PublicKey,
    poolPcTokenAccount: PublicKey,
    poolWithdrawQueue: PublicKey,
    poolTempLpTokenAccount: PublicKey,
    // serum
    serumProgramId: PublicKey,
    serumMarket: PublicKey,
    serumCoinVaultAccount: PublicKey,
    serumPcVaultAccount: PublicKey,
    serumVaultSigner: PublicKey,
    serumEventQueue:PublicKey,
    serumBids: PublicKey,
    serumAsks: PublicKey,
    // user
    userLpTokenAccount: PublicKey,
    userCoinTokenAccount: PublicKey,
    userPcTokenAccount: PublicKey,

    userOwner: PublicKey,

    amount: BN
): TransactionInstruction {
    const dataLayout = BufferLayout.struct([
        BufferLayout.u8('instruction'),
        Layout.uint64("amount")
    ]);
    const keys = [
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: ammId, isSigner: false, isWritable: true },
        { pubkey: ammAuthority, isSigner: false, isWritable: false },
        { pubkey: ammOpenOrders, isSigner: false, isWritable: true },
        { pubkey: ammTargetOrders, isSigner: false, isWritable: true },
        { pubkey: lpMintAddress, isSigner: false, isWritable: true },
        { pubkey: poolCoinTokenAccount, isSigner: false, isWritable: true },
        { pubkey: poolPcTokenAccount, isSigner: false, isWritable: true },
        { pubkey: poolWithdrawQueue, isSigner: false, isWritable: true },
        { pubkey: poolTempLpTokenAccount, isSigner: false, isWritable: true },
        { pubkey: serumProgramId, isSigner: false, isWritable: false },
        { pubkey: serumMarket, isSigner: false, isWritable: true },
        { pubkey: serumCoinVaultAccount, isSigner: false, isWritable: true },
        { pubkey: serumPcVaultAccount, isSigner: false, isWritable: true },
        { pubkey: serumVaultSigner, isSigner: false, isWritable: false },
        { pubkey: userLpTokenAccount, isSigner: false, isWritable: true },
        { pubkey: userCoinTokenAccount, isSigner: false, isWritable: true },
        { pubkey: userPcTokenAccount, isSigner: false, isWritable: true },
        { pubkey: userOwner, isSigner: true, isWritable: false },
        { pubkey: serumEventQueue, isSigner: false, isWritable: true },
        { pubkey: serumBids, isSigner: false, isWritable: true },
        { pubkey: serumAsks, isSigner: false, isWritable: true }
    ]
    const data = Buffer.alloc(dataLayout.span)
    dataLayout.encode(
        {
            instruction: 4,
            amount: amount
        },
        data
    )
    return new TransactionInstruction({
        keys,
        programId,
        data
    })
}