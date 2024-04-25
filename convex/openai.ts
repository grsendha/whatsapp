import OpenAI from "openai";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKeyGemini = process.env.GEMINI_API;
const genAI = new GoogleGenerativeAI(apiKeyGemini!);

export const chat = action({
  args: {
    messageBody: v.string(),
    conversation: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    console.log("chat action called", args.messageBody);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = args.messageBody;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const messageContent = response.text().split("\n").slice(0, 2).join("\n");

    console.log("messageContent", messageContent);

    await ctx.runMutation(api.messages.sendChatGPTMessage, {
      content: messageContent ?? "I'm sorry, I don't have a response for that",
      conversation: args.conversation,
      messageType: "text",
    });
  },
});
