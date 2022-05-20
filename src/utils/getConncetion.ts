import {
    Connection, PublicKey,
    Signer,
    Transaction,
    TransactionInstruction
} from "@solana/web3.js";
import {WalletAdapter} from "./walletAdapter";
import {Provider} from "@project-serum/anchor";
import {TransactionResult} from "../type";



let connection:Connection
export function getConnection(url:string):Connection{
    if (connection) {return connection}
    connection = new Connection(url, {
        commitment:'recent'
    });
    return connection;
}

let provider:Provider
export async function getProvider(connection:Connection):Promise<Provider>{
    if (provider){
        return provider
    } else {
        const wallet = (window as any).solana
        return provider = new Provider(
            connection, wallet, {
                commitment:'recent'
            },
        )
    }
}

export function isReachTransactionLimit(
    connection: Connection,
    user: PublicKey,
    instructions: TransactionInstruction[],
    signers: Signer[]
){
    return getTransactionLength(connection,user,instructions,signers) > 1232
}
export function getTransactionLength(
    connection: Connection,
    user: PublicKey,
    instructions: TransactionInstruction[],
    signers: Signer[]
){
    const transaction = new Transaction();
    transaction.recentBlockhash = "8DCjq36FJve3BGPc5tu7emWCxG1deqPJzGdRBWTXeGqJ"
    transaction.feePayer = user
    instructions.forEach((instruction) => transaction.add(instruction));
    return getTransactionLengthInner(transaction,signers)

}
function getTransactionLengthInner(transaction:Transaction,signers:Signer[]){
    return transaction.serializeMessage().length+signers.length*64+65
}