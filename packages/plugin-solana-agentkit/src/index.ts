import { Plugin } from "@venusos/core";
import createToken from "./actions/createToken.ts";

export const solanaAgentkitPlguin: Plugin = {
    name: "solana",
    description: "Solana Plugin with solana agent kit for venus",
    actions: [createToken],
    evaluators: [],
    providers: [],
};

export default solanaAgentkitPlguin;
