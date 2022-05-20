import {TOKEN_PROGRAM_ID } from '../../config';
import {
  PublicKey,
  TransactionInstruction,
} from '@solana/web3.js';
import * as BufferLayout from 'buffer-layout';
import { LendingInstruction } from './instruction';

export const initObligationInstruction = (
    obligation: PublicKey,
    lendingMarket: PublicKey,
    obligationOwner: PublicKey,
    lendingProgramID:PublicKey
): TransactionInstruction => {
  const dataLayout = BufferLayout.struct([BufferLayout.u8('instruction')]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode({ instruction: LendingInstruction.InitObligation }, data);

  const keys = [
    { pubkey: obligation, isSigner: false, isWritable: true },
    { pubkey: lendingMarket, isSigner: false, isWritable: false },
    { pubkey: obligationOwner, isSigner: true, isWritable: false },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
    keys,
    programId: lendingProgramID,
    data,
  });
};
