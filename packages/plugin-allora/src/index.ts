import { Plugin } from "@venusos/core";
import { getInferenceAction } from "./actions/getInference.ts";
import { topicsProvider } from "./providers/topics.ts";

export const alloraPlugin: Plugin = {
    name: "Allora Network plugin",
    description: "Allora Network plugin for venus",
    actions: [getInferenceAction],
    evaluators: [],
    providers: [topicsProvider],
};
