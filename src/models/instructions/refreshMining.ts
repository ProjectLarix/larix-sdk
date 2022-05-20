import BufferLayout from "buffer-layout";
import {LendingInstruction} from "./instruction";
import {PublicKey, TransactionInstruction} from "@solana/web3.js";

export function refreshMiningInstruction(mining:PublicKey,reserves:PublicKey[],lendingProgramID:PublicKey){
    const dataLayout = BufferLayout.struct([BufferLayout.u8('instruction')]);

    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode({ instruction: LendingInstruction.RefreshMining }, data);

    const keys = [
        { pubkey: mining, isSigner: false, isWritable: true },
    ];
    reserves.map(reserve => {
        keys.push({ pubkey: reserve, isSigner: false, isWritable: false })
    })
    return new TransactionInstruction({
        keys,
        programId: lendingProgramID,
        data,
    });
}