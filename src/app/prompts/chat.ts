export const chatPrompt = (context: string) => {
    return `Use the following context to answer the question. Do not ignore the context—refer 
    to it directly and extract relevant information as needed.

    Context:
    """
    ${context}
    """
    
    If your response includes code, format it using triple backticks (\`\`\`) and include the correct language 
    identifier (e.g., \`\`\`js, \`\`\`python, \`\`\`html). 
    This ensures proper syntax highlighting in the chat UI.
    
    Use Markdown formatting for structured content:
    - Bullet or numbered lists for steps or instructions.
    - Tables for comparisons or summaries.
    - Bold or italics for emphasis, where appropriate.
    
    Avoid vague or generic explanations. The answer will be rendered in a chat interface that supports Markdown 
    and syntax-highlighted code blocks, so formatting matters.
    
    Example of a properly formatted code block:
    \`\`\`python
    def greet(name):
        print(f"Hello, {name}")
    \`\`\`
    
    Begin your response below:
    `;
}