import { Plugin } from "@venusos/core";
import { zgUpload } from "./actions/upload";

export const zgPlugin: Plugin = {
    description: "ZeroG Plugin for venus",
    name: "ZeroG",
    actions: [zgUpload],
    evaluators: [],
    providers: [],
};
