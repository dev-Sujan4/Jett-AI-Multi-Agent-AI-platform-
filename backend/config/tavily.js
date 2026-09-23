import { TavilySearch } from "@langchain/tavily";


export const searchTool = new TavilySearch({
  maxResults: 3,
  topic: "general",
   includeAnswer: true,
  // includeRawContent: false,
   includeImages: true,
  // includeImageDescriptions: false,
  // searchDepth: "basic",
  // timeRange: "day",
  // includeDomains: [],
  // excludeDomains: [],
});