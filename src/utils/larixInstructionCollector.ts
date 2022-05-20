
import {PublicKey, Signer, TransactionInstruction} from "@solana/web3.js";
import {isReachTransactionLimit} from "./index";
import {LarixWallet, TransactionResult} from "../type";

export class LarixInstructionCollector {
    private readonly larixInstructions:LarixInstruction[];
    private readonly wallet:LarixWallet
    public readonly transactionResults:TransactionResult[]
    constructor(
        wallet:LarixWallet,
        transactions?:LarixInstruction[],
    ){
        this.wallet = wallet
        this.transactionResults = []
        if (transactions){
            this.larixInstructions = transactions
        } else {
            this.larixInstructions = new Array()
        }
        this.newTransaction()
    }
    add(transactionElement:LarixInstruction){
        this.larixInstructions.push(transactionElement)
    }
    newTransaction(){
        this.larixInstructions.push(new LarixInstruction(this.wallet))
    }
    get signers(){
        return this.lastTransaction.signers
    }
    get cleanupInstructions(){
        return this.lastTransaction.cleanupInstructions
    }
    get instructions(){
        return this.lastTransaction.instructions
    }
    addInstruction(instruction:TransactionInstruction){
        this.lastTransaction.instructions.push(instruction)
    }
    addCleanupInstruction(instruction:TransactionInstruction){
        this.lastTransaction.cleanupInstructions.push(instruction)
    }
    addSigner(signer:Signer){
        this.lastTransaction.signers.push(signer)
    }
    get lastTransaction():LarixInstruction{
        return this.larixInstructions[this.larixInstructions.length-1]
    }
    async send():Promise<TransactionResult[]>{
        let user = this.wallet.publicKey

        let currentTransaction:LarixInstruction|undefined;
        for (let i = 0; i < this.larixInstructions.length; i++) {
            if (!currentTransaction){
                currentTransaction = this.larixInstructions[i]
            } else {
                currentTransaction.mergeTransaction(this.larixInstructions[i])
            }
            let transactionResult:TransactionResult|undefined
            if (i==this.larixInstructions.length-1){
                transactionResult = await currentTransaction.send()// end of loop
            } else if(currentTransaction.isReachTransactionLimit(this.larixInstructions[i+1],user)){
                transactionResult = await currentTransaction.send()
                currentTransaction = undefined
            }
            if (transactionResult){
                transactionResult.instruction = currentTransaction
                this.transactionResults.push(transactionResult)
                if (transactionResult.result&&transactionResult.result.value.err){
                    throw new Error("Transaction err")
                }
            }

        }
        return this.transactionResults

    }
}

export class LarixInstruction {
    public instruction: TransactionInstruction[];
    public cleanupInstruction: TransactionInstruction[];
    private wallet:LarixWallet
    public signers:Signer[];
    constructor(
        wallet:LarixWallet,
        instructions?:TransactionInstruction[],
        cleanupInstructions?: TransactionInstruction[],
        signers?: Signer[]
    ){
        this.wallet = wallet
        if (instructions){
            this.instruction = instructions;
        } else {
            this.instruction = new Array();
        }
        if (cleanupInstructions){
            this.cleanupInstruction = cleanupInstructions;
        } else {
            this.cleanupInstruction = new Array();
        }
        if (signers){
            this.signers = signers;
        } else {
            this.signers = new Array();
        }

    }
    get instructions(){
        return this.instruction
    }
    get allInstructions(){
        return this.instruction.concat(this.cleanupInstruction)
    }
    get cleanupInstructions(){
        return this.cleanupInstruction
    }
    addInstruction(instruction:TransactionInstruction){
        this.instruction.push(instruction)
    }
    addCleanupInstruction(instruction:TransactionInstruction){
        this.cleanupInstruction.push(instruction)
    }
    addSigner(signer:Signer){
        this.signers.push(signer)
    }
    mergeTransaction(other:LarixInstruction){
        this.instruction = this.instruction.concat(other.instruction)
        this.cleanupInstruction = this.cleanupInstruction.concat(other.cleanupInstruction)
        this.signers = this.signers.concat(other.signers)
    }
    public isReachTransactionLimit(other:LarixInstruction, user:PublicKey){
        return isReachTransactionLimit(
            this.wallet.connection,
            user,
            this.allInstructions.concat(other.allInstructions),
            this.signers.concat(other.signers)
        )
    }
    async send():Promise<TransactionResult>{
        return await this.wallet.sendTransaction(this.allInstructions,this.signers)
    }
}