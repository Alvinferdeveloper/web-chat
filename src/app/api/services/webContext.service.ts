
import { getWebSummary } from "./textProvider.service";
import { scrappWeb } from "./scrapper.service";
import { ApiError } from "../lib/api-helpers";

export class WebContextService {
    static async generateContextAndSummary(urls: string[]): Promise<{ context: string, summary: string }> {
        if (!urls || !Array.isArray(urls) || urls.length === 0) {
            throw new ApiError(422, "Missing or invalid 'urls' array");
        }

        const context = await scrappWeb(urls);
        
        let summary = '';
        // Only generate a summary if there's a single URL, to keep it focused.
        if (urls.length === 1) {
            try {
                summary = await getWebSummary(context);
            } catch (summaryError) {
                console.warn('Could not generate summary for single URL:', summaryError);
            }
        }

        return { context, summary };
    }
}
