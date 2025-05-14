import { generateText, streamText, } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const model = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY })
export async function getWebSummary(webInfo: string) {
    try {
        const { text } = await generateText({
            model: model('gemini-1.5-flash'),
            prompt: `I would like your help with a brief summary of the following information : ${webInfo}. This information comes from a website. Please respond in the same language as the website's information is the information is in spanish, use spanish if in english, use english and so on. Describe the most relevant information clearly and concisely. You may mention the author, the date, and other relevant information. Always begin with the phrase "what this website is about."`
        });
        return text;
    }
    catch (err) {
        throw new Error("An error occurred: verify that you have enough tokens or wait for the service to be restored");
    }
}

export async function askModel(messages: any, context: string) {
    const prompt = `
Use the following context to answer the question. Do not ignore the context—refer to it directly and extract relevant information as needed.

Context:
"""
${context}
"""

If your response includes code, format it using triple backticks (\`\`\`) and include the correct language identifier (e.g., \`\`\`js, \`\`\`python, \`\`\`html). This ensures proper syntax highlighting in the chat UI.

Use Markdown formatting for structured content:
- Bullet or numbered lists for steps or instructions.
- Tables for comparisons or summaries.
- Bold or italics for emphasis, where appropriate.

Avoid vague or generic explanations. The answer will be rendered in a chat interface that supports Markdown and syntax-highlighted code blocks, so formatting matters.

Example of a properly formatted code block:
\`\`\`python
def greet(name):
    print(f"Hello, {name}")
\`\`\`

Begin your response below:
`;

    try {
        const result = streamText({
            model: model('gemini-1.5-flash'),
            system: prompt,
            messages
        });
        return result;
    }
    catch (err) {
        throw new Error("An error occurred: verify that you have enough tokens or wait for the service to be restored");
    }
}