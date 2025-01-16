import { PGLiteDatabaseAdapter } from "@venusos/adapter-pglite";
import { PostgresDatabaseAdapter } from "@venusos/adapter-postgres";
import { RedisClient } from "@venusos/adapter-redis";
import { SqliteDatabaseAdapter } from "@venusos/adapter-sqlite";
import { SupabaseDatabaseAdapter } from "@venusos/adapter-supabase";
import { AutoClientInterface } from "@venusos/client-auto";
import { DiscordClientInterface } from "@venusos/client-discord";
import { FarcasterClientInterface } from "@venusos/client-farcaster";
import { LensAgentClient } from "@venusos/client-lens";
import { SlackClientInterface } from "@venusos/client-slack";
import { TelegramClientInterface } from "@venusos/client-telegram";
import { TwitterClientInterface } from "@venusos/client-twitter";
// import { ReclaimAdapter } from "@venusos/plugin-reclaim";
import { PrimusAdapter } from "@venusos/plugin-primus";

import {
    AgentRuntime,
    CacheManager,
    CacheStore,
    Character,
    Client,
    Clients,
    DbCacheAdapter,
    defaultCharacter,
    venusLogger,
    FsCacheAdapter,
    IAgentRuntime,
    ICacheManager,
    IDatabaseAdapter,
    IDatabaseCacheAdapter,
    ModelProviderName,
    settings,
    stringToUuid,
    validateCharacterConfig,
    parseBooleanFromText,
} from "@venusos/core";
import { zgPlugin } from "@venusos/plugin-0g";

import { bootstrapPlugin } from "@venusos/plugin-bootstrap";
import createGoatPlugin from "@venusos/plugin-goat";
// import { intifacePlugin } from "@venusos/plugin-intiface";
import { DirectClient } from "@venusos/client-direct";
import { ThreeDGenerationPlugin } from "@venusos/plugin-3d-generation";
import { abstractPlugin } from "@venusos/plugin-abstract";
import { akashPlugin } from "@venusos/plugin-akash";
import { alloraPlugin } from "@venusos/plugin-allora";
import { aptosPlugin } from "@venusos/plugin-aptos";
import { artheraPlugin } from "@venusos/plugin-arthera";
import { autonomePlugin } from "@venusos/plugin-autonome";
import { availPlugin } from "@venusos/plugin-avail";
import { avalanchePlugin } from "@venusos/plugin-avalanche";
import { b2Plugin } from "@venusos/plugin-b2";
import { binancePlugin } from "@venusos/plugin-binance";
import { birdeyePlugin } from "@venusos/plugin-birdeye";
import {
    advancedTradePlugin,
    coinbaseCommercePlugin,
    coinbaseMassPaymentsPlugin,
    tokenContractPlugin,
    tradePlugin,
    webhookPlugin,
} from "@venusos/plugin-coinbase";
import { coingeckoPlugin } from "@venusos/plugin-coingecko";
import { coinmarketcapPlugin } from "@venusos/plugin-coinmarketcap";
import { confluxPlugin } from "@venusos/plugin-conflux";
import { createCosmosPlugin } from "@venusos/plugin-cosmos";
import { cronosZkEVMPlugin } from "@venusos/plugin-cronoszkevm";
import { evmPlugin } from "@venusos/plugin-evm";
import { flowPlugin } from "@venusos/plugin-flow";
import { fuelPlugin } from "@venusos/plugin-fuel";
import { genLayerPlugin } from "@venusos/plugin-genlayer";
import { giphyPlugin } from "@venusos/plugin-giphy";
import { gitcoinPassportPlugin } from "@venusos/plugin-gitcoin-passport";
import { hyperliquidPlugin } from "@venusos/plugin-hyperliquid";
import { imageGenerationPlugin } from "@venusos/plugin-image-generation";
import { lensPlugin } from "@venusos/plugin-lensNetwork";
import { letzAIPlugin } from "@venusos/plugin-letzai";
import { multiversxPlugin } from "@venusos/plugin-multiversx";
import { nearPlugin } from "@venusos/plugin-near";
import createNFTCollectionsPlugin from "@venusos/plugin-nft-collections";
import { nftGenerationPlugin } from "@venusos/plugin-nft-generation";
import { createNodePlugin } from "@venusos/plugin-node";
import { obsidianPlugin } from "@venusos/plugin-obsidian";
import { OpacityAdapter } from "@venusos/plugin-opacity";
import { openWeatherPlugin } from "@venusos/plugin-open-weather";
import { quaiPlugin } from "@venusos/plugin-quai";
import { sgxPlugin } from "@venusos/plugin-sgx";
import { solanaPlugin } from "@venusos/plugin-solana";
import { solanaAgentkitPlguin } from "@venusos/plugin-solana-agentkit";
import { stargazePlugin } from "@venusos/plugin-stargaze";
import { storyPlugin } from "@venusos/plugin-story";
import { suiPlugin } from "@venusos/plugin-sui";
import { TEEMode, teePlugin } from "@venusos/plugin-tee";
import { teeLogPlugin } from "@venusos/plugin-tee-log";
import { teeMarlinPlugin } from "@venusos/plugin-tee-marlin";
import { verifiableLogPlugin } from "@venusos/plugin-tee-verifiable-log";
import { thirdwebPlugin } from "@venusos/plugin-thirdweb";
import { tonPlugin } from "@venusos/plugin-ton";
import { squidRouterPlugin } from "@venusos/plugin-squid-router";
import { webSearchPlugin } from "@venusos/plugin-web-search";
import { echoChambersPlugin } from "@venusos/plugin-echochambers";
import { dexScreenerPlugin } from "@venusos/plugin-dexscreener";

