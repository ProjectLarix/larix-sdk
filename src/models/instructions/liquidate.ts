import {TOKEN_PROGRAM_ID } from '../../config';
import {
    PublicKey,
    TransactionInstruction,
} from '@solana/web3.js';
import * as BufferLayout from 'buffer-layout';
import * as Layout from '../../utils/layout';
import { LendingInstruction } from './instruction';
import BN from "bn.js";

export const createLiquidateInstruction = (
    liquidityAmount:BN,
    sourceLiquidity: PublicKey,
    destinationCollateral: PublicKey,
    repayReserve:PublicKey,
    repayReserveLiquiditySupply:PublicKey,
    withdrawReserve:PublicKey,
    withdrawReserveCollateralSupply:PublicKey,
    obligation:PublicKey,
    lendingMarket:PublicKey,
    lendingMarketAuthority:PublicKey,
    userTransferAuthority:PublicKey,
    lendingProgramID:PublicKey,
): TransactionInstruction => {
    const dataLayout = BufferLayout.struct([
        BufferLayout.u8('instruction'),
        Layout.uint64("liquidityAmount")
    ]);

    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode({
        instruction: LendingInstruction.LiquidateObligation,
        liquidityAmount: liquidityAmount
    }, data);

    const keys = [
        { pubkey: sourceLiquidity, isSigner: false, isWritable: true },
        { pubkey: destinationCollateral, isSigner: false, isWritable: true },
        { pubkey: repayReserve, isSigner: false, isWritable: true },

        { pubkey: repayReserveLiquiditySupply, isSigner: false, isWritable: true },
        { pubkey: withdrawReserve, isSigner: false, isWritable: false },
        { pubkey: withdrawReserveCollateralSupply, isSigner: false, isWritable: true },

        { pubkey: obligation, isSigner: false, isWritable: true },
        { pubkey: lendingMarket, isSigner: false, isWritable: false },
        { pubkey: lendingMarketAuthority, isSigner: false, isWritable: false },

        { pubkey: userTransferAuthority, isSigner: true, isWritable: false },
        // { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ];

    return new TransactionInstruction({
        keys,
        programId: lendingProgramID,
        data,
    });
};

