import { Plugin } from "@venusos/core";

import transfer from "./actions/transfer.ts";

export const lensPlugin: Plugin = {
    name: "Lens",
    description: "Lens Plugin for venus",
    actions: [transfer],
    evaluators: [],
    providers: [],
};

export default lensPlugin;
