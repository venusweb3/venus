import { IAgentRuntime, Memory, Evaluator, venusLogger } from "@venusos/core";
import { TrustScoreProvider } from "../providers/trustScoreProvider";

export const trustEvaluator: Evaluator = {
  name: "EVALUATE_TRUST",
  similes: [],
  examples: [],
  description: "Evaluates token trust scores and trading signals",
  validate: async () => true,
  handler: async (runtime: IAgentRuntime, message: Memory) => {
    const trustScoreProvider = new TrustScoreProvider();
    const tokenAddress = message.content?.tokenAddress;

    if (!tokenAddress) {
      return false;
    }

    try {
      const evaluation = await trustScoreProvider.evaluateToken(tokenAddress);

      venusLogger.log("Trust evaluation:", {
        tokenAddress,
        ...evaluation,
      });

      return true;
    } catch (error) {
      venusLogger.error("Trust evaluation failed:", error);
      return false;
    }
  },
};
