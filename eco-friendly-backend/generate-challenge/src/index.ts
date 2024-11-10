import { z } from "zod";
import axios from "axios";
import {
  defineDAINService,
  ToolConfig,
} from "@dainprotocol/service-sdk";
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables from .env file

// Tool configuration for generating a challenge
const generateChallengeConfig: ToolConfig = {
  id: "generate-challenge",
  name: "Generate Eco-Friendly Challenge",
  description: "Generates a seasonal eco-friendly challenge based on a selected category",
  input: z
    .object({
      category: z.string().describe("Eco-friendly activity category (e.g., recycling, tree planting, water conservation)"),
    })
    .describe("Input parameters for generating a challenge"),
  output: z
    .object({
      challenge: z.string().describe("Generated challenge text"),
      pointsReward: z.number().describe("Extra points reward for completing the challenge"),
    })
    .describe("Generated challenge information"),
  pricing: { pricePerUse: 0, currency: "USD" },
  handler: async ({ category }, agentInfo) => {
    console.log(`User / Agent ${agentInfo.id} requested a challenge for the category: ${category}`);

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [
                {
                  text: `Generate a fun and engaging eco-friendly challenge related to ${category}.`
                }
              ]
            }
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const { data } = response;
      const challengeText = data.candidates[0].content.parts[0].text;
      const pointsReward = 150; // Set extra points for challenge completion

      return {
        text: `Challenge generated: ${challengeText}`,
        data: {
          challenge: challengeText,
          pointsReward: pointsReward,
        },
        ui: null,
      };
    } catch (error) {
      console.error("Error generating challenge:", error);
      throw new Error("Failed to generate challenge");
    }
  },
};

// Define the DAIN service with the new challenge generation tool
const dainService = defineDAINService({
  metadata: {
    title: "Eco-Friendly Challenge DAIN Service",
    description: "A DAIN service for generating seasonal eco-friendly challenges",
    version: "1.0.0",
    author: "Your Name",
    tags: ["eco-friendly", "challenge", "sustainability"],
    logo: "https://example.com/logo.png", // Replace with an actual logo URL if available
  },
  identity: {
    apiKey: process.env.DAIN_API_KEY, // Ensure this environment variable is set
  },
  tools: [generateChallengeConfig],
});

// Start the DAIN service on the specified port
dainService.startNode({ port: 2022 }).then(() => {
  console.log("Eco-Friendly Challenge DAIN Service is running on port 2022");
});
