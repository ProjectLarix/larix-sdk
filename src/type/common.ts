import BigNumber from "bignumber.js";
import {RpcResponseAndContext, SignatureResult, Signer, TransactionInstruction} from "@solana/web3.js";
import {LarixInstruction} from "../utils/larixInstructionCollector";

export interface PriceInfo{
    price:BigNumber,
    decimals:number
}
export const DEFAULT_PRICE_INFO:PriceInfo = {price:new BigNumber(0),decimals:0}
export interface TransactionResult{
    id:string,
    instruction:LarixInstruction|undefined
    // get this only when transaction confirm
    result:RpcResponseAndContext<SignatureResult>
}