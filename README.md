

## Installation

```
npm install @Projectlarix/larix-sdk
```

# Larix Typescript SDK

## Usage

### Get market info

```typescript
    const larixMarket = new LarixMarkets(URL)
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
            )
        })
    })
    const reserve = larixMarket.markets[0].reserves.find(res => res.reserveConfig.name === 'SOL');
    expect(reserve!.depositLimit).toEqual(new BigNumber(1000000));
```
### Get user info


```typescript
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
```
 
### Action

```typescript
    const privateKey = Keypair.fromSecretKey(Uint8Array.from([145,87]))
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
    const laraixWallet = new LarixHDWallet(connection,privateKey)
    // or new LarixWebWallet(larixUserInfo.connection,wallet)
    const larixAction = new LarixAction(
        larixUserInfo,
        laraixWallet
    )
    const marketDetails = larixUserInfo.marketDetails[0]//main market
    // or const marketDetails = larixUserInfo.marketDetails.find(market=>market.market.config.name==="main")
    const larixReserve = marketDetails.market.reserves.find(reserve=>reserve.reserveConfig.name==="SOL")
    const depositObligation = marketDetails.obligations[0]
    await larixAction.deposit(marketDetails,larixReserve!,new BN(10000),depositObligation)
```
### Exception
```typescript
    try {
        await larixAction.unCollateral(marketDetail, larixReserve!, obligation)
    } catch (e){
        console.log(larixAction.transactionResults);
    }
```

## FAQ

#### 