import { zksyncEraPlugin } from "@venusos/plugin-zksync-era";
import Database from "better-sqlite3";
import fs from "fs";
import net from "net";
import path from "path";
import { fileURLToPath } from "url";
import yargs from "yargs";


const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

export const wait = (minTime: number = 1000, maxTime: number = 3000) => {
    const waitTime =
        Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
    return new Promise((resolve) => setTimeout(resolve, waitTime));
};

const logFetch = async (url: string, options: any) => {
    venusLogger.debug(`Fetching ${url}`);
    // Disabled to avoid disclosure of sensitive information such as API keys
    // venusLogger.debug(JSON.stringify(options, null, 2));
    return fetch(url, options);
};

export function parseArguments(): {
    character?: string;
    characters?: string;
} {
    try {
        return yargs(process.argv.slice(3))
            .option("character", {
                type: "string",
                description: "Path to the character JSON file",
            })
            .option("characters", {
                type: "string",
                description:
                    "Comma separated list of paths to character JSON files",
            })
            .parseSync();
    } catch (error) {
        venusLogger.error("Error parsing arguments:", error);
        return {};
    }
}

function tryLoadFile(filePath: string): string | null {
    try {
        return fs.readFileSync(filePath, "utf8");
    } catch (e) {
        return null;
    }
}
function mergeCharacters(base: Character, child: Character): Character {
    const mergeObjects = (baseObj: any, childObj: any) => {
        const result: any = {};
        const keys = new Set([
            ...Object.keys(baseObj || {}),
            ...Object.keys(childObj || {}),
        ]);
        keys.forEach((key) => {
            if (
                typeof baseObj[key] === "object" &&
                typeof childObj[key] === "object" &&
                !Array.isArray(baseObj[key]) &&
                !Array.isArray(childObj[key])
            ) {
                result[key] = mergeObjects(baseObj[key], childObj[key]);
            } else if (
                Array.isArray(baseObj[key]) ||
                Array.isArray(childObj[key])
            ) {
                result[key] = [
                    ...(baseObj[key] || []),
                    ...(childObj[key] || []),
                ];
            } else {
                result[key] =
                    childObj[key] !== undefined ? childObj[key] : baseObj[key];
            }
        });
        return result;
    };
    return mergeObjects(base, child);
}

async function loadCharacterFromUrl(url: string): Promise<Character> {
    const response = await fetch(url);
    const character = await response.json();
    return jsonToCharacter(url, character);
}

async function jsonToCharacter(
    filePath: string,
    character: any
): Promise<Character> {
    validateCharacterConfig(character);

    // .id isn't really valid
    const characterId = character.id || character.name;
    const characterPrefix = `CHARACTER.${characterId.toUpperCase().replace(/ /g, "_")}.`;
    const characterSettings = Object.entries(process.env)
        .filter(([key]) => key.startsWith(characterPrefix))
        .reduce((settings, [key, value]) => {
            const settingKey = key.slice(characterPrefix.length);
            return { ...settings, [settingKey]: value };
        }, {});
    if (Object.keys(characterSettings).length > 0) {
        character.settings = character.settings || {};
        character.settings.secrets = {
            ...characterSettings,
            ...character.settings.secrets,
        };
    }
    // Handle plugins
    character.plugins = await handlePluginImporting(character.plugins);
    if (character.extends) {
        venusLogger.info(
            `Merging  ${character.name} character with parent characters`
        );
        for (const extendPath of character.extends) {
            const baseCharacter = await loadCharacter(
                path.resolve(path.dirname(filePath), extendPath)
            );
            character = mergeCharacters(baseCharacter, character);
            venusLogger.info(
                `Merged ${character.name} with ${baseCharacter.name}`
            );
        }
    }
    return character;
}

async function loadCharacter(filePath: string): Promise<Character> {
    const content = tryLoadFile(filePath);
    if (!content) {
        throw new Error(`Character file not found: ${filePath}`);
    }
    let character = JSON.parse(content);
    return jsonToCharacter(filePath, character);
}

