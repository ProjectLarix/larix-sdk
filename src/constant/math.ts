import BigNumber from "bignumber.js";
import BN from "bn.js";

export const BIG_NUMBER_ONE = new BigNumber(1)
export const BIG_NUMBER_ZERO = new BigNumber(0)
export const REAL_SLOTS_TIME = 500
export const REAL_SLOTS_PER_YEAR = 1000/REAL_SLOTS_TIME  * 60 * 60 * 24 * 365
export const REAL_SLOTS_PER_DAY = 1000/REAL_SLOTS_TIME * 60 * 60 * 24
export const SLOTS_PER_YEAR = 1000/400  * 60 * 60 * 24 * 365
export const ZERO = new BN(0);
export const TEN = new BN(10);
export const WAD = TEN.pow(new BN(18));
export const BIG_NUMBER_WAD = new BigNumber(WAD.toString())
export const U64_MAX = new BN("ffffffffffffffff","hex")