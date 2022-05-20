import BigNumber from "bignumber.js";
const fetch = require('node-fetch');

export async function getLarixPrice(){
    const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=larix&vs_currencies=usd"
    );
    const result = (await response.json());
    return new BigNumber(result.larix.usd);
}
export async function  getMndePrice(){
    const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=marinade&vs_currencies=usd"
    );
    const result = await response.json()
    return new BigNumber(result.marinade.usd)

}
export async function getRaydiumPools(){
    const response = await fetch(
        "https://api.raydium.io/pairs"
    );
    const result = (await response.json())
    return result
}

