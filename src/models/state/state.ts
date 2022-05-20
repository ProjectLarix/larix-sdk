import {AccountInfo, PublicKey} from "@solana/web3.js";
import {Buffer} from "buffer";

export interface State<T>{
    pubkey:PublicKey;
    account: AccountInfo<Buffer>|null;
    info: T,
}