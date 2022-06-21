import { On } from '../core/decorators/event';
import { Provider } from '../core/decorators/provider';
import { Tick } from '../core/decorators/tick';

@Provider()
export class TestProvider {
    private counter = 0;

    @Tick(300)
    loop(): boolean {
        emit('soz-core:printCount', this.counter);
        this.counter += 1;

        return this.counter <= 10;
    }

    @On('soz-core:printCount')
    printCount(param): void {
        console.log('count is', param);
    }
}
