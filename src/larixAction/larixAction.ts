import {LarixUserInfo, LarixObligation,UserMarketDetail} from "../larixUserInfo";
import {WithdrawAction} from "./action/withdrawAction";
import BN from "bn.js";
import {DepositAction} from "./action/depositAction";
import {CollateralAction} from "./action/collateralAction";
import {UnCollateralAction} from "./action/unCollateralAction";
import {BorrowAction} from "./action/borrowAction";
import {RepayAction} from "./action/repayAction";
import {LarixWallet, TransactionResult} from "../type";
import {LarixReserve} from "../larixMarket";
export class LarixAction{
    private readonly signer:LarixWallet;
    public userInfo : LarixUserInfo;
    public transactionResults:TransactionResult[]|undefined
    constructor(
        userInfo:LarixUserInfo,
        signer:LarixWallet,
    ) {
        this.userInfo = userInfo
        this.signer = signer
    }
    public async deposit(
        userMarketDetail:UserMarketDetail,
        depositReserve:LarixReserve,
        amount: BN|number,
        obligation?:LarixObligation,
    ){
        const supplyAction = new DepositAction(this.signer,this.userInfo,userMarketDetail.market)
        const larixTransaction = await supplyAction.deposit(
            new BN(amount),
            depositReserve,
            userMarketDetail.mining,
            obligation
        )
        this.transactionResults = larixTransaction.transactionResults
        await larixTransaction.send()

    }
    public async withdraw(
        userMarketDetail:UserMarketDetail,
        withReserve: LarixReserve,
        amount: BN|number,
        obligation?:LarixObligation,
    ){
        const withdrawAction = new WithdrawAction(this.signer,this.userInfo,userMarketDetail.market)
        const larixTransaction = await withdrawAction.withdraw(
            new BN(amount),
            withReserve,
            userMarketDetail.mining,
            obligation,
        )
        this.transactionResults = larixTransaction.transactionResults
        await larixTransaction.send()

    }
    public async collateral(
        userMarketDetail:UserMarketDetail,
        reserve:LarixReserve,
        obligation?:LarixObligation
    ){
        if (userMarketDetail.mining==undefined){
            throw new Error("Can not find mining")
        }
        const initObligationAction = new CollateralAction(this.signer,this.userInfo,userMarketDetail.market)
        const larixTransaction = await initObligationAction.collateral(
            reserve,
            userMarketDetail.mining,
            obligation
        )
        this.transactionResults = larixTransaction.transactionResults
        await larixTransaction.send()
    }
    public async unCollateral(
        userMarketDetail:UserMarketDetail,
        reserve:LarixReserve,
        obligation:LarixObligation,
    ){
        const exitObligationAction = new UnCollateralAction(this.signer,this.userInfo,userMarketDetail.market)
        if (userMarketDetail.mining==undefined){
            throw new Error("Can not find mining account")
        }
        const larixTransaction = await exitObligationAction.unCollateral(
            reserve,
            userMarketDetail.mining,
            obligation
        )
        this.transactionResults = larixTransaction.transactionResults
        await larixTransaction.send()
    }
    public async borrow(
        userMarketDetail:UserMarketDetail,
        borrowReserve: LarixReserve,
        amount: BN|number,
        obligation:LarixObligation
    ){

        const borrowAction = new BorrowAction(this.signer,this.userInfo,userMarketDetail.market)
        const larixTransaction = await borrowAction.borrow(
            new BN(amount),
            borrowReserve,
            obligation
        )
        this.transactionResults = larixTransaction.transactionResults
        await larixTransaction.send()
    }
    public async repay(
        userMarketDetail:UserMarketDetail,
        reserve:LarixReserve,
        amount: BN|number,
        obligation:LarixObligation
    ){
        const repayAction = new RepayAction(this.signer,this.userInfo,userMarketDetail.market)
        const larixTransaction = await repayAction.repay(
            new BN(amount),
            reserve,
            obligation
        )
        this.transactionResults = larixTransaction.transactionResults
       await larixTransaction.send()
    }

}