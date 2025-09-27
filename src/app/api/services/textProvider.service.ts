import { generateText, streamText, } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { chatPrompt } from "../../prompts/chat";
import { webSummarizerPrompt } from "../../prompts/summarizer";

const model = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY })
export async function getWebSummary(webInfo: string) {
    try {
        const { text } = await generateText({
            model: model('gemini-2.5-flash'),
            prompt: webSummarizerPrompt(webInfo)
        });
        return text;
    }
    catch (err) {
        console.error(err);
        throw new Error("An error occurred: verify that you have enough tokens or wait for the service to be restored");
    }
}

export async function askModel(messages: any, context: string) {
    try {
        const result = streamText({
            model: model('gemini-2.5-flash'),
            system: chatPrompt(context),
            messages
        });
        return result;
    }
    catch (err) {
        throw new Error("An error occurred: verify that you have enough tokens or wait for the service to be restored");
    }
}