import {Keypair, PublicKey, SystemProgram} from "@solana/web3.js";
import {Program} from "@project-serum/anchor";

export function createInitPositionInstruction(program: Program,larixPoolId:PublicKey,owner:PublicKey,payer:PublicKey,position:Keypair) {

    return program.instruction.initializePosition(
        {
            accounts: {
                position: position.publicKey,
                lockPool: larixPoolId,
                owner,
                payer,
                systemProgram: SystemProgram.programId,
            }
        },
    );

}

export function createClosePositionInstruction(program:Program,positionId:PublicKey,owner:PublicKey,destination:PublicKey){
    return program.instruction.closePosition({
            accounts: {
                position:positionId,
                owner,
                destination
            }
        }
    )
}