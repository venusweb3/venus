import {
    Action,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    venusLogger,
} from "@venusos/core";
import { getObsidian }  from "../helper";

export const createKnowledgeAction: Action = {
    name: "CREATE_KNOWLEDGE",
    similes: [
        "BUILD_KNOWLEDGE",
        "CREATE_KNOWLEDGE_BASE",
        "CREATE_KNOWLEDGE_BASE",
        "BUILD_KNOWLEDGE_BASE"
    ],
    description:
        "Scan all markdown notes hierarchically in the Obsidian vault and build a memoryknowledge base. Use format: 'Create knowledge' or 'Build knowledge base'",
    validate: async (runtime: IAgentRuntime) => {
        try {
            venusLogger.debug("Validating Obsidian connection");
            const obsidian = await getObsidian(runtime);
            await obsidian.connect();
            venusLogger.debug("Obsidian connection validated successfully");
            return true;
        } catch (error) {
            venusLogger.error("Failed to validate Obsidian connection:", error);
            return false;
        }
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        options: any,
        callback?: HandlerCallback
    ) => {
        venusLogger.info("Starting create knowledge handler");
        const obsidian = await getObsidian(runtime);

        try {
            venusLogger.info("Fetching all notes from vault and creating knowledge base");
            venusLogger.log("Be patient, this might take a while, depending on the size of your vault...");
            if (callback) {
                callback({
                    text: "This might take a while, depending on the size of your vault...",
                    error: false,
                });
            }
            try {
                const notesMemorized = await obsidian.createMemoriesFromFiles();

                if (callback) {
                    callback({
                        text: `Finished creating knowledge base for ${notesMemorized ?? 0} notes in the vault`,
                        metadata: {
                            count: notesMemorized ?? 0,
                        },
                    });
                }

            } catch (error) {
                venusLogger.error("Error creating knowledge memories from notes:", error);
                if (callback) {
                    callback({
                        text: `Error creating knowledge memories from notes: ${error.message}`,
                        error: true,
                    });
                }
                return false;
            }

            return true;
        } catch (error) {
            venusLogger.error("Error creating knowledge base:", error);
            if (callback) {
                callback({
                    text: `Error creating knowledge base: ${error.message}`,
                    error: true,
                });
            }
            return false;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Create knowledge",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "{{responseData}}",
                    action: "CREATE_KNOWLEDGE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Build knowledge base",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "{{responseData}}",
                    action: "CREATE_KNOWLEDGE",
                },
            },
        ],
    ],
};
