import {Account, Connection, PublicKey, Signer, SystemProgram, TransactionInstruction} from "@solana/web3.js";
import {AccountLayout, ASSOCIATED_TOKEN_PROGRAM_ID, Token} from "@solana/spl-token";
import {deserializeAccount, ObligationLayout, TokenAccount } from "../models";
import { TOKEN_PROGRAM_ID, WRAPPED_SOL_MINT } from "../config/config";
import { MiningLayout } from "../models/state/mining";

export function ensureSplAccount(
    instructions: TransactionInstruction[],
    cleanupInstructions: TransactionInstruction[],
    toCheck: TokenAccount,
    payer: PublicKey,
    amount: number,
    signers:  Signer[]
) {
    if (!toCheck.info.isNative) {
        return toCheck.pubkey;
    }

    const account = createUninitializedAccount(
        instructions,
        payer,
        amount,
        signers
    );
    instructions.push(
        Token.createInitAccountInstruction(
            TOKEN_PROGRAM_ID,
            WRAPPED_SOL_MINT,
            account,
            payer
        )
    );
    cleanupInstructions.push(
        Token.createCloseAccountInstruction(
            TOKEN_PROGRAM_ID,
            account,
            payer,
            payer,
            []
        )
    );

    return account;
}
export function createUninitializedAccount(
    instructions: TransactionInstruction[],
    payer: PublicKey,
    amount: number,
    signers: Signer[],
) {
    const account = new Account();
    instructions.push(
        SystemProgram.createAccount({
            fromPubkey: payer,
            newAccountPubkey: account.publicKey,
            lamports: amount,
            space: AccountLayout.span,
            programId: TOKEN_PROGRAM_ID,
        }),
    );

    signers.push(account);

    return account.publicKey;
}


export async function getOrCreateAssociatedTokenAccount(
    connection:Connection,
    instructions: TransactionInstruction[],
    payer: PublicKey,
    mint: PublicKey,
    owner: PublicKey,
) {
    const associatedTokenAccount = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        mint,
        owner
    )
    const accountInfo = await getTokenAccountByAssociatedTokenAccount(connection,associatedTokenAccount)
    if (accountInfo==null){
        instructions.push(Token.createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            mint,
            associatedTokenAccount,
            owner,
            owner
        ))
    }

    return associatedTokenAccount;
}
export function createUninitializedObligationAccount(
    instructions: TransactionInstruction[],
    payer: PublicKey,
    amount: number,
    signers: Signer[],
    lendingProgramID:PublicKey
){
    const account = new Account();
    instructions.push(
        SystemProgram.createAccount({
            fromPubkey: payer,
            newAccountPubkey: account.publicKey,
            lamports: amount,
            space: ObligationLayout.span,
            programId: lendingProgramID,
        }),
    );

    signers.push(account);

    return account.publicKey;
}
export function createUninitializedMiningAccount(
    instructions: TransactionInstruction[],
    lendingProgramID:PublicKey,
    payer: PublicKey,
    amount: number,
    signers: Signer[],
){
    const account = new Account();
    instructions.push(
        SystemProgram.createAccount({
            fromPubkey: payer,
            newAccountPubkey: account.publicKey,
            lamports: amount,
            space: MiningLayout.span,
            programId: lendingProgramID,
        }),
    );
    signers.push(account);
    return account.publicKey;
}
// TODO: check if one of to accounts needs to be native sol ... if yes unwrap it ...
export async function findOrCreateAccountByMint(
    connection:Connection,
    payer: PublicKey,
    owner: PublicKey,
    instructions: TransactionInstruction[],
    cleanupInstructions: TransactionInstruction[],
    mint: PublicKey, // use to identify same type
    signers: Signer[],
    account?:TokenAccount
): Promise<PublicKey> {
    let toAccount: PublicKey;
if (account && !account.info.isNative){
    toAccount = account.pubkey;
} else {
    toAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        instructions,
        payer,
        mint,
        owner,
    );
    if (mint.equals(WRAPPED_SOL_MINT)) {
        cleanupInstructions.push(
            Token.createCloseAccountInstruction(
                TOKEN_PROGRAM_ID,
                toAccount,
                payer,
                payer,
                []
            )
        );
    }
}

return toAccount;
}

async function getTokenAccountByAssociatedTokenAccount(connection:Connection,tokenAccountID:PublicKey){
    const lpSupplyAccountInfo = await connection.getAccountInfo(tokenAccountID)
    if (lpSupplyAccountInfo){
        return deserializeAccount(lpSupplyAccountInfo.data)
    }
}