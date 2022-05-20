import { AccountInfo, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import * as BufferLayout from 'buffer-layout';
import * as Layout from '../../utils/layout';
import { LastUpdate, LastUpdateLayout } from './lastUpdate';
import {State} from "../index";

export interface MarketPrice {
    version: number;
    oracle:PublicKey;
    target_sql_token:PublicKey;
    pyth_product:PublicKey;
    pyth_price:PublicKey;
    lastUpdate: LastUpdate;
    verify:Boolean;
    expo:number;
    price:BN;
}
export const MarketPriceLayout: typeof  BufferLayout.Structure = BufferLayout.struct(
    [
        BufferLayout.u8('version'),
        Layout.publicKey('oracle'),
        Layout.publicKey('target_spl_token'),
        Layout.publicKey('pyth_product'),
        Layout.publicKey('pyth_price'),
        LastUpdateLayout,
        BufferLayout.u8("verify"),
        BufferLayout.u8("expo"),
        Layout.uint64("price"),
    ]
);
export const isMarketPrice = (info: AccountInfo<Buffer>) => {
    return info.data.length === MarketPriceLayout.span;
};
export const PriceParser = (pubkey: PublicKey, info: AccountInfo<Buffer>|null):State<MarketPrice> => {
    if (info==null){
        throw new Error("Info can not be null")
    }
    const buffer = Buffer.from(info.data);
    const marketPrice = MarketPriceLayout.decode(buffer) as MarketPrice;
    const details = {
        pubkey,
        account: {
            ...info,
        },
        info: marketPrice,
    } as State<MarketPrice>;
    return details
};