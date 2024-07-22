import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event/server';
import { PedFactory } from '../../factory/ped.factory';

@Provider()
export class PawlResellProvider {
    @Inject(PedFactory)
    private pedFactory: PedFactory;

    @Once(OnceStep.PlayerLoaded)
    public setupFoodResell() {
        this.pedFactory.createPedOnGrid({
            model: 's_m_y_construct_01',
            coords: { x: 955.87, y: -2176.36, z: 31.15, w: 90.14 },
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
    }
}
