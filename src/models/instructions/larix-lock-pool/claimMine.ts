import {PublicKey, TransactionInstruction} from "@solana/web3.js";
import BufferLayout from "buffer-layout";
import * as Layout from "../../../utils/layout";
import {LendingInstruction} from "../instruction";
import {TOKEN_PROGRAM_ID} from "@solana/spl-token";
import BN from "bn.js";
export interface Params{
    obligation?:PublicKey,
    destination?:PublicKey,
    sourceAccount?:PublicKey,
    larixLockProgram?:PublicKey,
    larixLockPool?:PublicKey,
    userLarixInfoAccount?:PublicKey
}

export function createClaimMineInstruction(
    lendingMarket:PublicKey,
    lendingMarketAuthority:PublicKey,
    owner:PublicKey,
    mining:PublicKey,
    claimTimes:BN,
    claimRatio:BN,
    lendingProgaramId:PublicKey,
    other:Params
){
    const dataLayout = BufferLayout.struct([
        BufferLayout.u8('instruction'),
        Layout.uint16("subsidyTimes"),
        Layout.uint16("claimRatio"),
    ]);
    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode({
        instruction: LendingInstruction.ClaimMine,
        subsidyTimes: claimTimes,
        claimRatio
    }, data);
    const keys = [
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: lendingMarket, isSigner: false, isWritable: false },
        { pubkey: lendingMarketAuthority, isSigner: false, isWritable: false },
        { pubkey: owner, isSigner: true, isWritable: false },
        { pubkey: mining, isSigner: false, isWritable: true },
    ]
    if (other.obligation){
        keys.push({ pubkey: other.obligation, isSigner: false, isWritable: true })
    }
    if (claimTimes.toNumber()==100 && other.destination && other.sourceAccount){
        keys.push({ pubkey: other.sourceAccount, isSigner: false, isWritable: true })
        keys.push({ pubkey: other.destination, isSigner: false, isWritable: true })
    } else if(other.larixLockProgram && other.larixLockPool && other.userLarixInfoAccount){
        keys.push({ pubkey: other.larixLockProgram, isSigner: false, isWritable: false })
        keys.push({ pubkey: other.larixLockPool, isSigner: false, isWritable: false })
        keys.push({ pubkey: other.userLarixInfoAccount, isSigner: false, isWritable: true })
    }
    return new TransactionInstruction({
        keys,
        programId:lendingProgaramId,
        data
    })
}