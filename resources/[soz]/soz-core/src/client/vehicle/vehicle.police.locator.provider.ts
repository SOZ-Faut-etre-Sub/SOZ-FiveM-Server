import { Inject } from '@public/core/decorators/injectable';
import { emitRpc } from '@public/core/rpc';
import { JobType } from '@public/shared/job';
import { RpcServerEvent } from '@public/shared/rpc';

import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { VehicleLocation } from '../../shared/vehicle/vehicle';
import { JobService } from '../job/job.service';
import { PlayerService } from '../player/player.service';
import { VehicleStateService } from './vehicle.state.service';

const color: Partial<Record<JobType, number>> = {
    lspd: 38,
    bcso: 2,
    sasp: 55,
    fbi: 72,
};

@Provider()
export class VehiclePoliceLocator {
    @Inject(PlayerService)
    public playerService: PlayerService;

    @Inject(VehicleStateService)
    public vehicleStateService: VehicleStateService;

    @Inject(JobService)
    public jobService: JobService;

    private entityBlips = new Map<string, number>();
    private locationBlips = new Map<string, number>();
    private adminEnabled = false;

    private clear() {
        this.entityBlips.forEach(blip => RemoveBlip(blip));
        this.entityBlips.clear();
        this.locationBlips.forEach(blip => RemoveBlip(blip));
        this.locationBlips.clear();
    }

    private getSpriteFromModel(model: string) {
        const hash = GetHashKey(model);
        if (IsThisModelACar(hash)) {
            return 56;
        } else if (IsThisModelABoat(hash)) {
            return 755;
        } else if (IsThisModelAHeli(hash)) {
            return 43;
        } else if (IsThisModelAPlane(hash)) {
            return 16;
        } else if (IsThisModelATrain(hash)) {
            return 795;
        } else if (IsThisModelABike(hash) || IsThisModelABicycle(hash)) {
            return 661;
        } else {
            return 56;
        }
    }

    public setAdminEnabled(status: boolean) {
        this.adminEnabled = status;
    }

    public getAdminEnabled() {
        return this.adminEnabled;
    }

    private customBlip(blip: number, veh: VehicleLocation) {
        SetBlipSprite(blip, this.getSpriteFromModel(veh.model));
        SetBlipColour(blip, color[veh.job]);
        SetBlipAsShortRange(blip, true);

        BeginTextCommandSetBlipName('STRING');
        AddTextComponentString(veh.name || veh.plate);
        EndTextCommandSetBlipName(blip);
    }

    @Tick(3000, 'fdo-veh-map')
    public async fdoVehicleMap() {
        const player = this.playerService.getPlayer();
        if (!player) {
            return;
        }

        const playerPed = PlayerPedId();
        const vehicule = GetVehiclePedIsIn(playerPed, false);
        if (!this.adminEnabled) {
            if (!vehicule) {
                this.clear();
                return;
            }

            const vehState = await this.vehicleStateService.getVehicleState(vehicule);
            if (!vehState.policeLocatorEnabled) {
                this.clear();
                return;
            }
        }

        const vehs = await emitRpc<VehicleLocation[]>(RpcServerEvent.VEHICLE_FDO_GET_POSTIONS);

        for (const [key, value] of this.entityBlips) {
            if (!vehs.find(elem => elem.plate == key)) {
                RemoveBlip(value);
                this.entityBlips.delete(key);
            }
        }
        for (const [key, value] of this.locationBlips) {
            if (!vehs.find(elem => elem.plate == key)) {
                RemoveBlip(value);
                this.locationBlips.delete(key);
            }
        }

        for (const veh of vehs) {
            if (NetworkDoesNetworkIdExist(veh.netId)) {
                const entityBlip = this.entityBlips.get(veh.plate);
                const entity = NetworkGetEntityFromNetworkId(veh.netId);

                if (entityBlip) {
                    if (entity == vehicule) {
                        RemoveBlip(entityBlip);
                        this.entityBlips.delete(veh.plate);
                        continue;
                    }
                    continue;
                }

                if (this.locationBlips.has(veh.plate)) {
                    RemoveBlip(this.locationBlips.get(veh.plate));
                    this.locationBlips.delete(veh.plate);
                }

                if (entity == vehicule) {
                    continue;
                }

                const blip = AddBlipForEntity(entity);

                this.entityBlips.set(veh.plate, blip);

                this.customBlip(blip, veh);
            } else {
                if (this.entityBlips.has(veh.plate)) {
                    RemoveBlip(this.entityBlips.get(veh.plate));
                    this.entityBlips.delete(veh.plate);
                }

                if (!this.locationBlips.has(veh.plate)) {
                    const blip = AddBlipForCoord(veh.position[0], veh.position[1], veh.position[2]);
                    this.locationBlips.set(veh.plate, blip);
                    this.customBlip(blip, veh);
                } else {
                    SetBlipCoords(this.locationBlips.get(veh.plate), veh.position[0], veh.position[1], veh.position[2]);
                }
            }
        }
    }
}
