import * as BufferLayout from 'buffer-layout';
import * as Layout from '../../../utils/layout';
import {AccountInfo, PublicKey} from "@solana/web3.js";
import {State} from "../state";
import BN from "bn.js";
export interface FarmLedger {
    state:BN,
    id:PublicKey,
    owner:PublicKey,
    deposited:BN,
    rewardDebt:BN,
    rewardDebtB:BN
}
const FarmLedgerLayout = BufferLayout.struct([
    Layout.uint64("state"),
    Layout.publicKey("id"),
    Layout.publicKey("owner"),
    Layout.uint64("deposited"),
    Layout.uint128("rewardDebt"),
    Layout.uint128("rewardDebtB")
]);
export const FarmLedgerParser = (pubkey: PublicKey, info: AccountInfo<Buffer>|null):State<FarmLedger> => {
    if (info==null){
        throw new Error("Info can not be null")
    }
    const buffer = Buffer.from(info.data);
    const mint = FarmLedgerLayout.decode(buffer) as FarmLedger
    const details = {
        pubkey,
        account: {
            ...info,
        },
        info: mint,
    } as State<FarmLedger>;

    return details;
}