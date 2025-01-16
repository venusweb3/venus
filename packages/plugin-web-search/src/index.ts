import { webSearch } from "./actions/webSearch";
import { Plugin } from "@venusos/core";
import { WebSearchService } from "./services/webSearchService";

export const webSearchPlugin: Plugin = {
    name: "webSearch",
    description: "Search the web and get news",
    actions: [webSearch],
    evaluators: [],
    providers: [],
    services: [new WebSearchService()],
    clients: [],
};

export default webSearchPlugin;
