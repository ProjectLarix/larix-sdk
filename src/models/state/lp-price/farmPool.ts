import BufferLayout from "buffer-layout";
import * as Layout from '../../../utils/layout';
import {AccountInfo, PublicKey} from "@solana/web3.js";
import {State} from "../state";

export const STAKE_INFO_LAYOUT :typeof BufferLayout.Structure = BufferLayout.struct([
    Layout.uint64('state'),
    Layout.uint64('nonce'),
    Layout.publicKey('poolLpTokenAccount'),
    Layout.publicKey('poolRewardTokenAccount'),
    Layout.publicKey('owner'),
    Layout.publicKey('feeOwner'),
    Layout.uint64('feeY'),
    Layout.uint64('feeX'),
    Layout.uint64('totalReward'),
    Layout.uint128('rewardPerShareNet'),
    Layout.uint64('lastBlock'),
    Layout.uint64('rewardPerBlock')
])
export const STAKE_INFO_LAYOUT_V4 :typeof BufferLayout.Structure = BufferLayout.struct([
    Layout.uint64('state'),
    Layout.uint64('nonce'),
    Layout.publicKey('poolLpTokenAccount'),
    Layout.publicKey('poolRewardTokenAccount'),
    Layout.uint64('totalReward'),
    Layout.uint128('perShare'),
    Layout.uint64('perBlock'),
    BufferLayout.u8('option'),
    Layout.publicKey('poolRewardTokenAccountB'),
    BufferLayout.blob(7),
    Layout.uint64('totalRewardB'),
    Layout.uint128('perShareB'),
    Layout.uint64('perBlockB'),
    Layout.uint64('lastBlock'),
    Layout.publicKey('owner')
])

export const FarmPoolParser = (pubkey: PublicKey, info: AccountInfo<Buffer>|null):State<any> => {
    if (info==null){
        throw new Error("Info can not be null")
    }
    let farmPoolInfo
    const buffer = Buffer.from(info.data);
    if (buffer.length===STAKE_INFO_LAYOUT.span){
        farmPoolInfo = STAKE_INFO_LAYOUT.decode(buffer) as any
    } else if (buffer.length === STAKE_INFO_LAYOUT_V4.span){
        farmPoolInfo = STAKE_INFO_LAYOUT_V4.decode(buffer) as any
    }
    const details = {
        pubkey,
        account: {
            ...info,
        },
        info: farmPoolInfo,
    } as State<any>;

    return details;
}