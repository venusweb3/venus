import {venusLogger, IAgentRuntime, Memory, Provider, State} from "@venusos/core";
import {TwitterScraper} from "../util/twitterScraper.ts";

const tweetProvider: Provider = {
    get: async (runtime: IAgentRuntime, message: Memory, _state?: State) => {
        const scraperWithPrimus = new TwitterScraper();
        try {
            venusLogger.info("Attempting Twitter login");
            await scraperWithPrimus.login();
            venusLogger.info("Twitter login successful");
        }catch (error){
            venusLogger.error("Twitter login failed:", error);
            return false;
        }

        if (!(await scraperWithPrimus.getScraper().isLoggedIn())) {
            venusLogger.error("Failed to login to Twitter");
            return false;
        }
        const userName = process.env.TWITTER_USERNAME_WANT_TO_GET_TWEET;
        if(!userName){
            venusLogger.error("TWITTER_USERNAME_WANT_TO_GET_TWEET is not set");
            return false;
        }
        venusLogger.debug(`Fetching tweets for user: ${userName}`);
        const userId = await scraperWithPrimus.getUserIdByScreenName(userName);
        venusLogger.debug(`Fetching tweets for user: ${userName}`);
        try {
            const result = await scraperWithPrimus.getUserLatestTweet(userId);
            venusLogger.debug("Tweet retrieved successfully");
            return result;
        } catch (error) {
            venusLogger.error("Failed to fetch tweet:", error);
            return false;
        }
    },
};

export { tweetProvider };