export async function loadCharacters(
    charactersArg: string
): Promise<Character[]> {
    let characterPaths = charactersArg
        ?.split(",")
        .map((filePath) => filePath.trim());
    const loadedCharacters: Character[] = [];

    if (characterPaths?.length > 0) {
        for (const characterPath of characterPaths) {
            let content: string | null = null;
            let resolvedPath = "";

            // Try different path resolutions in order
            const pathsToTry = [
                characterPath, // exact path as specified
                path.resolve(process.cwd(), characterPath), // relative to cwd
                path.resolve(process.cwd(), "agent", characterPath), // Add this
                path.resolve(__dirname, characterPath), // relative to current script
                path.resolve(
                    __dirname,
                    "characters",
                    path.basename(characterPath)
                ), // relative to agent/characters
                path.resolve(
                    __dirname,
                    "../characters",
                    path.basename(characterPath)
                ), // relative to characters dir from agent
                path.resolve(
                    __dirname,
                    "../../characters",
                    path.basename(characterPath)
                ), // relative to project root characters dir
            ];

            venusLogger.info(
                "Trying paths:",
                pathsToTry.map((p) => ({
                    path: p,
                    exists: fs.existsSync(p),
                }))
            );

            for (const tryPath of pathsToTry) {
                content = tryLoadFile(tryPath);
                if (content !== null) {
                    resolvedPath = tryPath;
                    break;
                }
            }

            if (content === null) {
                venusLogger.error(
                    `Error loading character from ${characterPath}: File not found in any of the expected locations`
                );
                venusLogger.error("Tried the following paths:");
                pathsToTry.forEach((p) => venusLogger.error(` - ${p}`));
                process.exit(1);
            }

            try {
                const character: Character = await loadCharacter(resolvedPath);

                loadedCharacters.push(character);
                venusLogger.info(
                    `Successfully loaded character from: ${resolvedPath}`
                );
            } catch (e) {
                venusLogger.error(
                    `Error parsing character from ${resolvedPath}: ${e}`
                );
                process.exit(1);
            }
        }
    }

    if (loadedCharacters.length === 0) {
        if (
            process.env.REMOTE_CHARACTER_URL != "" &&
            process.env.REMOTE_CHARACTER_URL.startsWith("http")
        ) {
            const character = await loadCharacterFromUrl(
                process.env.REMOTE_CHARACTER_URL
            );
            loadedCharacters.push(character);
        }

        venusLogger.info("No characters found, using default character");
        loadedCharacters.push(defaultCharacter);
    }

    return loadedCharacters;
}

async function handlePluginImporting(plugins: string[]) {
    if (plugins.length > 0) {
        venusLogger.info("Plugins are: ", plugins);
        const importedPlugins = await Promise.all(
            plugins.map(async (plugin) => {
                try {
                    const importedPlugin = await import(plugin);
                    const functionName =
                        plugin
                            .replace("@venusos/plugin-", "")
                            .replace(/-./g, (x) => x[1].toUpperCase()) +
                        "Plugin"; // Assumes plugin function is camelCased with Plugin suffix
                    return (
                        importedPlugin.default || importedPlugin[functionName]
                    );
                } catch (importError) {
                    venusLogger.error(
                        `Failed to import plugin: ${plugin}`,
                        importError
                    );
                    return []; // Return null for failed imports
                }
            })
        );
        return importedPlugins;
    } else {
        return [];
    }
}

