import { Plugin } from "@venusos/core";
import getPrice from "./actions/getPrice";

export const coinmarketcapPlugin: Plugin = {
    name: "coinmarketcap",
    description: "CoinMarketCap Plugin for venus",
    actions: [getPrice],
    evaluators: [],
    providers: [],
};

export default coinmarketcapPlugin;
