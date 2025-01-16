import {
    Service,
    ServiceType,
    IAgentRuntime,
    // Memory,
    // State,
    venusLogger,
    // stringToUuid,
} from "@venusos/core";
// import { sampleProvider } from "../providers/sampleProvider"; // TODO: Uncomment this line to use the sampleProvider

// Add SAMPLE to ServiceType enum in types.ts
declare module "@venusos/core" {
    export enum ServiceType {
        SAMPLE = "sample",
    }
}

// The SampleService is a simple service that logs "Hello world" every 15 minutes.
export class SampleService extends Service {
    private runtime: IAgentRuntime | null = null;
    private intervalId: NodeJS.Timeout | null = null;
    private readonly DEFAULT_INTERVAL = 15 * 60 * 1000; // 15 minutes in milliseconds

    static get serviceType(): ServiceType {
        return ServiceType.SAMPLE;
    }

    private static isInitialized = false;

    async initialize(runtime: IAgentRuntime): Promise<void> {
        // Verify if the service is already initialized
        if (SampleService.isInitialized) {
            return;
        }

        this.runtime = runtime;

        // Start the periodic task
        this.startPeriodicTask();
        SampleService.isInitialized = true;
        venusLogger.info("SampleService initialized and started periodic task");
    }

    private static activeTaskCount = 0;

    private startPeriodicTask(): void {
        // Verify if a task is already active
        if (SampleService.activeTaskCount > 0) {
            venusLogger.warn(
                "SampleService: Periodic task already running, skipping"
            );
            return;
        }

        // Clear any existing interval
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        SampleService.activeTaskCount++;
        venusLogger.info(
            `SampleService: Starting periodic task (active tasks: ${SampleService.activeTaskCount})`
        );

        // Initial call immediately
        this.fetchSample();

        // Set up periodic calls
        this.intervalId = setInterval(() => {
            this.fetchSample();
        }, this.DEFAULT_INTERVAL);
    }

    private async fetchSample(): Promise<void> {
        if (!this.runtime) {
            venusLogger.error("SampleService: Runtime not initialized");
            return;
        }

        try {
            // Example of using the sampleProvider
            // Create dummy memory and state objects for the provider
            // const dummyMemory: Memory = {
            //     id: stringToUuid("sample-service-trigger"),
            //     userId: this.runtime.agentId,
            //     agentId: this.runtime.agentId,
            //     roomId: this.runtime.agentId,
            //     content: { text: "Periodic sample fetch" },
            //     createdAt: Date.now(),
            // };

            // const dummyState: State = {
            //     userId: this.runtime.agentId,
            //     bio: "",
            //     lore: "",
            //     messageDirections: "",
            //     postDirections: "",
            //     roomId: this.runtime.agentId,
            //     actors: "",
            //     recentMessages: "",
            //     recentMessagesData: [],
            // };
            // await sampleProvider.get(this.runtime, dummyMemory, dummyState);

            // hello world log example
            venusLogger.info("SampleService: Hello world");

            venusLogger.info(
                "SampleService: Successfully fetched and processed sample"
            );
        } catch (error) {
            venusLogger.error("SampleService: Error fetching sample:", error);
        }
    }

    // Method to stop the service
    stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            SampleService.activeTaskCount--;
            venusLogger.info(
                `SampleService stopped (active tasks: ${SampleService.activeTaskCount})`
            );
        }
        SampleService.isInitialized = false;
    }

    // Method to manually trigger a sample fetch (for testing)
    async forceFetch(): Promise<void> {
        await this.fetchSample();
    }
}

export default SampleService;