export function getTokenForProvider(
    provider: ModelProviderName,
    character: Character
): string | undefined {
    switch (provider) {
        // no key needed for llama_local or gaianet
        case ModelProviderName.LLAMALOCAL:
            return "";
        case ModelProviderName.OLLAMA:
            return "";
        case ModelProviderName.GAIANET:
            return "";
        case ModelProviderName.OPENAI:
            return (
                character.settings?.secrets?.OPENAI_API_KEY ||
                settings.OPENAI_API_KEY
            );
        case ModelProviderName.ETERNALAI:
            return (
                character.settings?.secrets?.ETERNALAI_API_KEY ||
                settings.ETERNALAI_API_KEY
            );
        case ModelProviderName.NINETEEN_AI:
            return (
                character.settings?.secrets?.NINETEEN_AI_API_KEY ||
                settings.NINETEEN_AI_API_KEY
            );
        case ModelProviderName.LLAMACLOUD:
        case ModelProviderName.TOGETHER:
            return (
                character.settings?.secrets?.LLAMACLOUD_API_KEY ||
                settings.LLAMACLOUD_API_KEY ||
                character.settings?.secrets?.TOGETHER_API_KEY ||
                settings.TOGETHER_API_KEY ||
                character.settings?.secrets?.OPENAI_API_KEY ||
                settings.OPENAI_API_KEY
            );
        case ModelProviderName.CLAUDE_VERTEX:
        case ModelProviderName.ANTHROPIC:
            return (
                character.settings?.secrets?.ANTHROPIC_API_KEY ||
                character.settings?.secrets?.CLAUDE_API_KEY ||
                settings.ANTHROPIC_API_KEY ||
                settings.CLAUDE_API_KEY
            );
        case ModelProviderName.REDPILL:
            return (
                character.settings?.secrets?.REDPILL_API_KEY ||
                settings.REDPILL_API_KEY
            );
        case ModelProviderName.OPENROUTER:
            return (
                character.settings?.secrets?.OPENROUTER_API_KEY ||
                settings.OPENROUTER_API_KEY
            );
        case ModelProviderName.GROK:
            return (
                character.settings?.secrets?.GROK_API_KEY ||
                settings.GROK_API_KEY
            );
        case ModelProviderName.HEURIST:
            return (
                character.settings?.secrets?.HEURIST_API_KEY ||
                settings.HEURIST_API_KEY
            );
        case ModelProviderName.GROQ:
            return (
                character.settings?.secrets?.GROQ_API_KEY ||
                settings.GROQ_API_KEY
            );
        case ModelProviderName.GALADRIEL:
            return (
                character.settings?.secrets?.GALADRIEL_API_KEY ||
                settings.GALADRIEL_API_KEY
            );
        case ModelProviderName.FAL:
            return (
                character.settings?.secrets?.FAL_API_KEY || settings.FAL_API_KEY
            );
        case ModelProviderName.ALI_BAILIAN:
            return (
                character.settings?.secrets?.ALI_BAILIAN_API_KEY ||
                settings.ALI_BAILIAN_API_KEY
            );
        case ModelProviderName.VOLENGINE:
            return (
                character.settings?.secrets?.VOLENGINE_API_KEY ||
                settings.VOLENGINE_API_KEY
            );
        case ModelProviderName.NANOGPT:
            return (
                character.settings?.secrets?.NANOGPT_API_KEY ||
                settings.NANOGPT_API_KEY
            );
        case ModelProviderName.HYPERBOLIC:
            return (
                character.settings?.secrets?.HYPERBOLIC_API_KEY ||
                settings.HYPERBOLIC_API_KEY
            );
        case ModelProviderName.VENICE:
            return (
                character.settings?.secrets?.VENICE_API_KEY ||
                settings.VENICE_API_KEY
            );
        case ModelProviderName.AKASH_CHAT_API:
            return (
                character.settings?.secrets?.AKASH_CHAT_API_KEY ||
                settings.AKASH_CHAT_API_KEY
            );
        case ModelProviderName.GOOGLE:
            return (
                character.settings?.secrets?.GOOGLE_GENERATIVE_AI_API_KEY ||
                settings.GOOGLE_GENERATIVE_AI_API_KEY
            );
        case ModelProviderName.MISTRAL:
            return (
                character.settings?.secrets?.MISTRAL_API_KEY ||
                settings.MISTRAL_API_KEY
            );
        case ModelProviderName.LETZAI:
            return (
                character.settings?.secrets?.LETZAI_API_KEY ||
                settings.LETZAI_API_KEY
            );
        case ModelProviderName.INFERA:
            return (
                character.settings?.secrets?.INFERA_API_KEY ||
                settings.INFERA_API_KEY
            );
        case ModelProviderName.DEEPSEEK:
            return (
                character.settings?.secrets?.DEEPSEEK_API_KEY ||
                settings.DEEPSEEK_API_KEY
            );
        default:
            const errorMessage = `Failed to get token - unsupported model provider: ${provider}`;
            venusLogger.error(errorMessage);
            throw new Error(errorMessage);
    }
}

function initializeDatabase(dataDir: string) {
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
        venusLogger.info("Initializing Supabase connection...");
        const db = new SupabaseDatabaseAdapter(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_ANON_KEY
        );

        // Test the connection
        db.init()
            .then(() => {
                venusLogger.success(
                    "Successfully connected to Supabase database"
                );
            })
            .catch((error) => {
                venusLogger.error("Failed to connect to Supabase:", error);
            });

        return db;
    } else if (process.env.POSTGRES_URL) {
        venusLogger.info("Initializing PostgreSQL connection...");
        const db = new PostgresDatabaseAdapter({
            connectionString: process.env.POSTGRES_URL,
            parseInputs: true,
        });

        // Test the connection
        db.init()
            .then(() => {
                venusLogger.success(
                    "Successfully connected to PostgreSQL database"
                );
            })
            .catch((error) => {
                venusLogger.error("Failed to connect to PostgreSQL:", error);
            });

        return db;
    } else if (process.env.PGLITE_DATA_DIR) {
        venusLogger.info("Initializing PgLite adapter...");
        // `dataDir: memory://` for in memory pg
        const db = new PGLiteDatabaseAdapter({
            dataDir: process.env.PGLITE_DATA_DIR,
        });
        return db;
    } else {
        const filePath =
            process.env.SQLITE_FILE ?? path.resolve(dataDir, "db.sqlite");
        venusLogger.info(`Initializing SQLite database at ${filePath}...`);
        const db = new SqliteDatabaseAdapter(new Database(filePath));

        // Test the connection
        db.init()
            .then(() => {
                venusLogger.success(
                    "Successfully connected to SQLite database"
                );
            })
            .catch((error) => {
                venusLogger.error("Failed to connect to SQLite:", error);
            });

        return db;
    }
}

