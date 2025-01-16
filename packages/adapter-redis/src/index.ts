import Redis from "ioredis";
import { IDatabaseCacheAdapter, UUID, venusLogger } from "@venusos/core";

export class RedisClient implements IDatabaseCacheAdapter {
    private client: Redis;

    constructor(redisUrl: string) {
        this.client = new Redis(redisUrl);

        this.client.on("connect", () => {
            venusLogger.success("Connected to Redis");
        });

        this.client.on("error", (err) => {
            venusLogger.error("Redis error:", err);
        });
    }

    async getCache(params: {
        agentId: UUID;
        key: string;
    }): Promise<string | undefined> {
        try {
            const redisKey = this.buildKey(params.agentId, params.key);
            const value = await this.client.get(redisKey);
            return value || undefined;
        } catch (err) {
            venusLogger.error("Error getting cache:", err);
            return undefined;
        }
    }

    async setCache(params: {
        agentId: UUID;
        key: string;
        value: string;
    }): Promise<boolean> {
        try {
            const redisKey = this.buildKey(params.agentId, params.key);
            await this.client.set(redisKey, params.value);
            return true;
        } catch (err) {
            venusLogger.error("Error setting cache:", err);
            return false;
        }
    }

    async deleteCache(params: {
        agentId: UUID;
        key: string;
    }): Promise<boolean> {
        try {
            const redisKey = this.buildKey(params.agentId, params.key);
            const result = await this.client.del(redisKey);
            return result > 0;
        } catch (err) {
            venusLogger.error("Error deleting cache:", err);
            return false;
        }
    }

    async disconnect(): Promise<void> {
        try {
            await this.client.quit();
            venusLogger.success("Disconnected from Redis");
        } catch (err) {
            venusLogger.error("Error disconnecting from Redis:", err);
        }
    }

    private buildKey(agentId: UUID, key: string): string {
        return `${agentId}:${key}`; // Constructs a unique key based on agentId and key
    }
}

export default RedisClient;
