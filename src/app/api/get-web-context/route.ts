import { requireAuth } from '../lib/auth-helper';
import { withErrorHandler, ApiResponse } from '../lib/api-helpers';
import { WebContextService } from '../services/webContext.service';

export const POST = withErrorHandler(async (req: Request) => {
    await requireAuth(req);

    const { urls } = await req.json();
    
    const { context, summary } = await WebContextService.generateContextAndSummary(urls);

    return ApiResponse.success({ context, summary });
});