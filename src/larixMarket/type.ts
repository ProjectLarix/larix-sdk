import {State, LpInfo, Reserve, TokenAccount} from "../models";
import BigNumber from "bignumber.js";
import {LpReserveConfig, MarketConfig, ReserveConfig} from "../config";
export type LarixMarket ={
    config:MarketConfig
    reserves:LarixReserve[]
    reservesMap:Map<string,LarixReserve>
    reserveStates:State<Reserve>[]
}
export type LarixReserve = {
    state: State<Reserve>,
    reserveConfig:ReserveConfig|LpReserveConfig,
    market:LarixMarket,
    collateralFactor:BigNumber,
    liquidationThreshold:number,

    miningSpeed:BigNumber,
    dailyMining:BigNumber,
    supplyMiningRate:BigNumber,
    borrowMiningRate:BigNumber,

    liquidityPrice:BigNumber,
    borrowInterestFee:BigNumber,
    depositLimit:BigNumber,

    cumulativeBorrowRate:BigNumber,
    utilizationRate:BigNumber,
    exchangeRate:BigNumber,

    totalCollateralTokenSupply:BigNumber,
    // tvl
    totalAvailableAmount:BigNumber,
    totalAvailableValue:BigNumber,
    totalBorrowedAmount:BigNumber,
    totalBorrowedValue:BigNumber,
    totalDepositAmount:BigNumber,
    totalDepositValue:BigNumber,

    supplyApy:BigNumber,
    borrowApy:BigNumber,

    supplyRewardApy:BigNumber|number,
    borrowRewardApy:BigNumber|number,

    userCollateralTokenAccount:TokenAccount|undefined,
    userLiquidityTokenAccount:TokenAccount|undefined,
    userLiquidityAmount:BigNumber
}
