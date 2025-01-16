import { Plugin } from "@venusos/core";
import transferToken from "./actions/transfer.ts";
import { WalletProvider, walletProvider } from "./providers/wallet.ts";

export { WalletProvider, transferToken as TransferSuiToken };

export const suiPlugin: Plugin = {
    name: "sui",
    description: "Sui Plugin for venus",
    actions: [transferToken],
    evaluators: [],
    providers: [walletProvider],
};

export default suiPlugin;
