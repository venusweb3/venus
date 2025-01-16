import {
    Provider,
    IAgentRuntime,
    Memory,
    State,
    venusLogger,
} from "@venusos/core";

export const sampleProvider: Provider = {
    get: async (runtime: IAgentRuntime, message: Memory, state: State) => {
        // Data retrieval logic for the provider
        venusLogger.log("Retrieving data in sampleProvider...");
    },
};
