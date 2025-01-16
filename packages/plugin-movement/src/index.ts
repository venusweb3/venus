import { Plugin } from "@venusos/core";
import transferToken from "./actions/transfer";
import { WalletProvider, walletProvider } from "./providers/wallet";

export { WalletProvider, transferToken as TransferMovementToken };

export const movementPlugin: Plugin = {
    name: "movement",
    description: "Movement Network Plugin for venus",
    actions: [transferToken],
    evaluators: [],
    providers: [walletProvider],
};

export default movementPlugin;
