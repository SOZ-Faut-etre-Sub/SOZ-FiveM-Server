import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { JobPermission } from '../../../shared/job';
import { BennysConfig } from '../../../shared/job/bennys';
import { BoxZone } from '../../../shared/polyzone/box.zone';
import { Vector3 } from '../../../shared/polyzone/vector';
import { Err, Ok } from '../../../shared/result';
import { InputService } from '../../nui/input.service';
import { PlayerService } from '../../player/player.service';
import { Qbcore } from '../../qbcore';
import { TargetFactory } from '../../target/target.factory';
import { VehicleModificationService } from '../../vehicle/vehicle.modification.service';

@Provider()
export class BennysResellProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(Qbcore)
    private QBCore: Qbcore;

    @Inject(VehicleModificationService)
    private vehicleModificationService: VehicleModificationService;

    @Once(OnceStep.Start)
    public onStart() {
        const resellZones = BennysConfig.Resell;

        resellZones.map(resellZone => {
            const zone: BoxZone = new BoxZone(resellZone.zone.center, resellZone.zone.length, resellZone.zone.width, {
                maxZ: resellZone.zone.maxZ,
                minZ: resellZone.zone.minZ,
                heading: resellZone.zone.heading,
            });
            this.createZone(zone, resellZone.types, resellZone.label);
        });
    }

    public createZone(zone, allowedTypes: Array<number>, label) {
        this.targetFactory.createForAllVehicle([
            {
                label: label,
                icon: 'c:/mechanic/resell.png',
                job: 'bennys',
                blackoutGlobal: true,
                blackoutJob: 'bennys',
                canInteract: entity => {
                    const coords = GetEntityCoords(entity, false);
                    const point: Vector3 = [coords[0], coords[1], coords[2]];
                    const vehicleType = GetVehicleClass(entity);
                    return (
                        this.playerService.isOnDuty() &&
                        this.QBCore.hasJobPermission('bennys', JobPermission.BennysResell) &&
                        zone.isPointInside(point) &&
                        allowedTypes.includes(vehicleType)
                    );
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
                            return Err(`La valeur saisie ne correspond pas au modèle du véhicule.`);
                        }
                    );

                    if (!value) {
                        return;
                    }

                    const configuration = this.vehicleModificationService.getVehicleConfiguration(entity);

                    TriggerServerEvent(
                        ServerEvent.BENNYS_SELL_VEHICLE,
                        NetworkGetNetworkIdFromEntity(entity),
                        configuration
                    );
                },
            },
        ]);
    }
}
