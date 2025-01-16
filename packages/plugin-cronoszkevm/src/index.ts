import { Plugin } from "@venusos/core";

import { TransferAction } from "./actions";

export const cronosZkEVMPlugin: Plugin = {
    name: "cronoszkevm",
    description: "Cronos zkEVM plugin for venus",
    actions: [TransferAction],
    evaluators: [],
    providers: [],
};

export default cronosZkEVMPlugin;
