import { Once, OnceStep } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';

import { ServerEvent } from '../../../shared/event/server';
import { toVector4Object } from '../../../shared/polyzone/vector';
import { BlipFactory } from '../../blip';
import { PedFactory } from '../../factory/ped.factory';

@Provider()
export class PawlProvider {
    @Inject(PedFactory)
    private pedFactory: PedFactory;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Once(OnceStep.PlayerLoaded)
    public async setupPawl() {
        await this.pedFactory.createPedOnGrid({
            model: 's_m_y_construct_01',
            coords: toVector4Object([-272.22, -2496.57, 6.3, 186.72]),
            freeze: true,
            invincible: true,
            blockevents: true,
            scenario: 'WORLD_HUMAN_CLIPBOARD',
            dropItemCallback: (inventoryId, inventoryItem, amount) => {
                TriggerServerEvent(
                    ServerEvent.JOB_RESELL_ITEM,
                    inventoryId,
                    inventoryItem,
                    amount,
                    'Resell:LSPort:Pawl'
                );
            },
        });

        this.blipFactory.create('job_pawl', {
            name: 'Pipe And Wooden Leg',
            position: [-574.68, 5332.84, 71.21],
            sprite: 607,
            scale: 0.9,
        });
    }
}
