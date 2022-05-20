import {
    Commitment,
    Connection,
    PublicKey, SendOptions,
    Signer,
    Transaction,
    TransactionInstruction,
} from "@solana/web3.js";
import {TransactionResult} from "./common";

export abstract class LarixWallet {
    connection:Connection
    sendOption?:SendOptions
    confirm?:boolean
    commitment?:Commitment
    protected logger: ((msg: any) => void) | undefined;
    protected constructor(connection:Connection,sendOption?:SendOptions,confirm?:boolean,commitment?:Commitment,logger?:(msg:any)=>void) {
        this.connection = connection
        this.sendOption = sendOption
        this.confirm = confirm
        this.commitment = commitment
        this.logger = logger
    }
    abstract get publicKey():PublicKey
    abstract sendTransaction(instructions:TransactionInstruction[],signers:Signer[]):Promise<TransactionResult>
}
export class LarixWebWallet extends LarixWallet{
    wallet:any
    public constructor(connection:Connection,wallet:any,sendOption:SendOptions={skipPreflight:true},confirm:boolean=true,commitment:Commitment="confirmed",logger?:(msg:any)=>void) {
        super(connection,sendOption,confirm,commitment,logger);
        this.wallet = wallet
    }
    get publicKey(): PublicKey {
        return this.wallet.publicKey;
    }
    async sendTransaction(instructions:TransactionInstruction[],signers:Signer[]): Promise<TransactionResult> {
        let transaction = new Transaction();
        transaction.feePayer = this.wallet.publicKey
        instructions.forEach((instruction) => transaction.add(instruction));

        transaction.recentBlockhash = (
            await this.connection.getRecentBlockhash("max")
        ).blockhash;
        if (signers.length > 0) {
            transaction.partialSign(...signers);
        }
        transaction = await this.wallet.signTransaction(transaction);
        const rawTransaction = transaction.serialize();
        const txid = await this.connection.sendRawTransaction(rawTransaction, this.sendOption);
        if (this.logger){
            this.logger(txid)
        }
        if(this.confirm){
            const status = await this.connection.confirmTransaction(
                txid,
                this.commitment
            );
            return {
                id:txid,
                result:status
            } as TransactionResult
        } else {
            return  {
                id:txid
            } as TransactionResult
        }
    }
}
export class LarixHDWallet extends LarixWallet{
    signer: Signer;
    public constructor(connection:Connection,signer:Signer,sendOption?:SendOptions,confirm:boolean=false,commitment:Commitment="confirmed",logger?:(msg:any)=>void) {
        super(connection,sendOption,confirm,commitment,logger);
        this.signer = signer
    }
    get publicKey(): PublicKey {
        return this.signer.publicKey;
    }

   async sendTransaction(instructions: TransactionInstruction[], signers: Signer[]): Promise<TransactionResult> {
        const transaction = new Transaction()
        transaction.instructions = instructions
       const txid = await this.connection.sendTransaction(transaction,[this.signer,...signers],this.sendOption)
       if (this.logger){
           this.logger(txid)
       }
       if(this.confirm){
           const status = await this.connection.confirmTransaction(
               txid,
               this.commitment
           );
           return {
               id:txid,
               result:status
           } as TransactionResult
       } else {
          return  {
               id:txid
           } as TransactionResult
       }

    }

}
