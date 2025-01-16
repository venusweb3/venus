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
import { getObsidian }  from "../helper";
import { fileTemplate } from "../templates/file";

export const readFileAction: Action = {
    name: "READ_FILE",
    similes: [
        "GET_FILE",
        "FETCH_FILE",
        "READ_FILE",
        "RETRIEVE_FILE",
        "LOAD_FILE",
        "OPEN_FILE",
        "ACCESS_FILE",
        "VIEW_FILE",
        "SHOW_FILE",
        "READ",
    ],
    description:
        "Retrieve and display the content of any file from Obsidian vault by path. Use format: 'Read FOLDER/SUBFOLDER/filename'",
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
        venusLogger.info("Starting read file handler");
        const obsidian = await getObsidian(runtime);

        try {
            let path = "";
            /*const text = message.content.text;

            // Extract path from text like "Read FOLDER/file.txt"
            if (text) {
                const match = text.match(/^(?:Read\s+)?(.+)$/i);
                if (match) {
                    path = match[1];
                }
            }

            // Fallback to explicit path if provided
            if (!path && message.content.path) {
                path = message.content.path as string;
            }

            if (!path) {
                throw new Error(
                    "File path is required. Use format: 'Read FOLDER/SUBFOLDER/filename'"
                );
            }*/
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
                    "A file path is required. Use format: 'Read FOLDER/SUBFOLDER/filename' - ",
                    fileContext.object
                );

                if (callback) {
                    callback({
                        text: `A file path is required. Use format: 'Read FOLDER/SUBFOLDER/filename' - ${fileContext.object}`,
                        error: true,
                    });
                }

                return false;
            }

            // Extract path from note context
            path = fileContext.object.path;

            venusLogger.info(`Reading file at path: ${path}`);
            const fileContent: string = await obsidian.readFile(path);

            venusLogger.info(`Successfully read file: ${path}`);

            if (callback) {
                callback({
                    text: fileContent,
                    metadata: {
                        path: path,
                    },
                });
            }
            return true;
        } catch (error) {
            venusLogger.error("Error reading file:", error);
            if (callback) {
                callback({
                    text: `Error reading file: ${error.message}`,
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
                    text: "Get DOCUMENTS/report.pdf",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "{{responseData}}",
                    action: "READ_FILE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Read PROJECTS/src/main.ts",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "{{responseData}}",
                    action: "READ_FILE",
                },
            },
        ],
    ],
};
