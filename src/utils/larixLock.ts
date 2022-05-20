import {Program} from "@project-serum/anchor";
import {
    LARIX_LOCK_IDL,
} from "../config";
import {getProvider} from "./getConncetion";
import {LarixLockPool} from "../models";
import {Connection, PublicKey} from "@solana/web3.js";

let program:Program
export async function getLarixLockProgram(connection:Connection,larixLockProgramId:PublicKey):Promise<Program>{
    if (program){
        return program
    } else {
        return program = new Program(LARIX_LOCK_IDL,larixLockProgramId,await getProvider(connection));
    }
}
let larixPool:LarixLockPool
export async function getLarixLockPool(connection:Connection,larixLockProgramId:PublicKey,load=false):Promise<LarixLockPool>{
    if (!load && larixPool){
        return larixPool
    } else {
        const larixLockProgram = await getLarixLockProgram(connection,larixLockProgramId)
        return larixPool = (await larixLockProgram.account.lockPool.fetch(larixLockProgramId)) as LarixLockPool
    }
}