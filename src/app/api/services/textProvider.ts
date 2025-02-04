import { generateText , streamText, } from "ai"
interface Provider {
    createProvider: providerCreators,
    modelName?: string
}
export async function getWebSummary({ createProvider, modelName = '' }: Provider, apiKey: string){
    const model = createProvider({ apiKey: apiKey })
    try {
        const { text } = await generateText({
            model: model(modelName),
            prompt:"Quiero que me des un resumen sobre aws"
        });
        return text;
    }
    catch (err) {
        
        const error = err as { statusCode:number};
        if (error.statusCode === 401) {
            throw new Error("Invalid api key");
        }
        else {
            throw new Error("An error occurred: verify that you have enough tokens or wait for the service to be restored");
        }
    }
}

export async function askModelUsingProviderCredentials({ createProvider, modelName = '' }: Provider, apiKey: string, messages: any, context: string){
    console.log(apiKey, "apiKey: ");
    const model = createProvider({ apiKey: apiKey })
    try {
        const result = streamText({
            model: model(modelName),
            system: `Quiero que respondas basado en esta informacion que te doy ${context}`,
            messages
        });
        return result;
    }
    catch (err) {
        console.log("error: ", err);
        const error = err as { statusCode:number};
        if (error.statusCode === 401) {
            throw new Error("Invalid api key");
        }
        else {
            throw new Error("An error occurred: verify that you have enough tokens or wait for the service to be restored");
        }
    }
}