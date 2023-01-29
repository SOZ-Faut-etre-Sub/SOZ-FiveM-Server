import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { BlipFactory } from '../blip';
import { PlayerInOutService } from '../player/player.inout.service';
import { RadarRepository } from '../resources/radar.repository';
import { ObjectFactory } from '../world/object.factory';

const radar_props = GetHashKey('soz_prop_radar');

@Provider()
export class VehicleRadarProvider {
    @Inject(PlayerInOutService)
    private playerInOutService: PlayerInOutService;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(ObjectFactory)
    private objectFFactory: ObjectFactory;

    @Inject(RadarRepository)
    private radarRepository: RadarRepository;

    @Once(OnceStep.Start)
    onStart(): void {
        for (const [radarID, radar] of Object.entries(this.radarRepository.get())) {
            radar.entity = this.objectFFactory.create(radar_props, radar.props, true);

            radar.disableTime = GetResourceKvpInt('radar/disableEndTime/' + radarID);

            if (radar.isOnline) {
                this.playerInOutService.add('radar' + radarID, radar.zone, isInside => {
                    if (isInside) {
                        if (radar.disableTime && radar.disableTime > Date.now() / 1000) {
                            return;
                        }
                        const ped = PlayerPedId();
                        const vehicle = GetVehiclePedIsIn(ped, false);

                        if (vehicle) {
                            if (GetPedInVehicleSeat(vehicle, -1) == ped) {
                                const coords = GetEntityCoords(vehicle, false);
                                const streetA = GetStreetNameAtCoord(coords[0], coords[1], coords[2])[0];

                                TriggerServerEvent(
                                    ClientEvent.VEHICLE_RADAR_TRIGGER,
                                    Number(radarID),
                                    VehToNet(vehicle),
                                    GetVehicleClass(vehicle),
                                    GetStreetNameFromHashKey(streetA)
                                );
                            }
                        }
                    }
                });
            }
        }
    }

    @OnEvent(ClientEvent.VEHICLE_RADAR_FLASHED)
    public async flashed() {
        StartScreenEffect('RaceTurbo', 300, false);
    }

    @OnEvent(ClientEvent.RADAR_TOGGLE_BLIP)
    public async toggleBlip(value: boolean) {
        for (const radarID in this.radarRepository.get()) {
            const radar = this.radarRepository.find(radarID);
            if (!this.blipFactory.exist('police_radar_' + radarID)) {
                this.blipFactory.create('police_radar_' + radarID, {
                    name: 'Radar',
                    coords: { x: radar.props[0], y: radar.props[1], z: radar.props[2] },
                    sprite: 184,
                    scale: 0.5,
                });
            }

            this.blipFactory.hide('police_radar_' + radarID, !value);
        }
    }

    @OnEvent(ClientEvent.JOB_DUTY_CHANGE)
    public async removeBlip(duty: boolean) {
        if (!duty) {
            for (const radarID in this.radarRepository.get()) {
                if (this.blipFactory.exist('police_radar_' + radarID)) {
                    this.blipFactory.remove('police_radar_' + radarID);
                }
            }
        }
    }
}
