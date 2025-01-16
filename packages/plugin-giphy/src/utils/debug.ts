import { venusLogger } from "@venusos/core";

export const debugLog = {
    request: (method: string, url: string, data?: any) => {
        venusLogger.log("🌐 API Request:", {
            method,
            url,
            data: data || "No data"
        });
    },

    response: (response: any) => {
        venusLogger.log("✅ API Response:", {
            status: response?.status,
            data: response?.data || "No data"
        });
    },

    error: (error: any) => {
        venusLogger.error("⛔ Error Details:", {
            message: error?.message,
            response: {
                status: error?.response?.status,
                data: error?.response?.data
            },
            config: {
                url: error?.config?.url,
                method: error?.config?.method,
                data: error?.config?.data
            }
        });
    },

    validation: (config: any) => {
        venusLogger.log("🔍 Config Validation:", config);
    }
};