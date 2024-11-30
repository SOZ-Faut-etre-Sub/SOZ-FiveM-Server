import { Provider } from '@public/core/decorators/provider';
import { Gauge } from 'prom-client';

import { On } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Tick, TickInterval } from '../../../core/decorators/tick';
import { EntityType } from '../../../shared/entity';
import { DEGRADATION_THRESHOLD, getCuttedTrees, isPawlField, PAWL_FIELD_LIST } from '../../../shared/field';
import { joaat } from '../../../shared/joaat';
import { DegradationLevel } from '../../../shared/job/pawl';
import { getRandomInt } from '../../../shared/random';
import { FieldRepository } from '../../repository/field.repository';

const DEGRADATION_PEDS = [
    joaat('a_c_boar'),
    joaat('a_c_chickenhawk'),
    joaat('a_c_cormorant'),
    joaat('a_c_cow'),
    joaat('a_c_coyote'),
    joaat('a_c_crow'),
    joaat('a_c_deer'),
    joaat('a_c_hen'),
    joaat('a_c_pig'),
    joaat('a_c_pigeon'),
    joaat('a_c_rabbit_01'),
    joaat('a_c_seagull'),
];

const DEGRADATION_MULTIPLIER: Record<DegradationLevel, number> = {
    [DegradationLevel.Green]: 100,
    [DegradationLevel.Yellow]: 50,
    [DegradationLevel.Red]: 10,
};

@Provider()
export class PawlDegradationProvider {
    @Inject(FieldRepository)
    private fieldRepository: FieldRepository;

    private currentDegradationLevel: DegradationLevel = DegradationLevel.Green;

    private degradationPercent: Gauge<string> = new Gauge({
        name: 'soz_pawl_degradation_percent',
        help: 'Degradation percent of pawl',
    });

    private field: Gauge<string> = new Gauge({
        name: 'soz_pawl_field',
        help: 'Number of tree in a pawl field',
        labelNames: ['identifier'],
    });

    @Tick(TickInterval.EVERY_MINUTE)
    async checkDegradationLevel() {
        let treeNumbers = 0;
        let cuttedTreeNumbers = 0;

        for (const identifier of PAWL_FIELD_LIST) {
            const field = await this.fieldRepository.find(identifier);

            if (!field) {
                continue;
            }

            if (!isPawlField(field)) {
                continue;
            }

            const fieldCuttedTreeNumbers = getCuttedTrees(field);

            this.field.set(
                {
                    identifier: field.identifier,
                },
                fieldCuttedTreeNumbers
            );

            treeNumbers += field.field.length;
            cuttedTreeNumbers += fieldCuttedTreeNumbers;
        }

        const degradationPercentage = (cuttedTreeNumbers / treeNumbers) * 100;
        let degradationLevel = DegradationLevel.Red;

        this.degradationPercent.set(degradationPercentage);

        for (const percentageStr of Object.keys(DEGRADATION_THRESHOLD)) {
            const percentage = parseInt(percentageStr);

            if (degradationPercentage < percentage) {
                degradationLevel = DEGRADATION_THRESHOLD[percentage];
                break;
            }
        }

        if (this.currentDegradationLevel !== degradationLevel) {
            this.currentDegradationLevel = degradationLevel;
        }
    }

    @On('entityCreating', false)
    public async handleCancelAnimalDegradation(entity: number) {
        const entityType = GetEntityType(entity);

        if (entityType !== EntityType.Ped) {
            return;
        }

        const model = GetEntityModel(entity);

        if (!DEGRADATION_PEDS.includes(model)) {
            return;
        }

        const random = getRandomInt(0, 100);

        if (random <= DEGRADATION_MULTIPLIER[this.currentDegradationLevel]) {
            return;
        }

        CancelEvent();
    }
}
