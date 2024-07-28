import { Inject, Injectable } from '@core/decorators/injectable';
import { PedFactory } from '@public/client/factory/ped.factory';
import { Notifier } from '@public/client/notifier';
import { NuiDispatch } from '@public/client/nui/nui.dispatch';
import { OceanProvider } from '@public/client/world/ocean.provider';
import { wait } from '@public/core/utils';
import { ServerEvent } from '@public/shared/event';
import {
    AllowedTaxiModel,
    HoradateurData,
    HorodateurTarif,
    NPCDeliverLocations,
    NpcSkins,
    NPCTakeLocations,
    TaxiStatus,
} from '@public/shared/job/cjr';
import { Vector3, Vector4 } from '@public/shared/polyzone/vector';
import { getRandomItem } from '@public/shared/random';

import { VehicleSeat } from '../../../shared/vehicle/vehicle';

@Injectable()
export class TaxiMissionService {
    @Inject(Notifier)
    public notifier: Notifier;

    @Inject(PedFactory)
    public pedFactory: PedFactory;

    @Inject(NuiDispatch)
    private dispatcher: NuiDispatch;

    @Inject(OceanProvider)
    public oceanProvider: OceanProvider;

    private state: TaxiStatus = {
        horodateurDisplayed: false,
        horodateurStarted: false,
        taxiMissionInProgress: false,
        busMissionInProgress: false,
    };

    private lastLocation: Vector3 = null;
    private totalDistance = 0;
    private taxiGroupHash = AddRelationshipGroup('TAXI');

    private Npc = 0;
    private NpcBlip = 0;
    private DeliveryBlip = 0;
    private NpcTaken = false;
    private savedNpcPosition: Vector4 = null;
    private inClear = false;

    private updateState(newState: Partial<TaxiStatus>) {
        this.state = { ...this.state, ...newState };
        this.dispatcher.dispatch('taxi', 'setStatus', this.state);
    }

    private updateHorodateur() {
        const tarif = (this.totalDistance / 100.0) * HorodateurTarif;

        const horodateurData: HoradateurData = {
            distance: this.totalDistance / 1000.0,
            tarif: Math.ceil(tarif),
        };

        this.dispatcher.dispatch('taxi', 'updateHoradateur', horodateurData);
    }

    public async clearMission() {
        while (this.inClear) {
            await wait(0);
        }
        this.inClear = true;

        if (this.NpcBlip) {
            RemoveBlip(this.NpcBlip);
            this.NpcBlip = 0;
        }
        if (this.DeliveryBlip) {
            RemoveBlip(this.DeliveryBlip);
            this.DeliveryBlip = 0;
        }

        if (this.NpcTaken && this.Npc) {
            const veh = GetVehiclePedIsIn(this.Npc, false);
            let doorIndex = 2;

            for (let i = -1; i < 5; i++) {
                if (GetPedInVehicleSeat(veh, i) == this.Npc) {
                    doorIndex = i + 1;
                    break;
                }
            }

            TaskLeaveVehicle(this.Npc, veh, 0);
            this.NpcTaken = false;
            await wait(1000);
            SetVehicleDoorShut(veh, doorIndex, false);
        }

        if (this.Npc) {
            TaskWanderStandard(this.Npc, 10.0, 10);
            SetEntityAsMissionEntity(this.Npc, false, true);
            SetEntityAsNoLongerNeeded(this.Npc);
            this.Npc = 0;
        }

        this.updateState({
            taxiMissionInProgress: false,
        });

        this.inClear = false;
    }

    private validVehicle() {
        const ped = PlayerPedId();
        const veh = GetVehiclePedIsIn(ped, false);
        const model = GetEntityModel(veh);

        return AllowedTaxiModel.includes(model) && GetPedInVehicleSeat(veh, VehicleSeat.Driver) == ped;
    }

    public update() {
        if (this.state.horodateurDisplayed && !this.validVehicle()) {
            this.updateState({
                horodateurDisplayed: false,
            });
            return;
        }

        if (this.state.horodateurStarted && this.validVehicle()) {
            const start = this.lastLocation;
            this.lastLocation = GetEntityCoords(PlayerPedId()) as Vector3;

            if (start) {
                const distance = Vdist(
                    start[0],
                    start[1],
                    start[2],
                    this.lastLocation[0],
                    this.lastLocation[1],
                    this.lastLocation[2]
                );
                this.totalDistance += distance;

                this.updateHorodateur();
            }
        }
    }

