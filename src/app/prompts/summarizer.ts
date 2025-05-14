export const webSummarizerPrompt = (webInfo: string) => {
    return `I would like your help with a brief summary of the following information : ${webInfo}. 
    This information comes from a website. 
    Please respond in the same language as the website's information is the information is in spanish, 
    use spanish if in english, use english and so on. 
    Describe the most relevant information clearly and concisely. 
    You may mention the author, 
    the date, and other relevant information. 
    Always begin with the phrase "what this website is about."`
}