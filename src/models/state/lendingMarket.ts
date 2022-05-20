import { AccountInfo, PublicKey } from '@solana/web3.js';
import * as BufferLayout from 'buffer-layout';
import * as Layout from '../../utils/layout';
import {State} from "../../type";

export interface LendingMarket {
  version: number;
  bumpSeed:Buffer;
  isInitialized: boolean;
    pendingOwner:PublicKey,
    owner:PublicKey,
  quoteCurrency: Buffer;
  tokenProgramId: PublicKey;
  oracleProgramId: PublicKey;
    larixOracleProgramId: PublicKey;
    larixOracleId:PublicKey,
    mineMint:PublicKey,
    mineSupply:PublicKey,
}

export const LendingMarketLayout: typeof BufferLayout.Structure = BufferLayout.struct(
  [
    BufferLayout.u8('version'),
    BufferLayout.blob(1,'bumpSeed'),
    Layout.publicKey("pendingOwner"),
    Layout.publicKey('owner'),
    BufferLayout.blob(32,"quoteCurrency"),
    Layout.publicKey('tokenProgramId'),
    Layout.publicKey("oracleProgramId"),
    Layout.publicKey("larixOracleProgramId"),
    Layout.publicKey("larixOracleId"),
      Layout.publicKey("mineMint"),
      Layout.publicKey("mineSupply"),
    BufferLayout.blob(128, 'padding'),
  ],
);

export const isLendingMarket = (info: AccountInfo<Buffer>) => {
  return info.data.length === LendingMarketLayout.span;
};

export const LendingMarketParser = (
  pubkey: PublicKey,
  info: AccountInfo<Buffer>,
):State<LendingMarket> => {
  const buffer = Buffer.from(info.data);
  const lendingMarket = LendingMarketLayout.decode(buffer) as LendingMarket;

  const details = {
    pubkey,
    account: {
      ...info,
    },
    info: lendingMarket,
  } as State<LendingMarket>;

  return details;
};
