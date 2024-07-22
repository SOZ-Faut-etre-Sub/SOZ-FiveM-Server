import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event/server';
import { PedFactory } from '../../factory/ped.factory';

@Provider()
export class FoodResellProvider {
    @Inject(PedFactory)
    private pedFactory: PedFactory;

    @Once(OnceStep.PlayerLoaded)
    public setupFoodResell() {
        this.pedFactory.createPedOnGrid({
            model: 's_m_y_dockwork_01',
            coords: { x: -57.01, y: -2448.4, z: 6.24, w: 145.77 },
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
                    'Resell:LSPort:Food'
                );
            },
        });
    }
}
