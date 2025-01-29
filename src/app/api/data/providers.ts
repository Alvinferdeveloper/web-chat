import { randomUUID } from "crypto";
import { groq } from "@ai-sdk/groq";

export const availableProviders = [
    {
        id: randomUUID(),
        provider: groq('llama3-8b-8192'),
        name: "Groq",
        iconSrc : "/groq-logo.webp"
    }
]