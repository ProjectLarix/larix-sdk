import BigNumber from "bignumber.js";

export * from './config'
export * from "./type"
export * from "./production"
BigNumber.config({DECIMAL_PLACES:18,POW_PRECISION:19})
BigNumber.config({EXPONENTIAL_AT: 1e9})