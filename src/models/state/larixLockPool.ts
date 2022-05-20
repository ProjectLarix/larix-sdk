import {PublicKey} from "@solana/web3.js";
import BN from "bn.js";

export interface LarixLockPool{
    owner:PublicKey;
    pendingOwner:PublicKey;
    lpMint:PublicKey;
    ammId:PublicKey;
    ammOpenOrders:PublicKey;
    ammCoinMintSupply:PublicKey;
    ammPcMintSupply:PublicKey;
    farmPoolId:PublicKey;
    farmLedger:PublicKey;
    lpSupply:PublicKey;
    coinSupply:PublicKey;
    pcSupply:PublicKey;
    rewardASupply:PublicKey;
    rewardBSupply:PublicKey;
    addLarixAuthority:PublicKey;
    lastUpdateSlot:BN;
    lockDuration:BN;
    rewardAPerShare:BN;
    rewardBPerShare:BN;
}