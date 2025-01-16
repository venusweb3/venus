import { Plugin } from "@venusos/core";
import launchAgent from "./actions/launchAgent";

export const autonomePlugin: Plugin = {
    name: "autonome",
    description: "Autonome Plugin for venus",
    actions: [launchAgent],
    evaluators: [],
    providers: [],
};

export default autonomePlugin;
