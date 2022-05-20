import {PublicKey} from "@solana/web3.js";

export interface BaseReserveConfig{
    name:string,
    fullName:string,
    reserveId:PublicKey,
}
export interface ReserveConfig extends BaseReserveConfig{
    larixOraclePriceId:PublicKey
}
export interface LpReserveConfig extends BaseReserveConfig{
    ammID:PublicKey;
    lpMint:PublicKey;
    coinMintPrice:PublicKey;
    pcMintPrice:PublicKey;
    ammOpenOrders:PublicKey;
    ammCoinMintSupply:PublicKey;
    ammPcMintSupply:PublicKey;
    farmPoolID:PublicKey;
    farmPoolLpSupply:PublicKey;
    farmPoolProgramId?:PublicKey;
    farmPoolAuthority?:PublicKey;
    farmRewardVault?:PublicKey;
    farmRewardVaultB?:PublicKey;
    rewardA:string,
    rewardB:string,
    version:number;
}
export interface MarketConfig{
    name:string,
    programId:PublicKey,
    marketId:PublicKey,
    authorityId:PublicKey,
    larixOracleProgramId:PublicKey,
    mineMint:PublicKey,
    mineSupply:PublicKey,
    bridgeProgramId?:PublicKey,
    larixLookProgramId?:PublicKey,
    larixLookPoolId?:PublicKey,
    reserves:ReserveConfig[],
    lpReserves?:LpReserveConfig[]
}