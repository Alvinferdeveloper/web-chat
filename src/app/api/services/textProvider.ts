import { generateText, streamText, } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { scrappWeb } from "./scrapper";

const model = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY })
export async function getWebSummary(url: string) {
    const webInfo = await scrappWeb(url);
    try {
        const { text } = await generateText({
            model: model('gemini-1.5-flash'),
            prompt: `I would like your help with a brief summary of the following information in HTML format: ${webInfo}. This information comes from a website. Please respond in the same language as the website's information is the information is in spanish, use spanish if in english, use english and so on. Describe the most relevant information clearly and concisely. You may mention the author, the date, and other relevant information. Always begin with the phrase "what this website is about."`
        });
        return text;
    }
    catch (err) {
        console.log(err)
        throw new Error("An error occurred: verify that you have enough tokens or wait for the service to be restored");
    }
}

export async function askModel(messages: any, context: string) {
    try {
        const result = streamText({
            model: model('gemini-1.5-flash'),
            system: `Quiero que respondas basado en esta informacion que te doy ${context} por favor debuelveme la respuesta en markdown muy bien estructurado y entendible para el usuario y asi mostrarlo en la interfaz`,
            messages
        });
        return result;
    }
    catch (err) {
        throw new Error("An error occurred: verify that you have enough tokens or wait for the service to be restored");
    }
}