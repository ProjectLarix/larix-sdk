import {
    PublicKey,
    TransactionInstruction,
} from '@solana/web3.js';
import * as BufferLayout from 'buffer-layout';
import { LendingInstruction } from './instruction';

export const createInitMiningInstruction = (
    mining: PublicKey,
    miningOwner: PublicKey,
    lendingMarket:PublicKey,
    lendingProgramID:PublicKey
): TransactionInstruction => {
    const dataLayout = BufferLayout.struct([
        BufferLayout.u8('instruction')
    ]);

    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode({
        instruction: LendingInstruction.InitMining,
    }, data);

    const keys = [
        { pubkey: mining, isSigner: false, isWritable: true },
        { pubkey: miningOwner, isSigner: true, isWritable: false },
        { pubkey: lendingMarket, isSigner: false, isWritable: false },
    ];

    return new TransactionInstruction({
        keys,
        programId: lendingProgramID,
        data,
    });
};