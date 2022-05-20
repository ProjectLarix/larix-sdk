import {State, Obligation, Reserve} from "../../../models";

export function getAllReserveOfObligation(obligation:State<Obligation>, allReserve:State<Reserve>[], reserveSet:Set<State<Reserve>>){
    if (obligation){
        obligation.info.deposits.map((collateral)=>{
            allReserve.map((reserve)=>{
                if (collateral.depositReserve.equals(reserve.pubkey)){
                    reserveSet.add(reserve)
                }
            })
        })
        obligation.info.borrows.map((collateral)=>{
            allReserve.map((reserve)=>{
                if (collateral.borrowReserve.equals(reserve.pubkey)){
                    reserveSet.add(reserve)
                }
            })
        })
    }


}