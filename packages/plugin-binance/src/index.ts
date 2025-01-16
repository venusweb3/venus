import { Plugin } from "@venusos/core";
import { priceCheck } from "./actions/priceCheck";
import { spotBalance } from "./actions/spotBalance";
import { spotTrade } from "./actions/spotTrade";

// Export the plugin configuration
export const binancePlugin: Plugin = {
    name: "binance",
    description: "Binance Plugin for venus",
    actions: [spotTrade, priceCheck, spotBalance],
    evaluators: [],
    providers: [],
};

export default binancePlugin;
