
import {
    Connection,
    PublicKey, Signer,
    TransactionInstruction,
} from '@solana/web3.js';
import {
    depositObligationCollateralInstruction, State, Obligation,
    Reserve
} from '../../../models';

import BN from "bn.js";

export const depositObligationCollateral = async (
    connection: Connection,
    signers: Signer[],
    instructions: TransactionInstruction[],
    cleanupInstructions: TransactionInstruction[],
    wallet: PublicKey,
    collateralAmount: BN,
    sourceCollateral: PublicKey,
    depositReserveDetail: State<Reserve>,
    obligation: State<Obligation>,
    lendingProgramID:PublicKey,
    lendingMarketAuthority:PublicKey
) => {
    const depositReserve = depositReserveDetail.info;
    const depositReserveAddress = depositReserveDetail.pubkey
    const appendReserves: PublicKey[] = []
    obligation.info.deposits.map(deposit => {
        if (deposit.depositReserve.equals(depositReserveAddress)) {
            obligation.info.deposits.map(deposit2 => {
                appendReserves.push(deposit2.depositReserve)
            })
            obligation.info.borrows.map(borrow => {
                appendReserves.push(borrow.borrowReserve)
            })
        }
    })

    instructions.push(
        depositObligationCollateralInstruction(
            collateralAmount,
            sourceCollateral,
            depositReserve.collateral.supplyPubkey,
            depositReserveAddress,
            obligation.pubkey,
            depositReserve.lendingMarket,
            lendingProgramID,
            lendingMarketAuthority,
            // @FIXME: wallet must sign
            wallet,
            wallet,
            appendReserves
        ),
    );
};
