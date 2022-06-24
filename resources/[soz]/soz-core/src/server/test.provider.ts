import { On, Once, OnceStep } from '../core/decorators/event';
import { Inject } from '../core/decorators/injectable';
import { Provider } from '../core/decorators/provider';
import { Tick } from '../core/decorators/tick';
import { Logger } from '../core/logger';

@Provider()
export class TestProvider {
    private counter = 0;

    @Inject(Logger)
    private logger: Logger;

    @Tick(300)
    loop(): boolean {
        emit('soz-core:printCount', this.counter);
        this.counter += 1;

        return this.counter <= 10;
    }

    @On('soz-core:printCount')
    printCount(source, count): void {
        this.logger.info('server count is', count, source);
    }

    @Once(OnceStep.PlayerLoaded)
    onStart(): void {
        this.logger.error('player loaded');
    }
}
