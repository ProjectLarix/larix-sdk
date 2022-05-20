import {PublicKey} from "@solana/web3.js";
import BN from "bn.js";
import BigNumber from "bignumber.js";

export interface Position{
    owner:PublicKey,
    lpAmount:BN,
    startTime:BN,
    endTime:BN,
    startRewardAPerShare:BN,
    startRewardBPerShare:BN,
    rewardAAmount:BigNumber,
    rewardBAmount:BigNumber,
}