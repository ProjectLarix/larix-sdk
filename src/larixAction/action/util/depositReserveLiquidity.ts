
import {
    Connection,
    PublicKey, Signer,
    TransactionInstruction,
} from '@solana/web3.js';
import {
    depositReserveLiquidityInstruction, State,
    Reserve,
} from '../../../models';
import BN from "bn.js";
import {getOrCreateAssociatedTokenAccount} from "../../../utils/account";


export const depositReserveLiquidity = async (
    connection:Connection,
    signers: Signer[],
    instructions: TransactionInstruction[],
    cleanupInstructions: TransactionInstruction[],
    source: PublicKey,
    depositAmount: BN,
    wallet: PublicKey,
    detailReserve: State<Reserve>,
    lendingProgramID:PublicKey,
    lendingMarketAuthority:PublicKey,
    destinationCollateralAccount?:PublicKey,

) => {
    const reserve = detailReserve.info
    const reserveAddress = detailReserve.pubkey
    // user from account
    if (destinationCollateralAccount==undefined){
        destinationCollateralAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            instructions,
            wallet,
            reserve.collateral.mintPubkey,
            wallet,
        )
    }
    instructions.push(
        depositReserveLiquidityInstruction(
            depositAmount,
            source,
            destinationCollateralAccount,
            reserveAddress,
            reserve.liquidity.supplyPubkey,
            reserve.collateral.mintPubkey,
            reserve.lendingMarket,
            lendingMarketAuthority,
            wallet,
            lendingProgramID
        ),
    );
    return destinationCollateralAccount
};
