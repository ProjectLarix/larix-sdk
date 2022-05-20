import {AccountInfo, PublicKey} from "@solana/web3.js";
import {AccountInfo as TokenAccountInfo, AccountLayout, u64} from "@solana/spl-token";


export interface TokenAccount {
    pubkey: PublicKey;
    account: AccountInfo<Buffer>;
    info: TokenAccountInfo;
}
export const TokenAccountParser = (
    pubKey: PublicKey,
    info: AccountInfo<Buffer>|null
) => {
    if (info==null){
        throw new Error("Info can not be null")
    }
    const buffer = Buffer.from(info.data);
    const data = deserializeAccount(buffer);

    const details = {
        pubkey: pubKey,
        account: {
            ...info,
        },
        info: data,
    } as TokenAccount;

    return details;
};

export const deserializeAccount = (data: Buffer) => {
    const accountInfo = AccountLayout.decode(data);
    accountInfo.mint = new PublicKey(accountInfo.mint);
    accountInfo.owner = new PublicKey(accountInfo.owner);
    accountInfo.amount = u64.fromBuffer(accountInfo.amount);

    if (accountInfo.delegateOption === 0) {
        accountInfo.delegate = null;
        //@ts-ignore
        accountInfo.delegatedAmount = new u64(0);
    } else {
        accountInfo.delegate = new PublicKey(accountInfo.delegate);
        accountInfo.delegatedAmount = u64.fromBuffer(accountInfo.delegatedAmount);
    }

    accountInfo.isInitialized = accountInfo.state !== 0;
    accountInfo.isFrozen = accountInfo.state === 2;

    if (accountInfo.isNativeOption === 1) {
        accountInfo.rentExemptReserve = u64.fromBuffer(accountInfo.isNative);
        accountInfo.isNative = true;
    } else {
        accountInfo.rentExemptReserve = null;
        accountInfo.isNative = false;
    }

    if (accountInfo.closeAuthorityOption === 0) {
        accountInfo.closeAuthority = null;
    } else {
        accountInfo.closeAuthority = new PublicKey(accountInfo.closeAuthority);
    }

    return accountInfo;
};