// also adds plugins from character file into the runtime
export async function initializeClients(
    character: Character,
    runtime: IAgentRuntime
) {
    // each client can only register once
    // and if we want two we can explicitly support it
    const clients: Record<string, any> = {};
    const clientTypes: string[] =
        character.clients?.map((str) => str.toLowerCase()) || [];
    venusLogger.log("initializeClients", clientTypes, "for", character.name);

    // Start Auto Client if "auto" detected as a configured client
    if (clientTypes.includes(Clients.AUTO)) {
        const autoClient = await AutoClientInterface.start(runtime);
        if (autoClient) clients.auto = autoClient;
    }

    if (clientTypes.includes(Clients.DISCORD)) {
        const discordClient = await DiscordClientInterface.start(runtime);
        if (discordClient) clients.discord = discordClient;
    }

    if (clientTypes.includes(Clients.TELEGRAM)) {
        const telegramClient = await TelegramClientInterface.start(runtime);
        if (telegramClient) clients.telegram = telegramClient;
    }

    if (clientTypes.includes(Clients.TWITTER)) {
        const twitterClient = await TwitterClientInterface.start(runtime);
        if (twitterClient) {
            clients.twitter = twitterClient;
        }
    }

    if (clientTypes.includes(Clients.FARCASTER)) {
        const farcasterClient = await FarcasterClientInterface.start(runtime);
        if (farcasterClient) {
            clients.farcaster = farcasterClient;
        }
    }
    if (clientTypes.includes("lens")) {
        const lensClient = new LensAgentClient(runtime);
        lensClient.start();
        clients.lens = lensClient;
    }

    venusLogger.log("client keys", Object.keys(clients));

    // TODO: Add Slack client to the list
    // Initialize clients as an object

    if (clientTypes.includes("slack")) {
        const slackClient = await SlackClientInterface.start(runtime);
        if (slackClient) clients.slack = slackClient; // Use object property instead of push
    }

    function determineClientType(client: Client): string {
        // Check if client has a direct type identifier
        if ("type" in client) {
            return (client as any).type;
        }

        // Check constructor name
        const constructorName = client.constructor?.name;
        if (constructorName && !constructorName.includes("Object")) {
            return constructorName.toLowerCase().replace("client", "");
        }

        // Fallback: Generate a unique identifier
        return `client_${Date.now()}`;
    }

    if (character.plugins?.length > 0) {
        for (const plugin of character.plugins) {
            if (plugin.clients) {
                for (const client of plugin.clients) {
                    const startedClient = await client.start(runtime);
                    const clientType = determineClientType(client);
                    venusLogger.debug(
                        `Initializing client of type: ${clientType}`
                    );
                    clients[clientType] = startedClient;
                }
            }
        }
    }

    return clients;
}

function getSecret(character: Character, secret: string) {
    return character.settings?.secrets?.[secret] || process.env[secret];
}

let nodePlugin: any | undefined;

