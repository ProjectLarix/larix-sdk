import { PublicKey } from "@solana/web3.js";
import {AccountInfo} from "@solana/web3.js";

export interface StakePoolConfig{
    dex:string,
    name:string,
    farmPoolID:PublicKey,
    farmPoolLpSupply:PublicKey,
    amm_Id:PublicKey,
    ammOpenOrders:PublicKey,
    ammCoinMintSupply:PublicKey,
    ammPcMintSupply:PublicKey,
    farmLedger:PublicKey
}
export interface LpPriceAccountData{
    reserveID:AccountInfo<Buffer>;
    ammID:AccountInfo<Buffer>;
    lpMint:AccountInfo<Buffer>;
    coinMintPrice:AccountInfo<Buffer>;
    pcMintPrice:AccountInfo<Buffer>;
    ammOpenOrders:AccountInfo<Buffer>;
    ammCoinMintSupply:AccountInfo<Buffer>;
    ammPcMintSupply:AccountInfo<Buffer>;
}