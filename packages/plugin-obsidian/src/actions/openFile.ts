import {
    Action,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    venusLogger,
    composeContext,
    generateObject,
    ModelClass
} from "@venusos/core";
import { fileSchema, isValidFile } from "../types";
import { getObsidian } from "../helper";
import { fileTemplate } from "../templates/file";

export const openFileAction: Action = {
    name: "OPEN_FILE",
    similes: [
        "OPEN",
        "LAUNCH_FILE",
        "DISPLAY_FILE",
        "SHOW_FILE",
        "VIEW_FILE"
    ],
    description:
        "Open a file in the Obsidian interface. Use format: 'Open FOLDER/SUBFOLDER/filename'",
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
        venusLogger.info("Starting open file handler");
        const obsidian = await getObsidian(runtime);

        try {
            // Initialize or update state for context generation
            if (!state) {
                state = (await runtime.composeState(message)) as State;
            } else {
                state = await runtime.updateRecentMessageState(state);
            }

            const context = composeContext({
                state,
                template: fileTemplate(message.content.text),
            });

            const fileContext = await generateObject({
                runtime,
                context,
                modelClass: ModelClass.MEDIUM,
                schema: fileSchema,
                stop: ["\n"]
            }) as any;

            if (!isValidFile(fileContext.object)) {
                venusLogger.error(
                    "Invalid file path. Format: 'Open FOLDER/SUBFOLDER/filename' - ",
                    fileContext.object
                );

                if (callback) {
                    callback({
                        text: `Invalid file path. Format: 'Open FOLDER/SUBFOLDER/filename' - ${fileContext.object}`,
                        error: true,
                    });
                }
                return false;
            }

            const { path } = fileContext.object;

            venusLogger.info(`Opening file at path: ${path}`);
            await obsidian.openFile(path);
            venusLogger.info(`Successfully opened file: ${path}`);

            if (callback) {
                callback({
                    text: `Successfully opened file: ${path}`,
                    metadata: {
                        path: path,
                        operation: "OPEN",
                        success: true
                    },
                });
            }
            return true;
        } catch (error) {
            venusLogger.error("Error opening file:", error);
            if (callback) {
                callback({
                    text: `Error opening file: ${error.message}`,
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
                    text: "Open DOCUMENTS/report.txt",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "{{responseData}}",
                    action: "OPEN_FILE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show PROJECTS/src/config.json",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "{{responseData}}",
                    action: "OPEN_FILE",
                },
            },
        ],
    ],
};