export async function createAgent(
    character: Character,
    db: IDatabaseAdapter,
    cache: ICacheManager,
    token: string
): Promise<AgentRuntime> {
    venusLogger.log(`Creating runtime for character ${character.name}`);

    nodePlugin ??= createNodePlugin();

    const teeMode = getSecret(character, "TEE_MODE") || "OFF";
    const walletSecretSalt = getSecret(character, "WALLET_SECRET_SALT");

    // Validate TEE configuration
    if (teeMode !== TEEMode.OFF && !walletSecretSalt) {
        venusLogger.error(
            "WALLET_SECRET_SALT required when TEE_MODE is enabled"
        );
        throw new Error("Invalid TEE configuration");
    }

    let goatPlugin: any | undefined;

    if (getSecret(character, "EVM_PRIVATE_KEY")) {
        goatPlugin = await createGoatPlugin((secret) =>
            getSecret(character, secret)
        );
    }

    // Initialize Reclaim adapter if environment variables are present
    // let verifiableInferenceAdapter;
    // if (
    //     process.env.RECLAIM_APP_ID &&
    //     process.env.RECLAIM_APP_SECRET &&
    //     process.env.VERIFIABLE_INFERENCE_ENABLED === "true"
    // ) {
    //     verifiableInferenceAdapter = new ReclaimAdapter({
    //         appId: process.env.RECLAIM_APP_ID,
    //         appSecret: process.env.RECLAIM_APP_SECRET,
    //         modelProvider: character.modelProvider,
    //         token,
    //     });
    //     venusLogger.log("Verifiable inference adapter initialized");
    // }
    // Initialize Opacity adapter if environment variables are present
    let verifiableInferenceAdapter;
    if (
        process.env.OPACITY_TEAM_ID &&
        process.env.OPACITY_CLOUDFLARE_NAME &&
        process.env.OPACITY_PROVER_URL &&
        process.env.VERIFIABLE_INFERENCE_ENABLED === "true"
    ) {
        verifiableInferenceAdapter = new OpacityAdapter({
            teamId: process.env.OPACITY_TEAM_ID,
            teamName: process.env.OPACITY_CLOUDFLARE_NAME,
            opacityProverUrl: process.env.OPACITY_PROVER_URL,
            modelProvider: character.modelProvider,
            token: token,
        });
        venusLogger.log("Verifiable inference adapter initialized");
        venusLogger.log("teamId", process.env.OPACITY_TEAM_ID);
        venusLogger.log("teamName", process.env.OPACITY_CLOUDFLARE_NAME);
        venusLogger.log("opacityProverUrl", process.env.OPACITY_PROVER_URL);
        venusLogger.log("modelProvider", character.modelProvider);
        venusLogger.log("token", token);
    }
    if (
        process.env.PRIMUS_APP_ID &&
        process.env.PRIMUS_APP_SECRET &&
        process.env.VERIFIABLE_INFERENCE_ENABLED === "true"
    ) {
        verifiableInferenceAdapter = new PrimusAdapter({
            appId: process.env.PRIMUS_APP_ID,
            appSecret: process.env.PRIMUS_APP_SECRET,
            attMode: "proxytls",
            modelProvider: character.modelProvider,
            token,
        });
        venusLogger.log("Verifiable inference primus adapter initialized");
    }

    return new AgentRuntime({
        databaseAdapter: db,
        token,
        modelProvider: character.modelProvider,
        evaluators: [],
        character,
        // character.plugins are handled when clients are added
        plugins: [
            bootstrapPlugin,
            getSecret(character, "DEXSCREENER_API_KEY")
                ? dexScreenerPlugin
                : null,
            getSecret(character, "CONFLUX_CORE_PRIVATE_KEY")
                ? confluxPlugin
                : null,
            nodePlugin,
            getSecret(character, "TAVILY_API_KEY") ? webSearchPlugin : null,
            getSecret(character, "SOLANA_PUBLIC_KEY") ||
            (getSecret(character, "WALLET_PUBLIC_KEY") &&
                !getSecret(character, "WALLET_PUBLIC_KEY")?.startsWith("0x"))
                ? solanaPlugin
                : null,
            getSecret(character, "SOLANA_PRIVATE_KEY")
                ? solanaAgentkitPlguin
                : null,
            getSecret(character, "AUTONOME_JWT_TOKEN") ? autonomePlugin : null,
            (getSecret(character, "NEAR_ADDRESS") ||
                getSecret(character, "NEAR_WALLET_PUBLIC_KEY")) &&
            getSecret(character, "NEAR_WALLET_SECRET_KEY")
                ? nearPlugin
                : null,
            getSecret(character, "EVM_PUBLIC_KEY") ||
            (getSecret(character, "WALLET_PUBLIC_KEY") &&
                getSecret(character, "WALLET_PUBLIC_KEY")?.startsWith("0x"))
                ? evmPlugin
                : null,
            getSecret(character, "COSMOS_RECOVERY_PHRASE") &&
                getSecret(character, "COSMOS_AVAILABLE_CHAINS") &&
                createCosmosPlugin(),
            (getSecret(character, "SOLANA_PUBLIC_KEY") ||
                (getSecret(character, "WALLET_PUBLIC_KEY") &&
                    !getSecret(character, "WALLET_PUBLIC_KEY")?.startsWith(
                        "0x"
                    ))) &&
            getSecret(character, "SOLANA_ADMIN_PUBLIC_KEY") &&
            getSecret(character, "SOLANA_PRIVATE_KEY") &&
            getSecret(character, "SOLANA_ADMIN_PRIVATE_KEY")
                ? nftGenerationPlugin
                : null,
            getSecret(character, "ZEROG_PRIVATE_KEY") ? zgPlugin : null,
            getSecret(character, "COINMARKETCAP_API_KEY")
                ? coinmarketcapPlugin
                : null,
            getSecret(character, "COINBASE_COMMERCE_KEY")
                ? coinbaseCommercePlugin
                : null,
            getSecret(character, "FAL_API_KEY") ||
            getSecret(character, "OPENAI_API_KEY") ||
            getSecret(character, "VENICE_API_KEY") ||
            getSecret(character, "NINETEEN_AI_API_KEY") ||
            getSecret(character, "HEURIST_API_KEY") ||
            getSecret(character, "LIVEPEER_GATEWAY_URL")
                ? imageGenerationPlugin
                : null,
            getSecret(character, "FAL_API_KEY") ? ThreeDGenerationPlugin : null,
            ...(getSecret(character, "COINBASE_API_KEY") &&
            getSecret(character, "COINBASE_PRIVATE_KEY")
                ? [
                      coinbaseMassPaymentsPlugin,
                      tradePlugin,
                      tokenContractPlugin,
                      advancedTradePlugin,
                  ]
                : []),
            ...(teeMode !== TEEMode.OFF && walletSecretSalt ? [teePlugin] : []),
            teeMode !== TEEMode.OFF &&
            walletSecretSalt &&
            getSecret(character, "VLOG")
                ? verifiableLogPlugin
                : null,
            getSecret(character, "SGX") ? sgxPlugin : null,
            getSecret(character, "ENABLE_TEE_LOG") &&
            ((teeMode !== TEEMode.OFF && walletSecretSalt) ||
                getSecret(character, "SGX"))
                ? teeLogPlugin
                : null,
            getSecret(character, "COINBASE_API_KEY") &&
            getSecret(character, "COINBASE_PRIVATE_KEY") &&
            getSecret(character, "COINBASE_NOTIFICATION_URI")
                ? webhookPlugin
                : null,
            goatPlugin,
            getSecret(character, "COINGECKO_API_KEY") ||
            getSecret(character, "COINGECKO_PRO_API_KEY")
                ? coingeckoPlugin
                : null,
            getSecret(character, "EVM_PROVIDER_URL") ? goatPlugin : null,
            getSecret(character, "ABSTRACT_PRIVATE_KEY")
                ? abstractPlugin
                : null,
            getSecret(character, "B2_PRIVATE_KEY") ? b2Plugin : null,
            getSecret(character, "BINANCE_API_KEY") &&
            getSecret(character, "BINANCE_SECRET_KEY")
                ? binancePlugin
                : null,
            getSecret(character, "FLOW_ADDRESS") &&
            getSecret(character, "FLOW_PRIVATE_KEY")
                ? flowPlugin
                : null,
            getSecret(character, "LENS_ADDRESS") &&
            getSecret(character, "LENS_PRIVATE_KEY")
                ? lensPlugin
                : null,
            getSecret(character, "APTOS_PRIVATE_KEY") ? aptosPlugin : null,
            getSecret(character, "MVX_PRIVATE_KEY") ? multiversxPlugin : null,
            getSecret(character, "ZKSYNC_PRIVATE_KEY") ? zksyncEraPlugin : null,
            getSecret(character, "CRONOSZKEVM_PRIVATE_KEY")
                ? cronosZkEVMPlugin
                : null,
            getSecret(character, "TEE_MARLIN") ? teeMarlinPlugin : null,
            getSecret(character, "TON_PRIVATE_KEY") ? tonPlugin : null,
            getSecret(character, "THIRDWEB_SECRET_KEY") ? thirdwebPlugin : null,
            getSecret(character, "SUI_PRIVATE_KEY") ? suiPlugin : null,
            getSecret(character, "STORY_PRIVATE_KEY") ? storyPlugin : null,
            getSecret(character, "SQUID_SDK_URL") &&
            getSecret(character, "SQUID_INTEGRATOR_ID") &&
            getSecret(character, "SQUID_EVM_ADDRESS") &&
            getSecret(character, "SQUID_EVM_PRIVATE_KEY") &&
            getSecret(character, "SQUID_API_THROTTLE_INTERVAL")
                ? squidRouterPlugin
                : null,
            getSecret(character, "FUEL_PRIVATE_KEY") ? fuelPlugin : null,
            getSecret(character, "AVALANCHE_PRIVATE_KEY")
                ? avalanchePlugin
                : null,
            getSecret(character, "BIRDEYE_API_KEY") ? birdeyePlugin : null,
            getSecret(character, "ECHOCHAMBERS_API_URL") &&
            getSecret(character, "ECHOCHAMBERS_API_KEY")
                ? echoChambersPlugin
                : null,
            getSecret(character, "LETZAI_API_KEY") ? letzAIPlugin : null,
            getSecret(character, "STARGAZE_ENDPOINT") ? stargazePlugin : null,
            getSecret(character, "GIPHY_API_KEY") ? giphyPlugin : null,
            getSecret(character, "PASSPORT_API_KEY")
                ? gitcoinPassportPlugin
                : null,
            getSecret(character, "GENLAYER_PRIVATE_KEY")
                ? genLayerPlugin
                : null,
            getSecret(character, "AVAIL_SEED") &&
            getSecret(character, "AVAIL_APP_ID")
                ? availPlugin
                : null,
            getSecret(character, "OPEN_WEATHER_API_KEY")
                ? openWeatherPlugin
                : null,
            getSecret(character, "OBSIDIAN_API_TOKEN") ? obsidianPlugin : null,
            getSecret(character, "ARTHERA_PRIVATE_KEY")?.startsWith("0x")
                ? artheraPlugin
                : null,
            getSecret(character, "ALLORA_API_KEY") ? alloraPlugin : null,
            getSecret(character, "HYPERLIQUID_PRIVATE_KEY")
                ? hyperliquidPlugin
                : null,
            getSecret(character, "HYPERLIQUID_TESTNET")
                ? hyperliquidPlugin
                : null,
            getSecret(character, "AKASH_MNEMONIC") &&
            getSecret(character, "AKASH_WALLET_ADDRESS")
                ? akashPlugin
                : null,
            getSecret(character, "QUAI_PRIVATE_KEY") ? quaiPlugin : null,
            getSecret(character, "RESERVOIR_API_KEY")
                ? createNFTCollectionsPlugin()
                : null,
        ].filter(Boolean),
        providers: [],
        actions: [],
        services: [],
        managers: [],
        cacheManager: cache,
        fetch: logFetch,
        verifiableInferenceAdapter,
    });
}

