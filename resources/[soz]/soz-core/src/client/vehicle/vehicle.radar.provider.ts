import { RadarList } from '../../config/radar';
import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { JobType } from '../../shared/job';
import { BlipFactory } from '../blip';
import { PlayerInOutService } from '../player/player.inout.service';

@Provider()
export class VehicleRadarProvider {
    @Inject(PlayerInOutService)
    private playerInOutService: PlayerInOutService;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Once(OnceStep.PlayerLoaded)
    onStart(): void {
        for (const radarID in RadarList) {
            const radar = RadarList[radarID];
            if (radar.isOnline) {
                this.playerInOutService.add('radar' + radarID, radar.zone, isInside => {
                    if (isInside) {
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
    public async toggleBlip(value: boolean, job: JobType) {
        for (const radarID in RadarList) {
            const radar = RadarList[radarID];
            if (radar.station == job) {
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
    }

    @OnEvent(ClientEvent.RADAR_REMOVE_BLIP)
    public async removeBlip() {
        for (const radarID in RadarList) {
            if (this.blipFactory.exist('police_radar_' + radarID)) {
                this.blipFactory.remove('police_radar_' + radarID);
            }
        }
    }
}
