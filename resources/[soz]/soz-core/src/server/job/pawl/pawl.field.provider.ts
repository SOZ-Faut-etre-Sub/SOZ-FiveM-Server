import { Provider } from '@public/core/decorators/provider';

import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { PAWL_FIELD_LIST, PAWL_FIELD_REFILL_DELAY } from '../../../shared/field';
import { FieldRepository } from '../../repository/field.repository';

@Provider()
export class PawlFieldProvider {
    @Inject(FieldRepository)
    private fieldRepository: FieldRepository;

    @Once(OnceStep.RepositoriesLoaded)
    async loadPawlField() {
        for (const identifier of PAWL_FIELD_LIST) {
            await this.fieldRepository.createField({
                identifier: identifier,
                owner: 'pawl',
                refillDelay: PAWL_FIELD_REFILL_DELAY,
                field: [],
                radius: 100,
                position: { x: 0, y: 0, z: 0 },
            });
        }
    }
}
