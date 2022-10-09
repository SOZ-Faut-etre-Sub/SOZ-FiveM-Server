import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { BennysConfig } from '../../../shared/job/bennys';
import { Err, Ok } from '../../../shared/result';
import { InputService } from '../../nui/input.service';
import { PlayerService } from '../../player/player.service';
import { Qbcore } from '../../qbcore';
import { TargetFactory } from '../../target/target.factory';

@Provider()
export class BennysOrderProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(Qbcore)
    private QBCore: Qbcore;

    @Inject(InputService)
    private inputService: InputService;

    @Once(OnceStep.Start)
    public async onStart() {
        const orderZone = BennysConfig.Order.zone;
        this.targetFactory.createForBoxZone(orderZone.name, orderZone, [
            {
                label: 'Commander une voiture',
                icon: 'c:/bennys/order.png',
                color: 'bennys',
                job: 'bennys',
                blackoutJob: 'bennys',
                blackoutGlobal: true,
                canInteract: () => {
                    return this.playerService.isOnDuty() && this.QBCore.hasJobPermission('bennys', 'order');
                },
                action: async () => {
                    const model = await this.inputService.askInput(
                        {
                            title: 'Modèle du véhicule à commander:',
                            defaultValue: '',
                            maxCharacters: 32,
                        },
                        value => {
                            if (!value || IsModelInCdimage(model) || IsModelValid(model)) {
                                return Ok(true);
                            }
                            return Err('Le modèle du véhicule est invalide.');
                        }
                    );
                    if (!model) {
                        TriggerServerEvent(ServerEvent.BENNYS_ORDER_VEHICLE, model);
                    }
                },
            },
        ]);
    }
}
