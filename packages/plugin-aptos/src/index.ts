import { Plugin } from "@venusos/core";
import transferToken from "./actions/transfer.ts";
import { WalletProvider, walletProvider } from "./providers/wallet.ts";

export { WalletProvider, transferToken as TransferAptosToken };

export const aptosPlugin: Plugin = {
    name: "aptos",
    description: "Aptos Plugin for venus",
    actions: [transferToken],
    evaluators: [],
    providers: [walletProvider],
};

export default aptosPlugin;
