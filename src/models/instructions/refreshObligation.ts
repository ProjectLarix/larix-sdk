import {
  PublicKey,
  TransactionInstruction,
} from '@solana/web3.js';
import BufferLayout from 'buffer-layout';
import { LendingInstruction } from './instruction';

export const refreshObligationInstruction = (
    obligation: PublicKey,
    depositReserves: PublicKey[],
    borrowReserves: PublicKey[],
    lendingProgramID:PublicKey,
): TransactionInstruction => {
  const dataLayout = BufferLayout.struct([BufferLayout.u8('instruction')]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
      { instruction: LendingInstruction.RefreshObligation },
      data,
  );

  const keys = [
    { pubkey: obligation, isSigner: false, isWritable: true },
  ];

  for (const depositReserve of depositReserves) {
    keys.push({ pubkey: depositReserve, isSigner: false, isWritable: false });
  }
  for (const borrowReserve of borrowReserves) {
    keys.push({ pubkey: borrowReserve, isSigner: false, isWritable: false });
  }
  return new TransactionInstruction({
    keys,
    programId: lendingProgramID,
    data,
  });
};
