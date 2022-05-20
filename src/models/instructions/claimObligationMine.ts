import {PublicKey,TransactionInstruction,SYSVAR_CLOCK_PUBKEY} from "@solana/web3.js";
import BufferLayout from "buffer-layout";
import {LendingInstruction} from "./instruction";
import {TOKEN_PROGRAM_ID} from "../../config";
import {State, Obligation} from "../state";

export function createClaimObligationMineInstruction(
    obligation:State<Obligation>,
    miningSupply:PublicKey,
    destination:PublicKey,
    miningOwner:PublicKey,
    lendingMarket:PublicKey,
    lendingMarketAuthority:PublicKey,
    marketProgramId:PublicKey
){
    const dataLayout = BufferLayout.struct([
        BufferLayout.u8('instruction'),
    ]);
    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode({
        instruction: LendingInstruction.ClaimObligationMine,
    }, data);
    const keys = [
        { pubkey: obligation.pubkey, isSigner: false, isWritable: true },
        { pubkey: miningSupply, isSigner: false, isWritable: true },
        { pubkey: destination, isSigner: false, isWritable: true },

        { pubkey: miningOwner, isSigner: true, isWritable: false },
        { pubkey: lendingMarket, isSigner: false, isWritable: false },
        { pubkey: lendingMarketAuthority, isSigner: false, isWritable: false },

        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },

    ];
    obligation.info.deposits.map((item)=>{
        keys.push( { pubkey: item.depositReserve, isSigner: false, isWritable: false })
    })
    obligation.info.borrows.map((item)=>{
        keys.push( { pubkey: item.borrowReserve, isSigner: false, isWritable: false })
    })

    return new TransactionInstruction({
        keys,
        programId: marketProgramId,
        data,
    });
}