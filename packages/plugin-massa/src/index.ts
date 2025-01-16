import type { Plugin } from "@venusos/core";
import transfer from "./actions/transfer";

export const massaPlugin: Plugin = {
    name: "massa",
    description: "Massa Plugin for venus",
    actions: [transfer],
    evaluators: [],
    providers: [],
};

export default massaPlugin;
