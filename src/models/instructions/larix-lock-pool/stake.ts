import {Program} from "@project-serum/anchor";
import {PublicKey, SYSVAR_CLOCK_PUBKEY} from "@solana/web3.js";
import { LarixLockPool } from "../../state/larixLockPool";
import {TOKEN_PROGRAM_ID} from "@solana/spl-token";
import {LARIX_LOCK_FARM_INFO} from "../../../config/config";

export const createStakeInstruction = (
    program: Program,
    larixLockPoolId: PublicKey,
    larixLockPool: LarixLockPool
) => {
    const farmInfo = LARIX_LOCK_FARM_INFO
    return program.instruction.stake(
        {
            accounts: {
                pool: larixLockPoolId,
                lockPoolLpSupply: larixLockPool.lpSupply,
                farmPoolProgramId: farmInfo.programId,
                farmPool: farmInfo.poolId,
                farmPoolAuthority: new PublicKey(farmInfo.poolAuthority),
                farmPoolLpSupply: new PublicKey(farmInfo.poolLpTokenAccount),
                farmLedger: larixLockPool.farmLedger,
                rewardAccount: larixLockPool.rewardASupply,
                rewardVault: new PublicKey(farmInfo.poolRewardTokenAccount),
                sysvarClock: SYSVAR_CLOCK_PUBKEY,
                tokenProgram: TOKEN_PROGRAM_ID,
                rewardAccountB: larixLockPool.rewardBSupply,
                rewardVaultB: new PublicKey(farmInfo.poolRewardTokenAccountB)
            }
        },
    );

}