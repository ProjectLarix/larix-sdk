import {TOKEN_PROGRAM_ID} from '../../config';
import {
    PublicKey,
    TransactionInstruction,
} from '@solana/web3.js';
import BN from 'bn.js';
import * as BufferLayout from 'buffer-layout';
import * as Layout from '../../utils/layout';
import {LendingInstruction} from './instruction';

export const redeemReserveCollateralInstruction = (
    collateralAmount: number | BN,
    sourceCollateral: PublicKey,
    destinationLiquidity: PublicKey,
    reserve: PublicKey,
    reserveCollateralMint: PublicKey,
    reserveLiquiditySupply: PublicKey,
    lendingMarket: PublicKey,
    lendingProgramID:PublicKey,
    lendingMarketAuthority: PublicKey,
    transferAuthority: PublicKey,
    isLP: boolean,
    bridgePool:PublicKey,
    bridgeProgram?:PublicKey,
    bridgeWithdrawLpAccount?:PublicKey
): TransactionInstruction => {
    const dataLayout = BufferLayout.struct([
        BufferLayout.u8('instruction'),
        Layout.uint64('collateralAmount'),
    ]);

    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode(
        {
            instruction: LendingInstruction.RedeemReserveCollateral,
            collateralAmount: new BN(collateralAmount),
        },
        data,
    );

    const keys = [
        {pubkey: sourceCollateral, isSigner: false, isWritable: true},
        {pubkey: reserve, isSigner: false, isWritable: true},
        {pubkey: reserveCollateralMint, isSigner: false, isWritable: true},
        {pubkey: reserveLiquiditySupply, isSigner: false, isWritable: true},
        {pubkey: lendingMarket, isSigner: false, isWritable: false},
        {pubkey: lendingMarketAuthority, isSigner: false, isWritable: false},
        {pubkey: transferAuthority, isSigner: true, isWritable: false},
        {pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false},
    ];
    if (isLP){
        keys.push( {pubkey: bridgePool, isSigner: false, isWritable: true})
        // @ts-ignore
        keys.push( {pubkey: bridgeProgram, isSigner: false, isWritable: false})
        if (bridgeWithdrawLpAccount){
            keys.push( {pubkey: bridgeWithdrawLpAccount, isSigner: false, isWritable: true})
        }
    } else {
        keys.push({pubkey: destinationLiquidity, isSigner: false, isWritable: true})
    }
    return new TransactionInstruction({
        keys,
        programId: lendingProgramID,
        data,
    });
};