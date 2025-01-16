import {
    Action,
    IAgentRuntime,
    Memory,
    State,
    composeContext,
    venusLogger,
    ModelClass,
    generateObject,
    truncateToCompleteSentence,
} from "@venusos/core";
import { Scraper } from "agent-twitter-client";
import { tweetTemplate } from "../templates";
import { isTweetContent, TweetSchema } from "../types";

export const DEFAULT_MAX_TWEET_LENGTH = 280;

async function composeTweet(
    runtime: IAgentRuntime,
    _message: Memory,
    state?: State
): Promise<string> {
    try {
        const context = composeContext({
            state,
            template: tweetTemplate,
        });

        const tweetContentObject = await generateObject({
            runtime,
            context,
            modelClass: ModelClass.SMALL,
            schema: TweetSchema,
            stop: ["\n"],
        });

        if (!isTweetContent(tweetContentObject.object)) {
            venusLogger.error(
                "Invalid tweet content:",
                tweetContentObject.object
            );
            return;
        }

        let trimmedContent = tweetContentObject.object.text.trim();

        // Truncate the content to the maximum tweet length specified in the environment settings.
        const maxTweetLength = runtime.getSetting("MAX_TWEET_LENGTH");
        if (maxTweetLength) {
            trimmedContent = truncateToCompleteSentence(
                trimmedContent,
                Number(maxTweetLength)
            );
        }

        return trimmedContent;
    } catch (error) {
        venusLogger.error("Error composing tweet:", error);
        throw error;
    }
}

async function sendTweet(twitterClient: Scraper, content: string) {
    const result = await twitterClient.sendTweet(content);

    const body = await result.json();
    venusLogger.log("Tweet response:", body);

    // Check for Twitter API errors
    if (body.errors) {
        const error = body.errors[0];
        venusLogger.error(
            `Twitter API error (${error.code}): ${error.message}`
        );
        return false;
    }

    // Check for successful tweet creation
    if (!body?.data?.create_tweet?.tweet_results?.result) {
        venusLogger.error("Failed to post tweet: No tweet result in response");
        return false;
    }

    return true;
}

async function postTweet(
    runtime: IAgentRuntime,
    content: string
): Promise<boolean> {
    try {
        const twitterClient = runtime.clients.twitter?.client?.twitterClient;
        const scraper = twitterClient || new Scraper();

        if (!twitterClient) {
            const username = runtime.getSetting("TWITTER_USERNAME");
            const password = runtime.getSetting("TWITTER_PASSWORD");
            const email = runtime.getSetting("TWITTER_EMAIL");
            const twitter2faSecret = runtime.getSetting("TWITTER_2FA_SECRET");

            if (!username || !password) {
                venusLogger.error(
                    "Twitter credentials not configured in environment"
                );
                return false;
            }
            // Login with credentials
            await scraper.login(username, password, email, twitter2faSecret);
            if (!(await scraper.isLoggedIn())) {
                venusLogger.error("Failed to login to Twitter");
                return false;
            }
        }

        // Send the tweet
        venusLogger.log("Attempting to send tweet:", content);

        try {
            if (content.length > DEFAULT_MAX_TWEET_LENGTH) {
                const noteTweetResult = await scraper.sendNoteTweet(content);
                if (
                    noteTweetResult.errors &&
                    noteTweetResult.errors.length > 0
                ) {
                    // Note Tweet failed due to authorization. Falling back to standard Tweet.
                    return await sendTweet(scraper, content);
                } else {
                    return true;
                }
            } else {
                return await sendTweet(scraper, content);
            }
        } catch (error) {
            throw new Error(`Note Tweet failed: ${error}`);
        }
    } catch (error) {
        // Log the full error details
        venusLogger.error("Error posting tweet:", {
            message: error.message,
            stack: error.stack,
            name: error.name,
            cause: error.cause,
        });
        return false;
    }
}

export const postAction: Action = {
    name: "POST_TWEET",
    similes: ["TWEET", "POST", "SEND_TWEET"],
    description: "Post a tweet to Twitter",
    validate: async (
        runtime: IAgentRuntime,
        message: Memory,
        state?: State
    ) => {
        const username = runtime.getSetting("TWITTER_USERNAME");
        const password = runtime.getSetting("TWITTER_PASSWORD");
        const email = runtime.getSetting("TWITTER_EMAIL");
        const hasCredentials = !!username && !!password && !!email;
        venusLogger.log(`Has credentials: ${hasCredentials}`);

        return hasCredentials;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state?: State
    ): Promise<boolean> => {
        try {
            // Generate tweet content using context
            const tweetContent = await composeTweet(runtime, message, state);

            if (!tweetContent) {
                venusLogger.error("No content generated for tweet");
                return false;
            }

            venusLogger.log(`Generated tweet content: ${tweetContent}`);

            // Check for dry run mode - explicitly check for string "true"
            if (
                process.env.TWITTER_DRY_RUN &&
                process.env.TWITTER_DRY_RUN.toLowerCase() === "true"
            ) {
                venusLogger.info(
                    `Dry run: would have posted tweet: ${tweetContent}`
                );
                return true;
            }

            return await postTweet(runtime, tweetContent);
        } catch (error) {
            venusLogger.error("Error in post action:", error);
            return false;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "You should tweet that" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "I'll share this update with my followers right away!",
                    action: "POST_TWEET",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Post this tweet" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "I'll post that as a tweet now.",
                    action: "POST_TWEET",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Share that on Twitter" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "I'll share this message on Twitter.",
                    action: "POST_TWEET",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Post that on X" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "I'll post this message on X right away.",
                    action: "POST_TWEET",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "You should put that on X dot com" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "I'll put this message up on X.com now.",
                    action: "POST_TWEET",
                },
            },
        ],
    ],
};
