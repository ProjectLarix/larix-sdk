import {TOKEN_PROGRAM_ID } from '../../config';
import {
  PublicKey,
  TransactionInstruction,
} from '@solana/web3.js';
import BN from 'bn.js';
import * as BufferLayout from 'buffer-layout';
import * as Layout from '../../utils/layout';
import { LendingInstruction } from './instruction';
import BigNumber from "bignumber.js";

export const borrowObligationLiquidityInstruction = (
    amount: BN,
    sourceLiquidity: PublicKey,
    destinationLiquidity: PublicKey,
    borrowReserve: PublicKey,
    borrowReserveLiquidityFeeReceiver: PublicKey,
    obligation: PublicKey,
    lendingMarket: PublicKey,
    lendingMarketAuthority: PublicKey,
    obligationOwner: PublicKey,
    larixOracleProgram:PublicKey,
    mineMint:PublicKey,
    mineSupply:PublicKey,
    lendingProgaramId:PublicKey,
    hostFeeReceiver?: PublicKey,

): TransactionInstruction => {
  const dataLayout = BufferLayout.struct([
    BufferLayout.u8('instruction'),
    Layout.uint64('liquidityAmount'),
  ]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
      {
        instruction: LendingInstruction.BorrowObligationLiquidity,
        liquidityAmount: amount,
      },
      data,
  );

  const keys = [
    { pubkey: sourceLiquidity, isSigner: false, isWritable: true },
    { pubkey: destinationLiquidity, isSigner: false, isWritable: true },
    { pubkey: borrowReserve, isSigner: false, isWritable: true },


    { pubkey: obligation, isSigner: false, isWritable: true },
    { pubkey: lendingMarket, isSigner: false, isWritable: false },

    { pubkey: lendingMarketAuthority, isSigner: false, isWritable: false },
    { pubkey: obligationOwner, isSigner: true, isWritable: false },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },

    { pubkey: borrowReserveLiquidityFeeReceiver, isSigner: false, isWritable: true,},
    { pubkey: larixOracleProgram, isSigner: false, isWritable: false },
    { pubkey: mineMint, isSigner: false, isWritable: false },
    // { pubkey: mineSupply, isSigner: false, isWritable: false },

  ];

  if (hostFeeReceiver) {
    keys.push({ pubkey: hostFeeReceiver, isSigner: false, isWritable: true });
  }
  return new TransactionInstruction({
    keys,
    programId: lendingProgaramId,
    data,
  });
};