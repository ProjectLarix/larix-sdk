
import BigNumber from "bignumber.js";

jest.setTimeout(100_000)
import {LarixMarkets} from "../../src/larixMarket/larixMarkets";
import {getLarixPrice, getMndePrice, getRaydiumPools} from "../../src/utils/util";
import {LarixUserInfo} from "../../src/larixUserInfo/larixUserInfo";
import {Connection, Keypair, PublicKey} from "@solana/web3.js";
import {LarixAction} from "../../src/larixAction/larixAction";
import BN from "bn.js";
import {MARKET} from "../../src/config/production";
import {LarixHDWallet} from "../../src/type";
import {U64_MAX} from "../../src/constant";
describe('test data requset',function (){
    let raydiumPairs:any
    let larixPrice:BigNumber
    let mndePrice:BigNumber
    let larixUserInfo:LarixUserInfo
    let larixMarket:LarixMarkets

    const connection =  new Connection("https://explorer-api.mainnet-beta.solana.com", {
        commitment:'recent'
    })
     const privateKey = Keypair.fromSecretKey(Uint8Array.from([]))
    it("Read util method", async function () {
        const marketRequests = await Promise.all(
            [
                await getRaydiumPools(),
                await getLarixPrice(),
                await getMndePrice(),
            ]
        )
        raydiumPairs = marketRequests[0]
        larixPrice = marketRequests[1]
        mndePrice = marketRequests[2]
    });
    it("Read larix markets", async function () {
        larixMarket = new LarixMarkets(connection)
        await larixMarket.loadReserves()
        await larixMarket.loadRewardApy()
        larixMarket.markets.forEach(marketData=>{
            marketData.reserves.forEach(reserve=>{
                console.log(
                    "\nmarket: "+marketData.config.name
                    +"\nreserve: "+reserve.reserveConfig.name
                    +"\nprice: "+reserve.liquidityPrice.toString()
                    +"\navailableAmount: "+reserve.totalAvailableAmount.toString()
                    +"\navailableValue: "+reserve.totalAvailableValue.toString()
                    +"\nborrowAmount: "+reserve.totalBorrowedAmount.toString()
                    +"\nborrowValue:"+reserve.totalBorrowedValue.toString()
                    +"\nsupplyApy: "+reserve.supplyApy.toString()
                    +"\nborrowApy: "+reserve.borrowApy.toString()
                    +"\nsupplyRewardApy: "+reserve.supplyRewardApy.toString()
                    +"\nborrowRewardApy: "+reserve.borrowRewardApy.toString()
                    // +reserve.state.info.lpInfo
                    +"\nlpRewardApyA: "+(reserve.lpInfo?reserve.lpInfo.lpRewardApyA.toString():"0")
                    +"\nlpRewardApyB: "+(reserve.lpInfo?reserve.lpInfo.lpRewardApyB.toString():"0")
                    +"\nlpFeesApr:"+(reserve.lpInfo?reserve.lpInfo.lpFeesApr.toString():"0")
                )
            })
        })
        const reserve = larixMarket.markets[0].reserves.find(res => res.reserveConfig.name === 'SOL');
        expect(reserve!.depositLimit).toEqual(new BigNumber(1000000));
    });
    it("Read larix a market", async function () {
        larixMarket = new LarixMarkets(connection,[MARKET.stepn])
        await larixMarket.loadReservesAndRewardApy()
        larixMarket.markets.forEach(marketData=>{
            marketData.reserves.forEach(reserve=>{
                console.log(
                    "\nmarket: "+marketData.config.name
                    +"\nreserve: "+reserve.reserveConfig.name
                    +"\nprice: "+reserve.liquidityPrice.toString()
                    +"\navailableAmount: "+reserve.totalAvailableAmount.toString()
                    +"\navailableValue: "+reserve.totalAvailableValue.toString()
                    +"\nborrowAmount: "+reserve.totalBorrowedAmount.toString()
                    +"\nborrowValue:"+reserve.totalBorrowedValue.toString()
                    +"\nborrowMiningRate"+reserve.borrowMiningRate.toString()
                    +"\nsupplyApy: "+reserve.supplyApy.toString()
                    +"\nborrowApy: "+reserve.borrowApy.toString()
                    +"\nsupplyRewardApy: "+reserve.supplyRewardApy.toString()
                    +"\nborrowRewardApy: "+reserve.borrowRewardApy.toString()
                )
            })
        })
    });
    it("Read larix user info", async function () {
        const userAddress = new PublicKey('dJtmJvMXYJUBJc8NcAWSKLUU9x3437k2eKpJ4mJDVsp')
        larixMarket = new LarixMarkets(connection)
        await larixMarket.loadReservesAndRewardApy()
        larixUserInfo = new LarixUserInfo(
            userAddress,
            connection,
            larixMarket.markets
        )
        await larixUserInfo.loadUserInfo()
        larixUserInfo.marketDetails.forEach(detail=>{
            detail.mining?.detail.forEach(miningDetail=>{
                console.log(
                    "mining marketDetails"
                    +"\nmarket: "+detail.market.config.name
                    +"\nreserve: "+miningDetail.reserve.reserveConfig.name
                    +"\nminingAmount: "+miningDetail.amount.toString()
                    +"\nminingValue: "+miningDetail.value.toString()
                )
            })
            detail.obligations.forEach(obligation=>{
                console.log(
                    "obligation"
                    +"\nmarket: "+detail.market.config.name
                    +"\nborrowLimit: "+obligation.borrowLimit.toString()
                    +"\nliquidityLimit: "+obligation.liquidateLimit.toString()
                )
                obligation.deposits.forEach(deposit=>{
                    console.log(
                        "obligation deposit marketDetails"
                        +"\nmarket: "+detail.market.config.name
                        +"\nreserve: "+deposit.reserve.reserveConfig.name
                        +"\ndepositAmount: "+deposit.amount.toString()
                        +"\ndepositValue: "+deposit.value.toString()
                    )
                })
                obligation.borrows.forEach(borrow=>{
                    console.log(
                        "obligation borrow marketDetails"
                        +"\nmarket: "+detail.market.config.name
                        +"\nreserve: "+borrow.reserve.reserveConfig.name
                        +"\nborrowAmount: "+borrow.amount.toString()
                        +"\nborrowValue: "+borrow.value.toString()
                    )
                })

            })
        })
        await larixUserInfo.loadTokenAccounts()
        larixUserInfo.bindTokenAccountToReserve()
        larixUserInfo.markets.forEach(market=>{
            market.reserves.forEach(reserve=>{
                if (reserve.userLiquidityAmount.isGreaterThan(0)){
                    console.log(
                        "user token balance"
                        +"\nmarket: "+market.config.name
                        +"\nreserve: "+reserve.reserveConfig.name
                        +"\nuserLiquidityTokenAmount: "+reserve.userLiquidityAmount.toString()
                    )
                }
            })

        })
    })
    it("test larix supply", async function () {
       const userAddress = privateKey.publicKey
        larixMarket = new LarixMarkets(connection)
        await larixMarket.loadReservesAndRewardApy()

        larixUserInfo = new LarixUserInfo(
            userAddress,
            connection,
            larixMarket.markets
        )
        await larixUserInfo.loadUserInfo()
        await larixUserInfo.loadTokenAccounts()
        await larixUserInfo.bindTokenAccountToReserve()
        const larixAction = new LarixAction(
            larixUserInfo,
            new LarixHDWallet(larixUserInfo.connection,privateKey)
        )
        const marketDetail = larixUserInfo.marketDetails[0]//larixUserInfo.marketDetails.find(market=>market.market.config.name==="main")//main market
        const larixReserve = marketDetail.market.reserves.find(reserve=>reserve.reserveConfig.name==="SOL")
        const depositObligation = marketDetail.obligations[0]
        await larixAction.deposit(marketDetail,larixReserve!,new BN(10000),depositObligation)
    })
    it("test larix withdraw", async function () {
        const userAddress = privateKey.publicKey

        larixMarket = new LarixMarkets(connection)
        await larixMarket.loadReservesAndRewardApy()

        larixUserInfo = new LarixUserInfo(
            userAddress,
            connection,
            larixMarket.markets
        )
        await larixUserInfo.loadUserInfo()
        await larixUserInfo.loadTokenAccounts()
        await larixUserInfo.bindTokenAccountToReserve()
        const larixAction = new LarixAction(
            larixUserInfo,
            new LarixHDWallet(connection,privateKey)
        )
        const marketDetail = larixUserInfo.marketDetails[0]//main market
        const larixReserve = marketDetail.market.reserves.find(reserve=>reserve.reserveConfig.name==="SOL")
        const obligation = marketDetail.obligations[0]
        await larixAction.withdraw(marketDetail,larixReserve!,U64_MAX,obligation)
        // expect(reserve!.depositLimit).toEqual(new BigNumber(30000));
    })
    it("test larix collateral", async function () {
        const userAddress = privateKey.publicKey

        larixMarket = new LarixMarkets(connection)
        await larixMarket.loadReservesAndRewardApy()

        larixUserInfo = new LarixUserInfo(
            userAddress,
            connection,
            larixMarket.markets
        )
        await larixUserInfo.loadUserInfo()
        await larixUserInfo.loadTokenAccounts()
        await larixUserInfo.bindTokenAccountToReserve()
        const larixAction = new LarixAction(
            larixUserInfo,
            new LarixHDWallet(connection,privateKey)
        )
        const marketDetail = larixUserInfo.marketDetails[0]//main market
        const larixReserve = marketDetail.market.reserves.find(reserve=>reserve.reserveConfig.name==="SOL")
        const obligation = marketDetail.obligations[0]
        await larixAction.collateral(marketDetail,larixReserve!,obligation)
        // expect(reserve!.depositLimit).toEqual(new BigNumber(30000));
    })
    it("test larix un collateral", async function () {
        const userAddress = privateKey.publicKey

        larixMarket = new LarixMarkets(connection)
        await larixMarket.loadReserves()

        larixUserInfo = new LarixUserInfo(
            userAddress,
            connection,
            larixMarket.markets
        )
        await larixUserInfo.loadUserInfo()
        await larixUserInfo.loadTokenAccounts()
        await larixUserInfo.bindTokenAccountToReserve()
        const larixAction = new LarixAction(
            larixUserInfo,
            new LarixHDWallet(connection,privateKey,{skipPreflight:true},true)
        )
        const marketDetail = larixUserInfo.marketDetails[0]//main market
        const larixReserve = marketDetail.market.reserves.find(reserve=>reserve.reserveConfig.name==="SOL")
        const obligation = marketDetail.obligations[0]
        try {
            await larixAction.unCollateral(marketDetail, larixReserve!, obligation)
            console.log(larixAction.transactionResults);
        } catch (e){
            console.log(larixAction.transactionResults);
        }
    })
    it("test larix borrow", async function () {
        const userAddress = privateKey.publicKey

        larixMarket = new LarixMarkets(connection)
        await larixMarket.loadReservesAndRewardApy()

        larixUserInfo = new LarixUserInfo(
            userAddress,
            connection,
            larixMarket.markets
        )
        await larixUserInfo.loadUserInfo()
        await larixUserInfo.loadTokenAccounts()
        await larixUserInfo.bindTokenAccountToReserve()
        const larixAction = new LarixAction(
            larixUserInfo,
            new LarixHDWallet(connection,privateKey)
        )
        const marketDetail = larixUserInfo.marketDetails[0]//main market
        const larixReserve = marketDetail.market.reserves.find(reserve=>reserve.reserveConfig.name==="SOL")
        const obligation = marketDetail.obligations[0]
        await larixAction.borrow(marketDetail,larixReserve!,new BN(10),obligation)
        // expect(reserve!.depositLimit).toEqual(new BigNumber(30000));
    })
    it("test larix repay", async function () {
        const userAddress = privateKey.publicKey

        larixMarket = new LarixMarkets(connection)
        await larixMarket.loadReservesAndRewardApy()

        larixUserInfo = new LarixUserInfo(
            userAddress,
            connection,
            larixMarket.markets
        )
        await larixUserInfo.loadUserInfo()
        await larixUserInfo.loadTokenAccounts()
        await larixUserInfo.bindTokenAccountToReserve()
        const larixAction = new LarixAction(
            larixUserInfo,
            new LarixHDWallet(connection,privateKey)
        )
        const marketDetail = larixUserInfo.marketDetails[0]//main market
        const larixReserve = marketDetail.market.reserves.find(reserve=>reserve.reserveConfig.name==="SOL")
        const obligation = marketDetail.obligations[0]
        await larixAction.repay(marketDetail,larixReserve!,U64_MAX,obligation)
        /**
         * a package version that is forbidden by your security policy, or
         * npm ERR! 403 on a server you do not have access to
         */
    })
})
