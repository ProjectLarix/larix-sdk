import {PublicKey} from "@solana/web3.js";
import BigNumber from "bignumber.js";
import {State, Reserve, TokenAccount} from "../index";

export interface WithdrawLpAccount{
    owner:PublicKey;
    poolId:PublicKey;
    amount:BigNumber;
    symbol:string;
    logoSource:any;
    tokenUnit:BigNumber;
    userLiquidityTokenAccount:TokenAccount|undefined,
    reserveDetails:State<Reserve>


}