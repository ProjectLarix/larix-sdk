import * as BufferLayout from 'buffer-layout';
import * as Layout from '../../../utils/layout';
import {AccountInfo, PublicKey} from "@solana/web3.js";
import {State} from "../state";
import BN from "bn.js";
export interface Amm{
    status: BN,
    nonce: BN,
    orderNum: BN,
    depth: BN,
    coinDecimals: BN,
    pcDecimals: BN,
    state: BN,
    resetFlag: BN,
    minSize: BN,
    volMaxCutRatio: BN,
    amountWaveRatio: BN,
    coinLotSize: BN,
    pcLotSize: BN,
    minPriceMultiplier: BN,
    maxPriceMultiplier: BN,
    systemDecimalsValue: BN,
    // Fees
    minSeparateNumerator: BN,
    minSeparateDenominator: BN,
    tradeFeeNumerator: BN,
    tradeFeeDenominator: BN,
    pnlNumerator: BN,
    pnlDenominator: BN,
    swapFeeNumerator: BN,
    swapFeeDenominator: BN,
    // OutPutData
    needTakePnlCoin: BN,
    needTakePnlPc: BN,
    totalPnlPc: BN,
    totalPnlCoin: BN,
    poolTotalDepositPc: BN,
    poolTotalDepositCoin: BN,
    swapCoinInAmount: BN,
    swapPcOutAmount: BN,
    swapCoin2PcFee: BN,
    swapPcInAmount: BN,
    swapCoinOutAmount: BN,
    swapPc2CoinFee: BN,
    poolCoinTokenAccount: PublicKey,
    poolPcTokenAccount: PublicKey,
    coinMintAddress: PublicKey,
    pcMintAddress: PublicKey,
    lpMintAddress: PublicKey,
    ammOpenOrders: PublicKey,
    serumMarket: PublicKey,
    serumProgramId: PublicKey,
    ammTargetOrders: PublicKey,
    poolWithdrawQueue: PublicKey,
    poolTempLpTokenAccount: PublicKey,
    ammOwner: PublicKey,
    pnlOwner: PublicKey

}
export const AMM_LAYOUT_V4 : typeof BufferLayout.Structure = BufferLayout.struct([
    Layout.uint64('status'),
    Layout.uint64('nonce'),
    Layout.uint64('orderNum'),
    Layout.uint64('depth'),
    Layout.uint64('coinDecimals'),
    Layout.uint64('pcDecimals'),
    Layout.uint64('state'),
    Layout.uint64('resetFlag'),
    Layout.uint64('minSize'),
    Layout.uint64('volMaxCutRatio'),
    Layout.uint64('amountWaveRatio'),
    Layout.uint64('coinLotSize'),
    Layout.uint64('pcLotSize'),
    Layout.uint64('minPriceMultiplier'),
    Layout.uint64('maxPriceMultiplier'),
    Layout.uint64('systemDecimalsValue'),
    // Fees
    Layout.uint64('minSeparateNumerator'),
    Layout.uint64('minSeparateDenominator'),
    Layout.uint64('tradeFeeNumerator'),
    Layout.uint64('tradeFeeDenominator'),
    Layout.uint64('pnlNumerator'),
    Layout.uint64('pnlDenominator'),
    Layout.uint64('swapFeeNumerator'),
    Layout.uint64('swapFeeDenominator'),
    // OutPutData
    Layout.uint64('needTakePnlCoin'),
    Layout.uint64('needTakePnlPc'),
    Layout.uint64('totalPnlPc'),
    Layout.uint64('totalPnlCoin'),
    Layout.uint128('poolTotalDepositPc'),
    Layout.uint128('poolTotalDepositCoin'),
    Layout.uint128('swapCoinInAmount'),
    Layout.uint128('swapPcOutAmount'),
    Layout.uint64('swapCoin2PcFee'),
    Layout.uint128('swapPcInAmount'),
    Layout.uint128('swapCoinOutAmount'),
    Layout.uint64('swapPc2CoinFee'),

    Layout.publicKey('poolCoinTokenAccount'),
    Layout.publicKey('poolPcTokenAccount'),
    Layout.publicKey('coinMintAddress'),
    Layout.publicKey('pcMintAddress'),
    Layout.publicKey('lpMintAddress'),
    Layout.publicKey('ammOpenOrders'),
    Layout.publicKey('serumMarket'),
    Layout.publicKey('serumProgramId'),
    Layout.publicKey('ammTargetOrders'),
    Layout.publicKey('poolWithdrawQueue'),
    Layout.publicKey('poolTempLpTokenAccount'),
    Layout.publicKey('ammOwner'),
    Layout.publicKey('pnlOwner')
]);

export const AmmParser = (pubkey: PublicKey, info: AccountInfo<Buffer>|null):State<Amm> => {
    if (info == null){
        throw new Error("");
    }
    const buffer = Buffer.from(info.data);
    const reserve = AMM_LAYOUT_V4.decode(buffer) as Amm;
    const details = {
        pubkey,
        account: {
            ...info,
        },
        info: reserve,
    } as State<Amm>;

    return details;
}