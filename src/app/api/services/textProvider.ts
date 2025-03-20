import { generateText, streamText, } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { scrappWeb } from "./scrapper";

const model = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY })
export async function getWebSummary(url: string) {
    const webInfo = await scrappWeb(url);
    try {
        const { text } = await generateText({
            model: model('gemini-1.5-flash'),
            prompt: `I want you to help me by giving me a brief summary of this information: ${webInfo}, this is information from a website,  respond in the same language of the website information, give me a summary of the most relevant data, I want it to be clear and concise. You can talk about the author, date and other relevant information. Always start with the phrase this website is about...`
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