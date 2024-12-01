import { Gauge } from 'prom-client';

import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { FieldRepository } from '../repository/field.repository';

@Provider()
export class MonitorFieldProvider {
    @Inject(FieldRepository)
    private fieldRepository: FieldRepository;

    private fieldAmount: Gauge<string> = new Gauge({
        name: 'soz_field_amount',
        help: 'Field amount stored',
        labelNames: ['identifier'],
    });

    @Tick(5000, 'monitor:pawl:metrics')
    public async onTick() {
        const fields = await this.fieldRepository.get();

        for (const field of fields) {
            this.fieldAmount.set(
                {
                    identifier: field.identifier,
                },
                field.capacity
            );
        }
    }
}
