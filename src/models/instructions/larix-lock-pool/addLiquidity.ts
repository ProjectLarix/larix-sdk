import {PublicKey} from "@solana/web3.js";
import {Program} from "@project-serum/anchor";
import {LarixLockPool} from "../../state/larixLockPool";
import {TOKEN_PROGRAM_ID} from "@solana/spl-token";
import {LARIX_LOCK_AMM_INFO} from "../../../config/config";

export function createAddLiquidityInstruction(
    program: Program,
    larixLockPoolId: PublicKey,
    larixLockPool: LarixLockPool,
    userLarixInfo: PublicKey,
    position: PublicKey,
    user: PublicKey,
    userPcAccount:PublicKey
) {
    const ammInfo = LARIX_LOCK_AMM_INFO
    return program.instruction.addLiquidity(
        {
            accounts:{
                pool: larixLockPoolId,
                userLarixInfo,
                position,
                owner: user,
                tokenProgramId: TOKEN_PROGRAM_ID,
                ammProgramId: ammInfo.programId,
                ammId: ammInfo.ammId,
                ammAuthority: ammInfo.ammAuthority,
                ammOpenOrders: ammInfo.ammOpenOrders,
                ammTargetOrders: ammInfo.ammTargetOrders,
                lpMint: ammInfo.lpMint,
                ammCoinMintSupply: ammInfo.poolCoinTokenAccount,
                ammPcMintSupply: ammInfo.poolPcTokenAccount,
                serumMarket: ammInfo.serumMarket,
                coinSupply: larixLockPool.coinSupply,
                pcSupply: larixLockPool.pcSupply,
                lpSupply: larixLockPool.lpSupply,
                userPcAccount
            }
        },
    );
}