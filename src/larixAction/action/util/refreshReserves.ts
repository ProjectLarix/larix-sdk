import {State, Reserve,refreshReservesInstruction} from "../../../models";
import {Account, Connection, PublicKey, TransactionInstruction} from "@solana/web3.js";
import {getBridgePool, getBridgeProgram} from "../../../utils/bridgePool";
import {MarketConfig} from "../../../config";
const MAX_RESERVE_LENGTH = 3
export const refreshReserves = async (
    connection:Connection,
    marketConfig:MarketConfig,
    instructions: TransactionInstruction[],
    reserves:Array<State<Reserve>>,
    lendingProgramID:PublicKey,
)=>{
    if (reserves.length===0){
        return
    }
    if (reserves.length>MAX_RESERVE_LENGTH){
        const startReserves = reserves.slice(0,MAX_RESERVE_LENGTH)
        await refreshBridgePool(connection,marketConfig,instructions,startReserves)
        instructions.push(refreshReservesInstruction(
            startReserves,
            lendingProgramID
        ))
        const endReserves = reserves.slice(MAX_RESERVE_LENGTH,reserves.length)
        await refreshReserves(connection,marketConfig,instructions,endReserves,lendingProgramID)
    } else {
        await refreshBridgePool(connection,marketConfig,instructions,reserves)
        instructions.push(refreshReservesInstruction(
            reserves,
            lendingProgramID
        ))
    }
}

export async function refreshBridgePool(connection:Connection,marketConfig:MarketConfig,instructions:TransactionInstruction[],reserves:Array<State<Reserve>>){
    for (const reserve of reserves){
        if (reserve.info.isLP){
            const bridgePoolProgram = await getBridgeProgram(connection,marketConfig)
            const bridgePoolID = reserve.info.liquidity.params_1
            const bridgePool = await getBridgePool(bridgePoolID,connection,marketConfig)
            instructions.push(bridgePoolProgram.instruction.refresh(
                {
                    accounts:{
                        pool: bridgePoolID,
                        lpPrice: bridgePool.lpPriceAccount,
                        ammId: bridgePool.ammId,
                        lpMint: bridgePool.lpMint,
                        lpSupply: bridgePool.lpSupply,
                        coinMintPrice: bridgePool.coinMintPrice,
                        pcMintPrice:bridgePool.pcMintPrice,
                        ammOpenOrders:bridgePool.ammOpenOrders,
                        coinMintSupply:bridgePool.ammCoinMintSupply,
                        pcMintSupply:bridgePool.ammPcMintSupply,
                        farmLedger:bridgePool.farmLedger,

                    }
                }
            ))
        }
    }
}