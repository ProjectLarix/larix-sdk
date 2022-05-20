import BigNumber from "bignumber.js";
import {State, Mining, Obligation} from "../models";
import {LarixMarket, LarixReserve} from "../larixMarket";
export type LarixMiningDetail = {
    reserve:LarixReserve,
    amount:BigNumber,
    value:BigNumber,
}
export type LarixMining = {
    state:State<Mining>,
    market:LarixMarket,
    totalValue:BigNumber,
    rewardAmount:BigNumber,
    detail:LarixMiningDetail[]
}
export type LarixObligationCollateral = {
    reserve:LarixReserve,
    amount:BigNumber,
    value:BigNumber,
    rewardAmount:BigNumber
}
export type LarixObligationLiquidity = {
    reserve:LarixReserve,
    amount:BigNumber,
    value:BigNumber,
    rewardAmount:BigNumber
}
export type LarixObligation = {
    state:State<Obligation>,
    market:LarixMarket,
    totalDeposit:BigNumber,
    borrowLimit:BigNumber,
    totalBorrow:BigNumber,
    liquidateLimit:BigNumber,
    rewardAmount:BigNumber,
    deposits:LarixObligationCollateral[]
    borrows:LarixObligationLiquidity[]
}
export type UserMarketDetail = {
    market:LarixMarket,
    mining?:LarixMining,
    obligations:LarixObligation[]
}
