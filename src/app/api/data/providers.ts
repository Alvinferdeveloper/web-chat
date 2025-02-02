import { createGroq } from "@ai-sdk/groq";
import { createOpenAI } from "@ai-sdk/openai";
import { randomUUID } from "crypto";

export const availableProviders = [
    {
        id: "1",
        createProvider: createGroq,
        name: "Groq",
        model: 'llama3-8b-8192',
        iconSrc : "/groq-logo.webp"
    },
    {
        id: "2",
        createProvider: createOpenAI,
        name: "OpenAI",
        model: "gpt-4o-mini",
        iconSrc : "/chat-gpt.png"
    }
]