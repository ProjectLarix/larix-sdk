import { PublicKey } from '@solana/web3.js';
import {Idl} from "@project-serum/anchor/src/idl";
//@ts-ignore
import raydiumBridgeIdl from '../idl/raydium_bridge.json';
// @ts-ignore
import larixLockIdl from '../idl/larix_lock_pool.json';
// @ts-ignore
export const BRIDGE_POOL_IDL:Idl = raydiumBridgeIdl
// @ts-ignore
export const LARIX_LOCK_IDL:Idl = larixLockIdl
export const WRAPPED_SOL_MINT = new PublicKey(
    'So11111111111111111111111111111111111111112',
);
export const TOKEN_PROGRAM_ID = new PublicKey(
    'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
);

export const LARIX_LOCK_FARM_INFO = {
    programId:new PublicKey('9KEPoZmtHUrBbhWN1v1KWLMkkvwY6WLtAVUCPRtRjP4z'),
    poolId:new PublicKey('HzxveT6pUMwYByqnScvTbpUv4avzkUDrDpS9D7DToEry'),
    poolAuthority:new PublicKey('sCDx3LzV8jPFX1VuRQDAGNKVfiCvhvrv3tJijaXzhXw'),
    poolLpTokenAccount: new PublicKey('6PpGF8xRLwpDdVMQHQoBhrrXuUh5Gs4dCMs1DPanpjHM'),
    poolRewardTokenAccount: new PublicKey('7tPiMrZB6kct1xNWLtG1jJqJYUJaG8548bEaJsb5HdXq'),
    poolRewardTokenAccountB: new PublicKey('DXo3ffHBd69c9tV4wWBtFhc95UZMfYJehGnk3ViifSQ3')
}
export const LARIX_LOCK_AMM_INFO = {
    lpMint: new PublicKey("7yieit4YsNsZ9CAK8H5ZEMvvk35kPEHHeXwp6naoWU9V"),
    programId: new PublicKey("675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8"),
    ammId: new PublicKey("A21ui9aYTSs3CbkscaY6irEMQx3Z59dLrRuZQTt2hJwQ"),
    ammAuthority: new PublicKey("5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1"),
    ammOpenOrders: new PublicKey("3eCx9tQqnPUUCgCwoF5pXJBBQSTHKsNtZ46YRzDxkMJf"),
    ammTargetOrders: new PublicKey("rdoSiCqvxNdnzuZNUZnsXGQpwkB1jNPctiS194UtK7z"),
    poolCoinTokenAccount: new PublicKey("HUW3Nsvjad7jdexKu9PUbrq5G7XYykD9us25JnqxphTA"),
    poolPcTokenAccount: new PublicKey("4jBvRQSz5UDRwZH8vE6zqgqm1wpvALdNYAndteSQaSih"),
    poolWithdrawQueue: new PublicKey('Dt8fAfftoVcFicC8uHgKpWtdJHA8e4xCPeoVRCfounDy'),
    poolTempLpTokenAccount: new PublicKey('FQ3XFCQAEjK1U235pgaB9nRPU1fkQaLjKQiWYYNzB5Fr'),
    serumProgramId: new PublicKey("9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin"),
    serumMarket: new PublicKey('DE6EjZoMrC5a3Pbdk8eCMGEY9deeeHECuGFmEuUpXWZm'),
    serumBids: new PublicKey('2ngvymBN8J3EmGsVyrPHhESbF8RoBBaLdA4HBAQBTcv9'),
    serumAsks: new PublicKey('BZpcoVeBbBytjY6vRxoufiZYB3Te4iMxrpcZykvvdH6A'),
    serumEventQueue: new PublicKey('2sZhugKekfxcfYueUNWNsyHuaYmZ2rXsKACVQHMrgFqw'),
    serumCoinVaultAccount: new PublicKey('JDEsHM4igV84vbH3DhZKvxSTHtswcNQqVHH9RDq1ySzB'),
    serumPcVaultAccount: new PublicKey('GKU4WhnfYXKGeYxZ3bDuBDNrBGupAnnh1Qhn91eyTcu7'),
    serumVaultSigner: new PublicKey('4fGoqGi6jR78dU9TRdL5LvBUPjwnoUCBwxNjfFxcLaCw'),
}