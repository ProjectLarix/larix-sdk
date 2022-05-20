import * as BufferLayout from 'buffer-layout';
import * as Layout from '../../../utils/layout';
import {AccountInfo, PublicKey} from "@solana/web3.js";
import {State} from "../state";
import BN from "bn.js";
export interface AmmOpenOrders{
    start:Buffer,
    accountFlags:BN,
    market:PublicKey,
    owner:PublicKey,
    baseTokenFree:BN,
    baseTokenTotal:BN,
    quoteTokenFree:BN,
    quoteTokenTotal:BN,
    freeSlotBits:BN,
    isBidBits:BN,
    orders:Buffer,
    clientIds:Buffer,
    end:Buffer,
}
export const AMM_OPEN_ORDERS_LAYOUT: typeof BufferLayout.Structure = BufferLayout.struct([
    BufferLayout.blob(5,"start"),
    Layout.uint64("accountFlags"),
    Layout.publicKey("market"),
    Layout.publicKey("owner"),
    Layout.uint64("baseTokenFree"),
    Layout.uint64("baseTokenTotal"),
    Layout.uint64("quoteTokenFree"),
    Layout.uint64("quoteTokenTotal"),
    Layout.uint128("freeSlotBits"),
    Layout.uint128("isBidBits"),
    BufferLayout.blob(16*128,"orders"),
    BufferLayout.blob(8*128,"clientIds"),
    Layout.uint64("referrerRebatesAccrued"),
    BufferLayout.blob(7,"end"),
]);
export const AmmOpenOrdersLayoutParser = (pubkey: PublicKey, info: AccountInfo<Buffer>|null):State<AmmOpenOrders> => {
    if (info==null){
        throw new Error("Info can not be null")
    }
    const buffer = Buffer.from(info.data);
    const reserve = AMM_OPEN_ORDERS_LAYOUT.decode(buffer) as AmmOpenOrders;
    const details = {
        pubkey,
        account: {
            ...info,
        },
        info: reserve,
    } as State<AmmOpenOrders>;
    return details;
}