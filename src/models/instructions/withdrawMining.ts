import {PublicKey, SYSVAR_CLOCK_PUBKEY, SYSVAR_RENT_PUBKEY, TransactionInstruction} from "@solana/web3.js";
import BN from "bn.js";
import {State, LendingInstruction, Reserve} from "../../models";
import BufferLayout from "buffer-layout";
import {TOKEN_PROGRAM_ID} from "../../config";
import * as Layout from './../../utils/layout';
export const createWithdrawMiningInstruction = (
    mining:PublicKey,
    depositAmount:BN,
    destinationAccount:PublicKey,
    reserve:State<Reserve>,
    lendingMarket:PublicKey,
    lendingMarketAuthority: PublicKey,
    miningOwner:PublicKey,
    lendingProgramID:PublicKey
) => {
    const dataLayout = BufferLayout.struct([
        BufferLayout.u8('instruction'),
        Layout.uint64("withdrawAmount")
    ]);
    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode({
        instruction: LendingInstruction.WithdrawMining,
        withdrawAmount: depositAmount
    }, data);

    const keys = [
        { pubkey: reserve.info.bonus.unCollSupply, isSigner: false, isWritable: true },
        { pubkey: destinationAccount, isSigner: false, isWritable: true },
        { pubkey: mining, isSigner: false, isWritable: true },

        { pubkey: reserve.pubkey, isSigner: false, isWritable: false },
        { pubkey: lendingMarket, isSigner: false, isWritable: false },
        { pubkey: lendingMarketAuthority, isSigner: false, isWritable: false },

        { pubkey: miningOwner, isSigner: true, isWritable: false },
        { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },

    ];

    return new TransactionInstruction({
        keys,
        programId: lendingProgramID,
        data,
    });
}

