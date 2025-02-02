import { generateText } from "ai"
interface Provider {
    createProvider: providerCreators,
    modelName?: string
}
export async function askModelUsingProviderCredentials({ createProvider, modelName = '' }: Provider, apiKey: string) {
    const model = createProvider({ apiKey: apiKey })

    try {
        const { text } = await generateText({
            model: model(modelName),
            prompt: "What is love?",
        });
        return text;
    }
    catch (err) {
        
        const error = err as { statusCode:number};
        if (error.statusCode === 401) {
            throw new Error("Invalid api key");
        }
        else {
            throw new Error("Ocurred and error");
        }
    }
}