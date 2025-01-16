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

export const updateFileAction: Action = {
    name: "UPDATE_FILE",
    similes: [
        "PATCH_FILE",
        "MODIFY_FILE",
        "UPDATE",
        "PATCH",
        "EDIT_FILE",
        "CHANGE_FILE"
    ],
    description:
        "Update an existing file in the Obsidian vault. Use format: 'Update FOLDER/SUBFOLDER/filename with content: your_content'",
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
        venusLogger.info("Starting update file handler");
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
                    "Invalid file information. Required: path and content. Format: 'Update FOLDER/SUBFOLDER/filename with content: your_content' - ",
                    fileContext.object
                );

                if (callback) {
                    callback({
                        text: `Invalid file information. Required: path and content. Format: 'Update FOLDER/SUBFOLDER/filename with content: your_content' - ${fileContext.object}`,
                        error: true,
                    });
                }
                return false;
            }

            const { path, content } = fileContext.object;

            if (!content) {
                venusLogger.error("File content is required for updating");
                if (callback) {
                    callback({
                        text: "File content is required for updating",
                        error: true,
                    });
                }
                return false;
            }

            venusLogger.info(`Updating file at path: ${path}`);
            // Note: patchFile will only update existing files, it will not create new ones
            await obsidian.patchFile(path, content);
            venusLogger.info(`Successfully updated file: ${path}`);

            if (callback) {
                callback({
                    text: `Successfully updated file: ${path}`,
                    metadata: {
                        path: path,
                        operation: "UPDATE",
                        success: true
                    },
                });
            }
            return true;
        } catch (error) {
            venusLogger.error("Error updating file:", error);
            if (callback) {
                callback({
                    text: `Error updating file: ${error.message}`,
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
                    text: "Update DOCUMENTS/report.txt with content: This is an updated report",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "{{responseData}}",
                    action: "UPDATE_FILE",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Patch PROJECTS/src/config.json with content: { \"version\": \"2.0.0\" }",
                },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "{{responseData}}",
                    action: "UPDATE_FILE",
                },
            },
        ],
    ],
};