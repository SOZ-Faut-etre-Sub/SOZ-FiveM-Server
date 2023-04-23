import { Inject, Injectable } from '@core/decorators/injectable';
import { PedFactory } from '@public/client/factory/ped.factory';
import { Notifier } from '@public/client/notifier';
import { NuiDispatch } from '@public/client/nui/nui.dispatch';
import { wait } from '@public/core/utils';
import { ServerEvent } from '@public/shared/event';
import {
    AllowedVehicleModel,
    HoradateurData,
    HorodateurTarif,
    NPCDeliverLocations,
    NpcSkins,
    NPCTakeLocations,
    TaxiStatus,
} from '@public/shared/job/cjr';
import { Vector4 } from '@public/shared/polyzone/vector';
import { getRandomItem } from '@public/shared/random';

@Injectable()
export class TaxiMissionService {
    @Inject(Notifier)
    public notifier: Notifier;

    @Inject(PedFactory)
    public pedFactory: PedFactory;

    @Inject(NuiDispatch)
    private dispatcher: NuiDispatch;

    private state: TaxiStatus = {
        horodateurDisplayed: false,
        horodateurStarted: false,
        missionInprogress: false,
    };

    private lastLocation = null;
    private totalDistance = 0;
    private taxiGroupHash = AddRelationshipGroup('TAXI');

    private Npc = 0;
    private NpcBlip = 0;
    private DeliveryBlip = 0;
    private NpcTaken = false;

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
        if (this.NpcBlip) {
            RemoveBlip(this.NpcBlip);
            this.NpcBlip = 0;
        }
        if (this.DeliveryBlip) {
            RemoveBlip(this.DeliveryBlip);
            this.DeliveryBlip = 0;
        }

        if (this.NpcTaken && this.Npc) {
            TaskLeaveVehicle(this.Npc, GetVehiclePedIsIn(this.Npc, false), 0);
            this.NpcTaken = false;
            await wait(1000);
        }

        if (this.Npc) {
            TaskWanderStandard(this.Npc, 10.0, 10);
            SetEntityAsMissionEntity(this.Npc, false, true);
            SetEntityAsNoLongerNeeded(this.Npc);
            this.Npc = 0;
        }

        this.updateState({
            missionInprogress: false,
        });
    }

    private validVehicle() {
        const ped = PlayerPedId();
        const veh = GetVehiclePedIsIn(ped, false);
        const model = GetEntityModel(veh);

        return AllowedVehicleModel.includes(model) && GetPedInVehicleSeat(veh, -1) == ped;
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
            this.lastLocation = GetEntityCoords(PlayerPedId());

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

        this.lastLocation = GetEntityCoords(PlayerPedId());
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
            for (let i = 0; i < 20; i++) {
                await wait(500);
                if (this.validVehicle()) {
                    return true;
                }
            }

            this.notifier.notify('Mission annulée', 'error');
            this.clearMission();
            return false;
        }
        return true;
    }

    public async doTaxiNpc() {
        if (!this.validVehicle()) {
            this.notifier.notify("Vous n'êtes pas dans un taxi", 'error');
            return;
        }

        if (this.state.missionInprogress) {
            this.notifier.notify('Vous êtes déjà en mission', 'error');
            return;
        }
        this.updateState({
            missionInprogress: true,
        });

        const targetNPCLocation = getRandomItem(NPCTakeLocations);

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
            network: true,
        });

        PlaceObjectOnGroundProperly_2(this.Npc);
        await wait(100);
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
        while (!this.NpcTaken && this.state.missionInprogress) {
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
                if (IsVehicleStopped(GetVehiclePedIsIn(ped, false)) && this.validVehicle()) {
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
                    TaskEnterVehicle(this.Npc, veh, -1, freeSeat, 1.0, 0, 0);
                    let count = 0;
                    while (!IsPedInVehicle(this.Npc, veh, false)) {
                        if (count == 15 || dist > requiredDist) {
                            this.clearMission();
                            this.notifier.notify('Ouvre ton véhicule la prochaine fois ?', 'error');
                            return;
                        }
                        await wait(1000);
                        TaskEnterVehicle(this.Npc, veh, -1, freeSeat, 1.0, 0, 0);
                        count = count + 1;
                    }
                    this.notifier.notify('Amenez la personne à la destination spécifiée', 'success');
                    if (this.NpcBlip) {
                        RemoveBlip(this.NpcBlip);
                        this.NpcBlip = 0;
                    }
                    const deliveryLocation = getRandomItem(NPCDeliverLocations);

                    if (this.DeliveryBlip) {
                        RemoveBlip(this.DeliveryBlip);
                    }
                    this.DeliveryBlip = AddBlipForCoord(deliveryLocation[0], deliveryLocation[1], deliveryLocation[2]);
                    SetBlipColour(this.DeliveryBlip, 3);
                    SetNewWaypoint(deliveryLocation[0], deliveryLocation[1]);

                    this.NpcTaken = true;
                    this.setHorodateurStarted(true);
                    this.loopGoToDestination(deliveryLocation);
                }
            }

            await wait(100);
        }
    }

    private async loopGoToDestination(deliveryLocation: Vector4) {
        while (this.NpcTaken && this.state.missionInprogress) {
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
                        this.clearMission();
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

                    this.setHorodateurStarted(false);
                    this.clearMission();
                    break;
                }
            }
            await wait(100);
        }
    }
}
