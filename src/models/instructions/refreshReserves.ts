
import {
  PublicKey,
  TransactionInstruction,
} from '@solana/web3.js';
import * as BufferLayout from 'buffer-layout';
import { LendingInstruction } from './instruction';
import {State, Reserve} from "../state";

export const refreshReservesInstruction = (
    reserves: Array<State<Reserve>>,
    lendingProgramID:PublicKey
): TransactionInstruction => {
  const dataLayout = BufferLayout.struct([BufferLayout.u8('instruction')]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode({ instruction: LendingInstruction.RefreshReserves }, data);

  const keys:{ pubkey: PublicKey, isSigner: boolean, isWritable: boolean }[] = [];
  reserves.map((reserve)=>{
    keys.push({ pubkey: reserve.pubkey, isSigner: false, isWritable: true })
    if (reserve.info.isLP){
      keys.push({ pubkey: reserve.info.liquidity.params_2, isSigner: false, isWritable: false })
    } else {
      if (reserve.info.liquidity.usePythOracle){
        keys.push({ pubkey: reserve.info.liquidity.params_1, isSigner: false, isWritable: false })
      } else {
        keys.push({ pubkey: reserve.info.liquidity.params_2, isSigner: false, isWritable: false })
      }
    }

  })
  return new TransactionInstruction({
    keys,
    programId: lendingProgramID,
    data,
  });
};
