import { Plugin } from "@venusos/core";
import transfer from "./actions/transfer";

export const quaiPlugin: Plugin = {
    name: "quai",
    description: "Quai Plugin for venus",
    actions: [transfer],
    evaluators: [],
    providers: [],
};

export default quaiPlugin;
