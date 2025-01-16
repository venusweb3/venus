import {
    IAgentRuntime,
    Memory,
    Provider,
    State,
    venusLogger,
} from "@venusos/core";
import { SUPPORTED_TOKENS } from "../utils/constants.ts";

export const tokensProvider: Provider = {
    get: async (_runtime: IAgentRuntime, _message: Memory, _state?: State) => {
        venusLogger.debug("tokensProvider::get");
        const tokens = Object.entries(SUPPORTED_TOKENS)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n");
        return `The supported tokens for Spheron operations are:\n${tokens}`;
    },
};
