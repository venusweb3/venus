import { createEventAdapter } from "@slack/events-api";
import { WebClient } from "@slack/web-api";
import { SlackConfig } from "./types/slack-types";
import { MessageManager } from "./messages";
import { venusLogger } from "@venusos/core";

export class EventHandler {
    private events: ReturnType<typeof createEventAdapter>;
    private messageManager: MessageManager;

    constructor(
        config: SlackConfig,
        client: WebClient,
        messageManager: MessageManager
    ) {
        venusLogger.log("🎮 Initializing Slack event handler...");
        venusLogger.debug(
            "Creating event adapter with signing secret:",
            config.signingSecret.slice(0, 4) + "..."
        );
        this.events = createEventAdapter(config.signingSecret);
        this.messageManager = messageManager;

        this.setupEventListeners();
        venusLogger.log("✅ Event handler initialization complete");
    }

    private setupEventListeners() {
        venusLogger.log("📡 Setting up event listeners...");

        // Handle URL verification
        this.events.on("url_verification", (event: any) => {
            venusLogger.debug("🔍 [URL_VERIFICATION] Received challenge:", {
                type: event.type,
                challenge: event.challenge,
            });
            return event.challenge;
        });

        // Handle messages
        this.events.on("message", async (event: any) => {
            try {
                venusLogger.debug("📨 [MESSAGE] Received message event:", {
                    type: event.type,
                    subtype: event.subtype,
                    user: event.user,
                    channel: event.channel,
                    text: event.text,
                    ts: event.ts,
                    thread_ts: event.thread_ts,
                    raw_event: JSON.stringify(event, null, 2),
                });
                await this.messageManager.handleMessage(event);
            } catch (error) {
                venusLogger.error(
                    "❌ [MESSAGE] Error handling message event:",
                    error
                );
            }
        });

        // Handle app mentions
        this.events.on("app_mention", async (event: any) => {
            try {
                venusLogger.debug("🔔 [MENTION] Received app mention event:", {
                    type: event.type,
                    user: event.user,
                    channel: event.channel,
                    text: event.text,
                    ts: event.ts,
                    thread_ts: event.thread_ts,
                    raw_event: JSON.stringify(event, null, 2),
                });
                await this.messageManager.handleMessage(event);
            } catch (error) {
                venusLogger.error(
                    "❌ [MENTION] Error handling app mention event:",
                    error
                );
            }
        });

        // Handle reactions
        this.events.on("reaction_added", async (event: any) => {
            try {
                venusLogger.debug("⭐ [REACTION] Reaction added:", {
                    type: event.type,
                    user: event.user,
                    reaction: event.reaction,
                    item: event.item,
                    raw_event: JSON.stringify(event, null, 2),
                });
                // TODO: Implement reaction handling
            } catch (error) {
                venusLogger.error(
                    "❌ [REACTION] Error handling reaction_added event:",
                    error
                );
            }
        });

        this.events.on("reaction_removed", async (event: any) => {
            try {
                venusLogger.debug("💫 [REACTION] Reaction removed:", {
                    type: event.type,
                    user: event.user,
                    reaction: event.reaction,
                    item: event.item,
                    raw_event: JSON.stringify(event, null, 2),
                });
                // TODO: Implement reaction handling
            } catch (error) {
                venusLogger.error(
                    "❌ [REACTION] Error handling reaction_removed event:",
                    error
                );
            }
        });

        // Handle errors
        this.events.on("error", (error: Error) => {
            venusLogger.error("❌ [ERROR] Slack Events API error:", error);
        });

        // Add debug logging for all events
        this.events.on("*", (event: any) => {
            venusLogger.debug("🔄 [RAW] Raw Slack event received:", {
                type: event.type,
                subtype: event.subtype,
                user: event.user,
                channel: event.channel,
                ts: event.ts,
                raw_event: JSON.stringify(event, null, 2),
            });
        });

        venusLogger.log("✅ Event listeners setup complete");
    }

    public getEventAdapter() {
        venusLogger.debug(
            "🔌 [ADAPTER] Returning event adapter for express middleware"
        );
        return this.events;
    }
}
