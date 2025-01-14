import { Once, OnceStep, OnEvent, OnNuiEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { RepositoryDelete, RepositoryInsert, RepositoryUpdate } from '@core/decorators/repository';
import { RepositoryType } from '@public/shared/repository';
import { createRadarZone, Radar, RADAR_ID_PREFIX } from '@public/shared/vehicle/radar';

import { ClientEvent, NuiEvent, ServerEvent } from '../../shared/event';
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

    public displayRadar = false;

    private globalDisableTime = 0;
    private ready = false;

    private disabledRadarTime = new Map<number, number>();

    @Once(OnceStep.RepositoriesLoaded)
    async onStart() {
        for (const radar of this.radarRepository.get()) {
            await this.createRadar(radar);
        }

        this.ready = true;
    }

    @RepositoryDelete(RepositoryType.Radar)
    public async deleteRadar(radar: Radar) {
        const objectId = RADAR_ID_PREFIX + radar.id;

        this.objectProvider.deleteObject(objectId);
        this.playerInOutService.remove(objectId);
        this.disabledRadarTime.delete(radar.id);

        DeleteResourceKvp('radar/disableEndTime/' + radar.id);

        if (this.blipFactory.exist('police_radar_' + radar.id)) {
            this.blipFactory.remove('police_radar_' + radar.id);
        }
    }

    @RepositoryUpdate(RepositoryType.Radar)
    public async updateRadar(radar: Radar) {
        await this.deleteRadar(radar);
        await this.createRadar(radar);
    }

    @RepositoryInsert(RepositoryType.Radar)
    private async createRadar(radar: Radar): Promise<void> {
        const objectId = RADAR_ID_PREFIX + radar.id;

        if (!this.blipFactory.exist('police_radar_' + radar.id)) {
            this.blipFactory.create('police_radar_' + radar.id, {
                name: 'Radar',
                position: radar.position,
                sprite: 184,
                scale: 0.5,
            });

            this.blipFactory.hide('police_radar_' + radar.id, !this.displayRadar);
        }

        await this.objectProvider.createObject({
            model: radar_props,
            position: radar.position,
            id: objectId,
        });

        const disabledTime = GetResourceKvpInt('radar/disableEndTime/' + radar.id);

        if (disabledTime) {
            this.disabledRadarTime.set(radar.id, disabledTime);
        }

        if (radar.enabled) {
            const radarZone = createRadarZone(radar.position);

            this.playerInOutService.add(objectId, radarZone, isInside => {
                if (this.raceProvider.isInRace()) {
                    return;
                }

                if (isInside) {
                    if (this.globalDisableTime && this.globalDisableTime > Date.now() / 1000) {
                        return;
                    }

                    const disableTime = this.disabledRadarTime.get(radar.id);

                    if (disableTime && disableTime > Date.now() / 1000) {
                        return;
                    }

                    const ped = PlayerPedId();
                    const vehicle = GetVehiclePedIsIn(ped, false);

                    if (vehicle) {
                        if (GetPedInVehicleSeat(vehicle, VehicleSeat.Driver) == ped) {
                            const coords = GetEntityCoords(vehicle, false);
                            const streetA = GetStreetNameAtCoord(coords[0], coords[1], coords[2])[0];

                            TriggerServerEvent(
                                ServerEvent.VEHICLE_RADAR_TRIGGER,
                                Number(radar.id),
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

    public isReady() {
        return this.ready;
    }

    @OnEvent(ClientEvent.VEHICLE_RADAR_FLASHED)
    public async flashed() {
        StartScreenEffect('RaceTurbo', 300, false);
    }

    @OnEvent(ClientEvent.RADAR_TOGGLE_BLIP)
    public async toggleBlip(value: boolean) {
        for (const radar of this.radarRepository.get()) {
            if (!this.blipFactory.exist('police_radar_' + radar.id)) {
                this.blipFactory.create('police_radar_' + radar.id, {
                    name: 'Radar',
                    position: radar.position,
                    sprite: 184,
                    scale: 0.5,
                });
            }

            this.blipFactory.hide('police_radar_' + radar.id, !value);
        }
    }

    @OnEvent(ClientEvent.JOB_DUTY_CHANGE)
    public async removeBlip(duty: boolean) {
        if (!duty) {
            for (const radar of this.radarRepository.get()) {
                if (this.blipFactory.exist('police_radar_' + radar.id)) {
                    this.blipFactory.remove('police_radar_' + radar.id);
                }
            }
        }
    }

    public disableAll(duration: number) {
        const disableEndTime = Math.round(Date.now() / 1000 + duration);
        this.globalDisableTime = disableEndTime;
        SetResourceKvpInt('radar/disableEndTime/all', disableEndTime);
    }

    public disableRadar(radarId: string, duration: number) {
        if (radarId.startsWith(RADAR_ID_PREFIX)) {
            radarId = radarId.replace(RADAR_ID_PREFIX, '');
        }

        const disableEndTime = Math.round(Date.now() / 1000 + duration);
        this.disabledRadarTime.set(Number(radarId), disableEndTime);

        SetResourceKvpInt('radar/disableEndTime/' + radarId, disableEndTime);
    }

    @OnNuiEvent(NuiEvent.ToggleRadar)
    public async toggleRadar(value: boolean) {
        this.displayRadar = value;

        await this.toggleBlip(value);
    }
}
