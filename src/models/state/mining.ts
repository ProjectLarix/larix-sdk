
import BN from "bn.js";

import * as BufferLayout from 'buffer-layout';
import * as Layout from '../../utils/layout';
import {AccountInfo, PublicKey} from "@solana/web3.js";
import {State} from "./index";
export interface Mining{
    version:number,
    owner:PublicKey,
    lendingMarket:PublicKey,
    miningIndices:MiningIndex[],
    unclaimedMine:BN
}
export interface MiningIndex{
    reserve:PublicKey,
    unCollLTokenAmount:BN,
    index:BN
}
export const MiningLayout: typeof BufferLayout.Structure = BufferLayout.struct(
    [
        BufferLayout.u8('version'),
        Layout.publicKey("owner"),
        Layout.publicKey("lendingMarket"),
        BufferLayout.u8("reservesLen"),
        Layout.uint128("unclaimedMine"),
        BufferLayout.blob(56*10, "dataFlat"),
    ])
export const MiningIndexLayout: typeof  BufferLayout.Structure = BufferLayout.struct(
    [
        Layout.publicKey("reserve"),
        Layout.uint64("unCollLTokenAmount"),
        Layout.uint128("index"),
    ])
export const MiningParser = (pubkey: PublicKey, info: AccountInfo<Buffer>):State<Mining> => {

    const buffer = Buffer.from(info.data);

    const {
        version,
        owner,
        lendingMarket,
        reservesLen,
        unclaimedMine,
        dataFlat
    } = MiningLayout.decode(buffer);

    const miningIndicesBuffer = dataFlat.slice(
        0,
        reservesLen * MiningIndexLayout.span
    )


    const miningIndices = BufferLayout.seq(
            MiningIndexLayout,
            reservesLen
        ).decode(miningIndicesBuffer) as MiningIndex[]


    const mining = {
        version,
        owner,
        lendingMarket,
        miningIndices,
        unclaimedMine,
    } as Mining

    const details = {
        pubkey,
        account: {
            ...info,
        },
        info: mining,
    } as State<Mining>;
    return details
}