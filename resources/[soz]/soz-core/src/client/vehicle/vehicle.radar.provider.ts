import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { VehicleSeat } from '../../shared/vehicle/vehicle';
import { BlipFactory } from '../blip';
import { ObjectProvider } from '../object/object.provider';
import { PlayerInOutService } from '../player/player.inout.service';
import { RaceProvider } from '../race/race.provider';
import { RadarRepository } from '../repository/radar.repository';

const radar_props = GetHashKey('soz_prop_radar_2');

@Provider()
export class VehicleRadarProvider {
    @Inject(PlayerInOutService)
    private playerInOutService: PlayerInOutService;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

    @Inject(RadarRepository)
    private radarRepository: RadarRepository;

    @Inject(RaceProvider)
    private raceProvider: RaceProvider;

    private globalDisableTime = 0;
    private ready = false;

    @Once(OnceStep.Start)
    async onStart() {
        for (const [radarID, radar] of Object.entries(this.radarRepository.get())) {
            radar.objectId = await this.objectProvider.createObject({
                model: radar_props,
                position: radar.props,
                id: 'radar_' + radarID,
            });

            radar.disableTime = GetResourceKvpInt('radar/disableEndTime/' + radarID);
            this.globalDisableTime = GetResourceKvpInt('radar/disableEndTime/all');

            if (radar.isOnline) {
                this.playerInOutService.add('radar' + radarID, radar.zone, isInside => {
                    if (this.raceProvider.isInRace()) {
                        return;
                    }

                    if (isInside) {
                        if (this.globalDisableTime && this.globalDisableTime > Date.now() / 1000) {
                            return;
                        }

                        if (radar.disableTime && radar.disableTime > Date.now() / 1000) {
                            return;
                        }
                        const ped = PlayerPedId();
                        const vehicle = GetVehiclePedIsIn(ped, false);

                        if (vehicle) {
                            if (GetPedInVehicleSeat(vehicle, VehicleSeat.Driver) == ped) {
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

        this.ready = true;
    }

    public isReady() {
        return this.ready;
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

    public disableAll(duration: number) {
        const disableEndTime = Math.round(Date.now() / 1000 + duration);
        this.globalDisableTime = disableEndTime;
        SetResourceKvpInt('radar/disableEndTime/all', disableEndTime);
    }
}
