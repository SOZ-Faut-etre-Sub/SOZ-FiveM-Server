import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { LogChainHandler } from '../../core/logger';
import { ClientLogHandler } from './client.log.handler';

@Provider()
export class MonitorLogProvider {
    @Inject(ClientLogHandler)
    private readonly clientLogHandler: ClientLogHandler;

    @Inject(LogChainHandler)
    private readonly logChainHandler: LogChainHandler;

    @Once()
    public async onLogProviderStart() {
        this.logChainHandler.addHandler(this.clientLogHandler);
    }
}