function initializeFsCache(baseDir: string, character: Character) {
    if (!character?.id) {
        throw new Error(
            "initializeFsCache requires id to be set in character definition"
        );
    }
    const cacheDir = path.resolve(baseDir, character.id, "cache");

    const cache = new CacheManager(new FsCacheAdapter(cacheDir));
    return cache;
}

function initializeDbCache(character: Character, db: IDatabaseCacheAdapter) {
    if (!character?.id) {
        throw new Error(
            "initializeFsCache requires id to be set in character definition"
        );
    }
    const cache = new CacheManager(new DbCacheAdapter(db, character.id));
    return cache;
}

function initializeCache(
    cacheStore: string,
    character: Character,
    baseDir?: string,
    db?: IDatabaseCacheAdapter
) {
    switch (cacheStore) {
        case CacheStore.REDIS:
            if (process.env.REDIS_URL) {
                venusLogger.info("Connecting to Redis...");
                const redisClient = new RedisClient(process.env.REDIS_URL);
                if (!character?.id) {
                    throw new Error(
                        "CacheStore.REDIS requires id to be set in character definition"
                    );
                }
                return new CacheManager(
                    new DbCacheAdapter(redisClient, character.id) // Using DbCacheAdapter since RedisClient also implements IDatabaseCacheAdapter
                );
            } else {
                throw new Error("REDIS_URL environment variable is not set.");
            }

        case CacheStore.DATABASE:
            if (db) {
                venusLogger.info("Using Database Cache...");
                return initializeDbCache(character, db);
            } else {
                throw new Error(
                    "Database adapter is not provided for CacheStore.Database."
                );
            }

        case CacheStore.FILESYSTEM:
            venusLogger.info("Using File System Cache...");
            if (!baseDir) {
                throw new Error(
                    "baseDir must be provided for CacheStore.FILESYSTEM."
                );
            }
            return initializeFsCache(baseDir, character);

        default:
            throw new Error(
                `Invalid cache store: ${cacheStore} or required configuration missing.`
            );
    }
}

