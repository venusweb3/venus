import { IAgentRuntime, venusLogger } from "@venusos/core";

export async function validateEchoChamberConfig(
    runtime: IAgentRuntime
): Promise<void> {
    const apiUrl = runtime.getSetting("ECHOCHAMBERS_API_URL");
    const apiKey = runtime.getSetting("ECHOCHAMBERS_API_KEY");

    if (!apiUrl) {
        venusLogger.error(
            "ECHOCHAMBERS_API_URL is required. Please set it in your environment variables."
        );
        throw new Error("ECHOCHAMBERS_API_URL is required");
    }

    if (!apiKey) {
        venusLogger.error(
            "ECHOCHAMBERS_API_KEY is required. Please set it in your environment variables."
        );
        throw new Error("ECHOCHAMBERS_API_KEY is required");
    }

    // Validate API URL format
    try {
        new URL(apiUrl);
    } catch (error) {
        venusLogger.error(
            `Invalid ECHOCHAMBERS_API_URL format: ${apiUrl}. Please provide a valid URL.`
        );
        throw new Error("Invalid ECHOCHAMBERS_API_URL format");
    }

    // Optional settings with defaults
    const username =
        runtime.getSetting("ECHOCHAMBERS_USERNAME") ||
        `agent-${runtime.agentId}`;
    // Change from DEFAULT_ROOM to ROOMS
    const rooms = runtime.getSetting("ECHOCHAMBERS_ROOMS")?.split(",").map(r => r.trim()) || ["general"];

    const pollInterval = Number(
        runtime.getSetting("ECHOCHAMBERS_POLL_INTERVAL") || 120
    );

    if (isNaN(pollInterval) || pollInterval < 1) {
        venusLogger.error(
            "ECHOCHAMBERS_POLL_INTERVAL must be a positive number in seconds"
        );
        throw new Error("Invalid ECHOCHAMBERS_POLL_INTERVAL");
    }

    venusLogger.log("EchoChambers configuration validated successfully");
    venusLogger.log(`API URL: ${apiUrl}`);
    venusLogger.log(`Username: ${username}`);
    venusLogger.log(`Watching Rooms: ${rooms.join(", ")}`);
    venusLogger.log(`Poll Interval: ${pollInterval}s`);
}
