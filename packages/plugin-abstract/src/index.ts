import { Plugin } from "@venusos/core";

import { transferAction } from "./actions";

export const abstractPlugin: Plugin = {
    name: "abstract",
    description: "Abstract Plugin for venus",
    actions: [transferAction],
    evaluators: [],
    providers: [],
};

export default abstractPlugin;
