import {TOKEN_PROGRAM_ID } from '../../config';
import {
  PublicKey,
  TransactionInstruction,
} from '@solana/web3.js';
import BN from 'bn.js';
import * as BufferLayout from 'buffer-layout';
import * as Layout from '../../utils/layout';
import { LendingInstruction } from './instruction';

export const depositObligationCollateralInstruction = (
    collateralAmount: BN,
    sourceCollateral: PublicKey,
    destinationCollateral: PublicKey,
    depositReserve: PublicKey,
    obligation: PublicKey,
    lendingMarket: PublicKey,
    lendingProgramID:PublicKey,
    lendingMarketAuthority: PublicKey,
    obligationOwner: PublicKey,
    transferAuthority: PublicKey,
    appendReserves:PublicKey[]
): TransactionInstruction => {
  const dataLayout = BufferLayout.struct([
    BufferLayout.u8('instruction'),
    Layout.uint64('collateralAmount'),
  ]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
      {
        instruction: LendingInstruction.DepositObligationCollateral,
        collateralAmount: collateralAmount,
      },
      data,
  );

  const keys = [
    { pubkey: sourceCollateral, isSigner: false, isWritable: true },
    { pubkey: destinationCollateral, isSigner: false, isWritable: true },
    { pubkey: depositReserve, isSigner: false, isWritable: false },

    { pubkey: obligation, isSigner: false, isWritable: true },
    { pubkey: lendingMarket, isSigner: false, isWritable: false },
    { pubkey: lendingMarketAuthority, isSigner: false, isWritable: false },

    { pubkey: obligationOwner, isSigner: true, isWritable: false },
    { pubkey: transferAuthority, isSigner: true, isWritable: false },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
  ];
  appendReserves.map(reserve => {
    keys.push({ pubkey: reserve, isSigner: false, isWritable: false })
  })
  return new TransactionInstruction({
    keys,
    programId: lendingProgramID,
    data,
  });
};
