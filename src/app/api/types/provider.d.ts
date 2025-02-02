type GroqCreator = (options?: GroqProviderSettings) => GroqProvider;
type OpenAICreator = (options?: OpenAIProviderSettings) => OpenAIProvider;
type providerCreators = GroqCreator | OpenAICreator;