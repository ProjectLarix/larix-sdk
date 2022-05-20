import BigNumber from "bignumber.js";
import {Reserve} from "../models";

export const eX = (value: string | number, x: string | number) => {
    return new BigNumber(`${value}e${x}`);
};