    public onToggleStart() {
        this.setHorodateurStarted(!this.state.horodateurStarted);
    }

    public setHorodateurStarted(status: boolean) {
        if (!this.validVehicle()) {
            this.notifier.notify("Vous n'êtes pas dans un taxi", 'error');
            return;
        }

        this.lastLocation = GetEntityCoords(PlayerPedId()) as Vector3;
        this.updateState({
            horodateurStarted: status,
        });

        this.totalDistance = 0;
        this.updateHorodateur();
    }

    public onToggleHorodateur() {
        this.setHorodateurDisplay(!this.state.horodateurDisplayed);
    }

    public setHorodateurDisplay(status: boolean) {
        if (status && !this.validVehicle()) {
            this.notifier.notify("Vous n'êtes pas dans un taxi", 'error');
            return;
        }

        this.updateState({
            horodateurDisplayed: status,
        });
    }

    //mission pnj
    private async checkVehicle(): Promise<boolean> {
        if (!this.validVehicle()) {
            this.notifier.notify('Remontez dans le taxi ou la mission sera annulée', 'warning');
            for (let i = 0; i < 120; i++) {
                await wait(1000);
                if (this.validVehicle()) {
                    return true;
                }
            }

            this.notifier.notify('Mission annulée', 'error');
            await this.clearMission();
            return false;
        }
        return true;
    }

    public async doTaxiNpc() {
        if (!this.validVehicle()) {
            this.notifier.notify("Vous n'êtes pas dans un taxi", 'error');
            return;
        }

        if (this.state.taxiMissionInProgress || this.state.busMissionInProgress) {
            this.notifier.notify('Vous êtes déjà en mission', 'error');
            return;
        }

        await this.clearMission();

        this.updateState({
            taxiMissionInProgress: true,
        });
        const currentWaterLevel = await this.oceanProvider.getWaterLevel().then(data => data);
        const targetNPCLocation = this.savedNpcPosition
            ? this.savedNpcPosition
            : getRandomItem(NPCTakeLocations.filter(location => location[2] > currentWaterLevel[1]));

        if (!targetNPCLocation) {
            this.notifier.notify("Il n'y'a actuellement pas de client.", 'error');
            return;
        }
        this.savedNpcPosition = targetNPCLocation;

        const model = GetHashKey(getRandomItem(NpcSkins));
        this.Npc = await this.pedFactory.createPed({
            model: model,
            coords: {
                x: targetNPCLocation[0],
                y: targetNPCLocation[1],
                z: targetNPCLocation[2] - 1.0,
                w: targetNPCLocation[3],
            },
            blockevents: true,
            animDict: 'anim@amb@casino@valet_scenario@pose_d@',
            anim: 'base_a_m_y_vinewood_01',
            flag: 49,
            network: false,
            isScriptHostPed: true,
        });

        PlaceObjectOnGroundProperly(this.Npc);
        FreezeEntityPosition(this.Npc, true);

        if (this.NpcBlip) {
            RemoveBlip(this.NpcBlip);
        }

        this.NpcBlip = AddBlipForCoord(targetNPCLocation[0], targetNPCLocation[1], targetNPCLocation[2]);

        SetBlipColour(this.NpcBlip, 3);
        SetNewWaypoint(targetNPCLocation[0], targetNPCLocation[1]);

        this.loopGoToNPC(targetNPCLocation);
    }

