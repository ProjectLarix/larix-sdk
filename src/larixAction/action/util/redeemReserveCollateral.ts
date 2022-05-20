import {
    State,
    redeemReserveCollateralInstruction,
    Reserve,
} from "../../../models";
import {
    Connection,
    PublicKey, Signer,
    TransactionInstruction,
} from '@solana/web3.js';
import BN from "bn.js";
import {refreshReserve} from "./refreshReserve";
import {MarketConfig} from "../../../config";

export const redeemReserveCollateral = async (
    connection: Connection,
    marketConfig:MarketConfig,
    signers: Signer[],
    instructions: TransactionInstruction[],
    cleanupInstructions: TransactionInstruction[],
    sourceCollateral: PublicKey,
    collateralAmount: BN,
    wallet: PublicKey,
    detailReserve: State<Reserve>,
    destinationLiquidity: PublicKey,
    lendingProgramID:PublicKey,
    lendingMarketAuthority:PublicKey,
    withdrawLpAccount?:PublicKey
) => {
    const reserve = detailReserve.info
    const reserveAddress = detailReserve.pubkey
    await refreshReserve(
        connection,
        marketConfig,
        signers,
        instructions,
        cleanupInstructions,
        detailReserve,
        lendingProgramID
    )

    instructions.push(
        redeemReserveCollateralInstruction(
            collateralAmount,
            sourceCollateral,
            destinationLiquidity,
            reserveAddress,
            reserve.collateral.mintPubkey,
            reserve.liquidity.supplyPubkey,
            reserve.lendingMarket,
            lendingProgramID,
            lendingMarketAuthority,
            wallet,
            reserve.isLP,
            reserve.liquidity.params_1,
            marketConfig.bridgeProgramId,
            withdrawLpAccount,

        ),
    );

};
