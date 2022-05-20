import {PublicKey, SYSVAR_CLOCK_PUBKEY} from "@solana/web3.js";
import {LarixLockPool} from "../../state/larixLockPool";
import {Program} from "@project-serum/anchor";
import {LARIX_LOCK_FARM_INFO} from "../../../config/config";
import {TOKEN_PROGRAM_ID} from "@solana/spl-token";

export function createWithdrawInstruction(
    program: Program,
    larixLockPoolId: PublicKey,
    larixLockPool: LarixLockPool,
    position: PublicKey,
    userLpTokenAccount:PublicKey,
    userRewardAccount:PublicKey,
    userRewardAccountB:PublicKey
) {
    const farmInfo = LARIX_LOCK_FARM_INFO
    const user = program.provider.wallet.publicKey

    return program.instruction.withdraw(
        {
            accounts: {
                pool: larixLockPoolId,
                position,
                lockPoolLpSupply: larixLockPool.lpSupply,
                owner: user,
                tokenProgram: TOKEN_PROGRAM_ID,
                userLpTokenAccount,
                farmPoolProgramId: farmInfo.programId,

                farmPool: farmInfo.poolId,
                farmPoolAuthority: farmInfo.poolAuthority,
                farmPoolLpSupply: farmInfo.poolLpTokenAccount,
                farmLedger: larixLockPool.farmLedger,
                rewardAccount: larixLockPool.rewardASupply,
                rewardVault: farmInfo.poolRewardTokenAccount,
                sysvarClock: SYSVAR_CLOCK_PUBKEY,

                rewardAccountB: larixLockPool.rewardBSupply,
                rewardVaultB: farmInfo.poolRewardTokenAccountB,
                userRewardAccount,
                userRewardAccountB,

            }
        },
    );
}