async function startAgent(
    character: Character,
    directClient: DirectClient
): Promise<AgentRuntime> {
    let db: IDatabaseAdapter & IDatabaseCacheAdapter;
    try {
        character.id ??= stringToUuid(character.name);
        character.username ??= character.name;

        const token = getTokenForProvider(character.modelProvider, character);
        const dataDir = path.join(__dirname, "../data");

        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        db = initializeDatabase(dataDir) as IDatabaseAdapter &
            IDatabaseCacheAdapter;

        await db.init();

        const cache = initializeCache(
            process.env.CACHE_STORE ?? CacheStore.DATABASE,
            character,
            "",
            db
        ); // "" should be replaced with dir for file system caching. THOUGHTS: might probably make this into an env
        const runtime: AgentRuntime = await createAgent(
            character,
            db,
            cache,
            token
        );

        // start services/plugins/process knowledge
        await runtime.initialize();

        // start assigned clients
        runtime.clients = await initializeClients(character, runtime);

        // add to container
        directClient.registerAgent(runtime);

        // report to console
        venusLogger.debug(`Started ${character.name} as ${runtime.agentId}`);

        return runtime;
    } catch (error) {
        venusLogger.error(
            `Error starting agent for character ${character.name}:`,
            error
        );
        venusLogger.error(error);
        if (db) {
            await db.close();
        }
        throw error;
    }
}

const checkPortAvailable = (port: number): Promise<boolean> => {
    return new Promise((resolve) => {
        const server = net.createServer();

        server.once("error", (err: NodeJS.ErrnoException) => {
            if (err.code === "EADDRINUSE") {
                resolve(false);
            }
        });

        server.once("listening", () => {
            server.close();
            resolve(true);
        });

        server.listen(port);
    });
};

const startAgents = async () => {
    const directClient = new DirectClient();
    let serverPort = parseInt(settings.SERVER_PORT || "3000");
    const args = parseArguments();
    let charactersArg = args.characters || args.character;
    let characters = [defaultCharacter];

    if (charactersArg) {
        characters = await loadCharacters(charactersArg);
    }

    try {
        for (const character of characters) {
            await startAgent(character, directClient);
        }
    } catch (error) {
        venusLogger.error("Error starting agents:", error);
    }

    // Find available port
    while (!(await checkPortAvailable(serverPort))) {
        venusLogger.warn(
            `Port ${serverPort} is in use, trying ${serverPort + 1}`
        );
        serverPort++;
    }

    // upload some agent functionality into directClient
    directClient.startAgent = async (character) => {
        // Handle plugins
        character.plugins = await handlePluginImporting(character.plugins);

        // wrap it so we don't have to inject directClient later
        return startAgent(character, directClient);
    };

    directClient.start(serverPort);

    if (serverPort !== parseInt(settings.SERVER_PORT || "3000")) {
        venusLogger.log(`Server started on alternate port ${serverPort}`);
    }

    venusLogger.log(
        "Run `pnpm start:client` to start the client and visit the outputted URL (http://localhost:5173) to chat with your agents. When running multiple agents, use client with different port `SERVER_PORT=3001 pnpm start:client`"
    );
};

startAgents().catch((error) => {
    venusLogger.error("Unhandled error in startAgents:", error);
    process.exit(1);
});

// Prevent unhandled exceptions from crashing the process if desired
if (
    process.env.PREVENT_UNHANDLED_EXIT &&
    parseBooleanFromText(process.env.PREVENT_UNHANDLED_EXIT)
) {
    // Handle uncaught exceptions to prevent the process from crashing
    process.on("uncaughtException", function (err) {
        console.error("uncaughtException", err);
    });

    // Handle unhandled rejections to prevent the process from crashing
    process.on("unhandledRejection", function (err) {
        console.error("unhandledRejection", err);
    });
}