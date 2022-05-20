import {BRIDGE_POOL_IDL, MarketConfig} from "../config";
import {Program} from "@project-serum/anchor"
import {getProvider} from "./getConncetion";
import {Connection, PublicKey} from "@solana/web3.js";
import {BridgePool} from "../models";
let program:Program
const bridgePoolMap = new Map<string,BridgePool>();

export async function getBridgeProgram(connection:Connection,marketConfig:MarketConfig):Promise<Program>{
    if (program) {
        return program
    } else {
        // @ts-ignore
        return program = new Program(BRIDGE_POOL_IDL,marketConfig.bridgeProgramId,await getProvider(connection));
    }
}
export async function getBridgePool(bridgePoolID:PublicKey,connection:Connection,marketConfig:MarketConfig):Promise<BridgePool>{
    let bridgePool = bridgePoolMap.get(bridgePoolID.toString())
    if (!bridgePool) {
        if (bridgePoolID.toString() === "3AqvcSZnb6QxN6Q1m7WT1kVkzV9Pp6WypTtm4ZmcSr1W"){
            bridgePool = {
                version:0,
                base:PublicKey.default,
                owner:PublicKey.default,
                pendingOwner:PublicKey.default,
                ammId:new PublicKey("58oQChx4yWmvKdwLLZzBi4ChoCc2fqCUWBkwMihLYQo2"),
                ammVersion:0,
                lpMint:new PublicKey("8HoQnePLqPj4M7PUDzfw8e3Ymdwgc7NLGnaTUapubyvu"),
                lpSupply:new PublicKey("8Brvkr2XB5kPz2fdBN5HhKVUa7zq4QsuL3ws9e2UDTUG"),
                coinSupply:new PublicKey("3o4q4vWw9qRJEn5cCsjBBetanheuZd8oBtRZU3CoYJ5g"),
                pcSupply:new PublicKey("5V5mCEommAgrLcDe862GPLdQ6MFULwcffE7G3qHAxR2m"),
                addLpWithdrawAmountAuthority:new PublicKey("BxnUi6jyYbtEEgkBq4bPLKzDpSfWVAzgyf3TF2jfC1my"),
                coinMintPrice:new PublicKey("4b48cC9RJwmLxGSPZGgPSh2qdQfwqzsxp2AZRyAdtHSo"),
                coinMintDecimal:0,
                pcMintPrice:new PublicKey("7RhdnRymb4TqTYLM5bH7cALj86EZX2sFxH8KYUbhUmLB"),
                pcMintDecimal:0,
                ammOpenOrders:new PublicKey("HRk9CMrpq7Jn9sh7mzxE8CChHG8dneX9p475QKz4Fsfc"),
                ammCoinMintSupply:new PublicKey("DQyrAcCrDXQ7NeoqGgDCZwBvWDcYmFCjSb9JtteuvPpz"),
                ammPcMintSupply:new PublicKey("HLmqeL62xR1QoZ1HKKbXRrdN1p3phKpxRMb2VVopvBBz"),
                bump:255,
                lpPriceAccount:new PublicKey("BXYH5q3SAmGHPfnXacePDJBPHXJrNXGVxBm1s6S3QdNc"),
                isFarm:true,
                farmPoolId:new PublicKey("GUzaohfNuFbBqQTnPgPSNciv3aUvriXYjQduRE3ZkqFw"),
                farmPoolVersion:0,
                farmLedger:new PublicKey("4P7zEup6X3Qf8mdPqEJfoM5Yq1dGLX8hQ633wHVSWykQ"),
                rewardSupply:[new PublicKey("DP2dF9t5zWoxxaYbaVUZzA8JZhPBNc2DTtr1u35S9AmE"),new PublicKey("FqQCYiSkgeXkxG1BRMR1QWdpEYEbSJwcgs5HrFc9gbG5")]
            } as BridgePool
        } else {
            const bridgeProgram = await getBridgeProgram(connection,marketConfig)
            bridgePool = (await bridgeProgram.account.pool.fetch(bridgePoolID)) as BridgePool
        }
        bridgePoolMap.set(bridgePoolID.toString(),bridgePool)
    }
    return bridgePool
}
