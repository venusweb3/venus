import {
    Action,
    ActionExample,
    venusLogger,
    type IAgentRuntime,
    type Memory,
    type State,
} from "@venusos/core";
import { BirdeyeProvider } from "../birdeye";
import { waitFor } from "../utils";

// This is a dummy action generated solely to test all Birdeye endpoints and should not be used in production
export const testAllEndpointsAction = {
    name: "BIRDEYE_TEST_ALL_ENDPOINTS",
    similes: [],
    description: "Test all Birdeye endpoints with sample data",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        options: any,
        callback?: any
    ) => {
        try {
            venusLogger.info("Testing all endpoints");

            await waitFor(1000);

            const birdeyeProvider = new BirdeyeProvider(runtime.cacheManager);

            // Sample data for testing
            const sampleParams = {
                token: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
                address: "MfDuWeqSHEqTFVYZ7LoexgAK9dxk7cy4DFJWjWMGVWa",
                network: "solana",
                list_address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
                address_type: "token",
                type: "1D",
                tx_type: "all",
                sort_type: "desc",
                unixtime: 1234567890,
                base_address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
                quote_address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
                time_to: 1672531199, // Unix timestamp
                meme_platform_enabled: true,
                time_frame: "1D",
                sort_by: undefined,
                list_addresses: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
                wallet: "MfDuWeqSHEqTFVYZ7LoexgAK9dxk7cy4DFJWjWMGVWa",
                token_address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm",
                pair: "samplePair",
                before_time: 1672531199,
                after_time: 1672331199,
            };

            // Test each fetch function
            venusLogger.info("fetchDefiSupportedNetworks");
            await birdeyeProvider.fetchDefiSupportedNetworks();
            venusLogger.success("fetchDefiSupportedNetworks: SUCCESS!");
            await waitFor(500);

            venusLogger.info("fetchDefiPrice");
            await birdeyeProvider.fetchDefiPrice({ ...sampleParams });
            venusLogger.success("fetchDefiPrice: SUCCESS!");
            await waitFor(500);

            venusLogger.info("fetchDefiPriceMultiple");
            await birdeyeProvider.fetchDefiPriceMultiple({ ...sampleParams });
            venusLogger.success("fetchDefiPriceMultiple: SUCCESS!");
            await waitFor(500);

            venusLogger.info("fetchDefiPriceMultiple_POST");
            await birdeyeProvider.fetchDefiPriceMultiple_POST({
                ...sampleParams,
            });
            venusLogger.success("fetchDefiPriceMultiple_POST: SUCCESS!");
            await waitFor(500);

            venusLogger.info("fetchDefiPriceHistorical");
            await birdeyeProvider.fetchDefiPriceHistorical({
                ...sampleParams,
                address_type: "token",
                type: "1D",
            });
            venusLogger.success("fetchDefiPriceHistorical: SUCCESS!");
            await waitFor(500);

            venusLogger.info("fetchDefiPriceHistoricalByUnixTime");
            await birdeyeProvider.fetchDefiPriceHistoricalByUnixTime({
                address: sampleParams.token,
            });
            venusLogger.success("fetchDefiPriceHistoricalByUnixTime: SUCCESS!");
            await waitFor(500);

            venusLogger.info("fetchDefiTradesToken");
            await birdeyeProvider.fetchDefiTradesToken({
                address: sampleParams.token,
            });
            venusLogger.success("fetchDefiTradesToken: SUCCESS!");
            await waitFor(500);

            venusLogger.info("fetchDefiTradesPair");
            await birdeyeProvider.fetchDefiTradesPair({
                address: sampleParams.token,
            });
            venusLogger.success("fetchDefiTradesPair: SUCCESS!");
            await waitFor(500);

            venusLogger.info("fetchDefiTradesTokenSeekByTime");
            await birdeyeProvider.fetchDefiTradesTokenSeekByTime({
                address: sampleParams.token,
                before_time: sampleParams.before_time,
            });
            venusLogger.success("fetchDefiTradesTokenSeekByTime: SUCCESS!");
            await waitFor(500);

            venusLogger.info("fetchDefiTradesPairSeekByTime");
            await birdeyeProvider.fetchDefiTradesPairSeekByTime({
                address: sampleParams.token,
                after_time: sampleParams.after_time,
            });
            venusLogger.success("fetchDefiTradesPairSeekByTime: SUCCESS!");
            await waitFor(500);

            venusLogger.info("fetchDefiOHLCV");
            await birdeyeProvider.fetchDefiOHLCV({
                ...sampleParams,
                type: "1D",
            });
            venusLogger.success("fetchDefiOHLCV: SUCCESS!");
            await waitFor(500);

            venusLogger.info("fetchDefiOHLCVPair");
            await birdeyeProvider.fetchDefiOHLCVPair({
                ...sampleParams,
                type: "1D",
            });
            venusLogger.success("fetchDefiOHLCVPair: SUCCESS!");
            await waitFor(500);

            venusLogger.info("fetchDefiOHLCVBaseQuote");
            await birdeyeProvider.fetchDefiOHLCVBaseQuote({
                ...sampleParams,
                type: "1D",
            });
            venusLogger.success("fetchDefiOHLCVBaseQuote: SUCCESS!");
            await waitFor(500);

            venusLogger.info("fetchDefiPriceVolume");
            await birdeyeProvider.fetchDefiPriceVolume({
                address: sampleParams.token,
            });
            venusLogger.success("fetchDefiPriceVolume: SUCCESS!");
            await waitFor(500);

            // this endpoint is for enterprise users only
            // venusLogger.info("fetchDefiPriceVolumeMulti_POST");
            // await birdeyeProvider.fetchDefiPriceVolumeMulti_POST({
            //     list_address: sampleParams.token,
            // });
            // venusLogger.success("fetchDefiPriceVolumeMulti_POST: SUCCESS!");
            // await waitFor(500);

            venusLogger.info("fetchTokenList");
            await birdeyeProvider.fetchTokenList({
                ...sampleParams,
                sort_by: "mc",
                sort_type: "desc",
            });
            venusLogger.success("fetchTokenList: SUCCESS!");
            await waitFor(500);

            venusLogger.info("fetchTokenSecurityByAddress");
            await birdeyeProvider.fetchTokenSecurityByAddress({
                ...sampleParams,
            });
            venusLogger.success("fetchTokenSecurityByAddress: SUCCESS!");
            await waitFor(500);

            venusLogger.info("fetchTokenOverview");
            await birdeyeProvider.fetchTokenOverview({ ...sampleParams });
            venusLogger.success("fetchTokenOverview: SUCCESS!");
            await waitFor(500);

            venusLogger.info("fetchTokenCreationInfo");
            await birdeyeProvider.fetchTokenCreationInfo({ ...sampleParams });
            venusLogger.success("fetchTokenCreationInfo: SUCCESS!");
            await waitFor(500);

            venusLogger.info("fetchTokenTrending");
            await birdeyeProvider.fetchTokenTrending({
                ...sampleParams,
                sort_by: "volume24hUSD",
                sort_type: "desc",
            });
            venusLogger.success("fetchTokenTrending: SUCCESS!");
            await waitFor(500);

            // this endpoint is for enterprise users only
            // venusLogger.info("fetchTokenListV2_POST");
            // await birdeyeProvider.fetchTokenListV2_POST({});
            // venusLogger.success("fetchTokenListV2_POST: SUCCESS!");
            // await waitFor(500);

            venusLogger.info("fetchTokenNewListing");
            await birdeyeProvider.fetchTokenNewListing({
                time_to: new Date().getTime(),
                meme_platform_enabled: true,
            });
            venusLogger.success("fetchTokenNewListing: SUCCESS!");
            await waitFor(500);

            venusLogger.info("fetchTokenTopTraders");
            await birdeyeProvider.fetchTokenTopTraders({
                ...sampleParams,
                time_frame: "24h",
                sort_type: "asc",
                sort_by: "volume",
            });
            venusLogger.success("fetchTokenTopTraders: SUCCESS!");
            await waitFor(500);

            venusLogger.info("fetchTokenAllMarketsList");
            await birdeyeProvider.fetchTokenAllMarketsList({
                ...sampleParams,
                time_frame: "12H",
                sort_type: "asc",
                sort_by: "volume24h",
            });
            venusLogger.success("fetchTokenAllMarketsList: SUCCESS!");
            await waitFor(500);

            venusLogger.info("fetchTokenMetadataSingle");
            await birdeyeProvider.fetchTokenMetadataSingle({ ...sampleParams });
            venusLogger.success("fetchTokenMetadataSingle: SUCCESS!");
            await waitFor(500);

            // this endpoint is for enterprise users only
            // venusLogger.info("fetchTokenMetadataMulti");
            // await birdeyeProvider.fetchTokenMetadataMulti({ ...sampleParams });
            // venusLogger.success("fetchTokenMetadataMulti: SUCCESS!");
            // await waitFor(500);

            venusLogger.info("fetchTokenMarketData");
            await birdeyeProvider.fetchTokenMarketData({ ...sampleParams });
            venusLogger.success("fetchTokenMarketData: SUCCESS!");
            await waitFor(500);

            venusLogger.info("fetchTokenTradeDataSingle");
            await birdeyeProvider.fetchTokenTradeDataSingle({
                ...sampleParams,
            });
            venusLogger.success("fetchTokenTradeDataSingle: SUCCESS!");
            await waitFor(500);

            // this endpoint is for enterprise users only
            // venusLogger.info("fetchTokenTradeDataMultiple");
            // await birdeyeProvider.fetchTokenTradeDataMultiple({
            //     ...sampleParams,
            // });
            // venusLogger.success("fetchTokenTradeDataMultiple: SUCCESS!");
            // await waitFor(500);

            venusLogger.info("fetchTokenHolders");
            await birdeyeProvider.fetchTokenHolders({ ...sampleParams });
            venusLogger.success("fetchTokenHolders: SUCCESS!");
            await waitFor(500);

            venusLogger.info("fetchTokenMintBurn");
            await birdeyeProvider.fetchTokenMintBurn({
                ...sampleParams,
                sort_by: "block_time",
                sort_type: "desc",
                type: "all",
            });
            venusLogger.success("fetchTokenMintBurn: SUCCESS!");
            await waitFor(500);

            venusLogger.info("fetchWalletSupportedNetworks");
            await birdeyeProvider.fetchWalletSupportedNetworks();
            venusLogger.success("fetchWalletSupportedNetworks: SUCCESS!");
            await waitFor(500);

            venusLogger.info("fetchWalletPortfolio");
            await birdeyeProvider.fetchWalletPortfolio({ ...sampleParams });
            venusLogger.success("fetchWalletPortfolio: SUCCESS!");
            await waitFor(500);

            // venusLogger.info("fetchWalletPortfolioMultichain");
            // await birdeyeProvider.fetchWalletPortfolioMultichain({
            //     ...sampleParams,
            // });
            // venusLogger.success("fetchWalletPortfolioMultichain: SUCCESS!");
            // await waitFor(500);

            venusLogger.info("fetchWalletTokenBalance");
            await birdeyeProvider.fetchWalletTokenBalance({ ...sampleParams });
            venusLogger.success("fetchWalletTokenBalance: SUCCESS!");
            await waitFor(500);

            venusLogger.info("fetchWalletTransactionHistory");
            await birdeyeProvider.fetchWalletTransactionHistory({
                ...sampleParams,
            });
            venusLogger.success("fetchWalletTransactionHistory: SUCCESS!");
            await waitFor(500);

            // venusLogger.info("fetchWalletTransactionHistoryMultichain");
            // await birdeyeProvider.fetchWalletTransactionHistoryMultichain({
            //     ...sampleParams,
            // });
            // venusLogger.success(
            //     "fetchWalletTransactionHistoryMultichain: SUCCESS!"
            // );
            // await waitFor(500);

            venusLogger.info("fetchWalletTransactionSimulate_POST");
            await birdeyeProvider.fetchWalletTransactionSimulate_POST({
                from: sampleParams.token,
                to: sampleParams.token,
                data: JSON.stringify({ test: "ok" }),
                value: "100000",
            });
            venusLogger.success(
                "fetchWalletTransactionSimulate_POST: SUCCESS!"
            );
            await waitFor(500);

            venusLogger.info("fetchTraderGainersLosers");
            await birdeyeProvider.fetchTraderGainersLosers({
                ...sampleParams,
                type: "today",
                sort_type: "asc",
            });
            venusLogger.success("fetchTraderGainersLosers: SUCCESS!");
            await waitFor(500);

            venusLogger.info("fetchTraderTransactionsSeek");
            await birdeyeProvider.fetchTraderTransactionsSeek({
                ...sampleParams,
                tx_type: "all",
                before_time: undefined,
            });
            venusLogger.success("fetchTraderTransactionsSeek: SUCCESS!");
            await waitFor(500);

            venusLogger.info("fetchPairOverviewSingle");
            await birdeyeProvider.fetchPairOverviewSingle({ ...sampleParams });
            venusLogger.success("fetchPairOverviewSingle: SUCCESS!");
            await waitFor(500);

            // this endpoint is for enterprise users only
            // venusLogger.info("fetchMultiPairOverview");
            // await birdeyeProvider.fetchMultiPairOverview({ ...sampleParams });
            // venusLogger.success("fetchMultiPairOverview: SUCCESS!");
            // await waitFor(500);

            // this endpoint is for enterprise users only
            // venusLogger.info("fetchPairOverviewMultiple");
            // await birdeyeProvider.fetchPairOverviewMultiple({
            //     ...sampleParams,
            // });
            // venusLogger.success("fetchPairOverviewMultiple: SUCCESS!");
            // await waitFor(500);

            venusLogger.info("fetchSearchTokenMarketData");
            await birdeyeProvider.fetchSearchTokenMarketData({
                ...sampleParams,
                sort_type: "asc",
            });
            venusLogger.success("fetchSearchTokenMarketData: SUCCESS!");
            await waitFor(500);

            venusLogger.info("All endpoints tested successfully");
            callback?.({ text: "All endpoints tested successfully!" });
            return true;
        } catch (error) {
            console.error("Error in testAllEndpointsAction:", error.message);
            callback?.({ text: `Error: ${error.message}` });
            return false;
        }
    },
    validate: async (_runtime: IAgentRuntime, message: Memory) => {
        // only run if explicitly triggered by user
        return message.content.text.includes("BIRDEYE_TEST_ALL_ENDPOINTS");
    },
    examples: [
        [
            {
                user: "user",
                content: {
                    text: "I want you to BIRDEYE_TEST_ALL_ENDPOINTS",
                    action: "BIRDEYE_TEST_ALL_ENDPOINTS",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