    private async loopGoToNPC(targetNPCLocation: Vector4) {
        let hasHonked = false;
        while (!this.NpcTaken && this.state.taxiMissionInProgress) {
            const ped = PlayerPedId();
            const pos = GetEntityCoords(ped);
            const dist = Vdist(
                pos[0],
                pos[1],
                pos[2],
                targetNPCLocation[0],
                targetNPCLocation[1],
                targetNPCLocation[2]
            );

            if (!(await this.checkVehicle())) {
                return;
            }

            const veh = GetVehiclePedIsIn(ped, false);
            hasHonked = hasHonked || IsHornActive(veh);
            const requiredDist = hasHonked ? 15 : 5;

            if (dist < requiredDist) {
                if (IsVehicleStopped(veh) && this.validVehicle()) {
                    const maxSeats = GetVehicleMaxNumberOfPassengers(veh);
                    let freeSeat = maxSeats;

                    for (let i = maxSeats - 1; i > -1; i--) {
                        if (IsVehicleSeatFree(veh, i)) {
                            freeSeat = i;
                            break;
                        }
                    }

                    ClearPedTasksImmediately(this.Npc);
                    FreezeEntityPosition(this.Npc, false);
                    TaskEnterVehicle(this.Npc, veh, -1, freeSeat, 1.0, 1, 0);
                    let count = 0;
                    while (!IsPedInVehicle(this.Npc, veh, false)) {
                        if (count == 15 || dist > requiredDist) {
                            await this.clearMission();
                            this.notifier.notify('Ouvre ton véhicule la prochaine fois ?', 'error');
                            return;
                        }
                        await wait(1000);
                        TaskEnterVehicle(this.Npc, veh, -1, freeSeat, 1.0, 1, 0);
                        count = count + 1;
                    }
                    this.notifier.notify('Amenez la personne à la destination spécifiée', 'success');
                    if (this.NpcBlip) {
                        RemoveBlip(this.NpcBlip);
                        this.NpcBlip = 0;
                    }
                    const currentWaterLevel = await this.oceanProvider.getWaterLevel().then(data => data);
                    const deliveryLocation = getRandomItem(
                        NPCDeliverLocations.filter(location => location[2] > currentWaterLevel[1])
                    );

                    if (!deliveryLocation) {
                        this.notifier.notify("Il n'y'a actuellement pas de client.", 'error');
                        return;
                    }

                    if (this.DeliveryBlip) {
                        RemoveBlip(this.DeliveryBlip);
                    }
                    this.DeliveryBlip = AddBlipForCoord(deliveryLocation[0], deliveryLocation[1], deliveryLocation[2]);
                    SetBlipColour(this.DeliveryBlip, 3);
                    SetNewWaypoint(deliveryLocation[0], deliveryLocation[1]);

                    this.NpcTaken = true;
                    this.savedNpcPosition = null;
                    this.setHorodateurStarted(true);
                    this.loopGoToDestination(deliveryLocation);
                }
            }

            await wait(100);
        }
    }

    private async loopGoToDestination(deliveryLocation: Vector4) {
        while (this.NpcTaken && this.state.taxiMissionInProgress) {
            const ped = PlayerPedId();
            const pos = GetEntityCoords(ped);
            const dist = Vdist(pos[0], pos[1], pos[2], deliveryLocation[0], deliveryLocation[1], deliveryLocation[2]);

            if (!(await this.checkVehicle())) {
                return;
            }

            if (dist < 5) {
                if (IsVehicleStopped(GetVehiclePedIsIn(ped, false)) && this.validVehicle()) {
                    const veh = GetVehiclePedIsIn(ped, false);
                    if (!IsPedInVehicle(this.Npc, veh, false)) {
                        await this.clearMission();
                        this.notifier.notify("Vous n'avez pas la personne dans votre véhicule", 'error');
                        return;
                    }

                    TaskLeaveVehicle(this.Npc, veh, 0);
                    SetPedRelationshipGroupHash(this.Npc, this.taxiGroupHash[1]);
                    SetRelationshipBetweenGroups(0, this.taxiGroupHash[1], GetHashKey('PLAYER'));
                    SetRelationshipBetweenGroups(0, GetHashKey('PLAYER'), this.taxiGroupHash[1]);
                    SetEntityAsMissionEntity(this.Npc, false, true);
                    SetEntityAsNoLongerNeeded(this.Npc);
                    TriggerServerEvent(
                        ServerEvent.TAXI_NPC_PAY,
                        Math.ceil((this.totalDistance / 100.0) * HorodateurTarif)
                    );
                    this.notifier.notify('Vous avez déposé la personne', 'success');

                    await this.clearMission();
                    this.setHorodateurStarted(false);
                    break;
                }
            }
            await wait(100);
        }
    }
}
