import {Keypair, PublicKey, SystemProgram} from "@solana/web3.js";
import {Program} from "@project-serum/anchor";

export function createInitUserLarixInfoInstruction(program: Program,larixPoolId:PublicKey,owner:PublicKey,payer:PublicKey,userLarixInfo:Keypair) {

    return program.instruction.initializeUserLarixInfo(
        {
            accounts: {
                userLarixInfo: userLarixInfo.publicKey,
                lockPool:larixPoolId,
                owner,
                payer,
                systemProgram: SystemProgram.programId,
            }
        },
    );
}
export function createCloseUserLarixInfoInstruction(program: Program, userLarixInfoId: PublicKey,owner:PublicKey,destination:PublicKey) {
    return  program.instruction.closeUserLarixInfo({
            accounts: {
                userLarixInfo:userLarixInfoId,
                owner,
                destination
            }
        }
    )
}