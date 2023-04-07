import { Get } from '../../core/decorators/http';
import { Provider } from '../../core/decorators/provider';
import { Response } from '../../core/http/response';

@Provider()
export class MonitorProvider {
    @Get('/metrics')
    public getMetrics(): Response {
        return Response.ok();
    }
}
