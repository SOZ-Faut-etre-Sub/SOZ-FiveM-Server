import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { BennysConfig } from '../../../shared/job/bennys';
import { BoxZone } from '../../../shared/polyzone/box.zone';
import { Vector3 } from '../../../shared/polyzone/vector';
import { Err, Ok } from '../../../shared/result';
import { InputService } from '../../nui/input.service';
import { PlayerService } from '../../player/player.service';
import { TargetFactory } from '../../target/target.factory';

@Provider()
export class BennysResellProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(InputService)
    private inputService: InputService;

    @Once(OnceStep.Start)
    public onStart() {
        const resellZone = BennysConfig.Resell.zone;
        const zone: BoxZone = new BoxZone(resellZone.center, resellZone.length, resellZone.width, {
            maxZ: resellZone.maxZ,
            minZ: resellZone.minZ,
            heading: resellZone.heading,
        });

        this.targetFactory.createForAllVehicle([
            {
                label: 'Vendre',
                job: 'bennys',
                blackoutGlobal: true,
                blackoutJob: 'bennys',
                canInteract: entity => {
                    const coords = GetEntityCoords(entity, false);
                    const point: Vector3 = [coords[0], coords[1], coords[2]];
                    return this.playerService.isOnDuty() && zone.isPointInside(point);
                },
                action: async entity => {
                    const displayName = GetDisplayNameFromVehicleModel(GetEntityModel(entity));
                    const label = GetLabelText(displayName).toLowerCase();

                    const value = await this.inputService.askInput(
                        {
                            title: 'Veuillez confirmer le modèle suivant: ' + label,
                            defaultValue: '',
                            maxCharacters: label.length,
                        },
                        value => {
                            if (!value) {
                                return Ok(true);
                            }
                            if (value.toLowerCase() === label) {
                                return Ok(true);
                            }
                            return Err(`La valeur saisie ne correspond pas au modèle du véhicule: ${label}`);
                        }
                    );

                    if (!value) {
                        return;
                    }
                    TriggerServerEvent(ServerEvent.BENNYS_SELL_VEHICLE, NetworkGetNetworkIdFromEntity(entity));
                },
            },
        ]);
    }
}
