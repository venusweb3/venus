import { Plugin } from "@venusos/core";
import { icpWalletProvider } from "./providers/wallet";
import { executeCreateToken } from "./actions/createToken";

export const icpPlugin: Plugin = {
    name: "icp",
    description: "Internet Computer Protocol Plugin for venus",
    providers: [icpWalletProvider],
    actions: [executeCreateToken],
    evaluators: [],
};

export default icpPlugin;
