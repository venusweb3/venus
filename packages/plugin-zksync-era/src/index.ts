import { Plugin } from "@venusos/core";

import { TransferAction } from "./actions/";

export const zksyncEraPlugin: Plugin = {
    name: "zksync-era",
    description: "ZKsync Era Plugin for venus",
    actions: [TransferAction],
    evaluators: [],
    providers: [],
};

export default zksyncEraPlugin;
