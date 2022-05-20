import {LarixWallet} from "../../../type";
import {LarixUserInfo} from "../../../larixUserInfo";
import {Connection} from "@solana/web3.js";
import {MarketConfig} from "../../../config";
import {LarixMarket} from "../../../larixMarket";

export class BaseAction{
    protected wallet: LarixWallet;
    protected userInfo:LarixUserInfo;
    protected connection:Connection
    protected marketData:LarixMarket
    protected marketConfig:MarketConfig
    constructor(wallet:LarixWallet, userInfo:LarixUserInfo, marketData:LarixMarket) {
        this.wallet = wallet
        this.userInfo = userInfo
        this.marketData = marketData
        this.connection = wallet.connection
        this.marketConfig = marketData.config
    }
}