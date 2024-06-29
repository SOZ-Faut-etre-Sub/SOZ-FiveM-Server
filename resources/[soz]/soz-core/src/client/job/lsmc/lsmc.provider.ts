import { Once, OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { AnimationService } from '@public/client/animation/animation.service';
import { BlipFactory } from '@public/client/blip';
import { Notifier } from '@public/client/notifier';
import { NuiMenu } from '@public/client/nui/nui.menu';
import { PlayerService } from '@public/client/player/player.service';
import { PlayerWalkstyleProvider } from '@public/client/player/player.walkstyle.provider';
import { ProgressService } from '@public/client/progress.service';
import { ResourceLoader } from '@public/client/repository/resource.loader';
import { TargetFactory } from '@public/client/target/target.factory';
import { VehicleLockProvider } from '@public/client/vehicle/vehicle.lock.provider';
import { wait } from '@public/core/utils';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';
import { MenuType } from '@public/shared/nui/menu';
import { Vector3 } from '@public/shared/polyzone/vector';
import { SEATS_CONFIG } from '@public/shared/vehicle/vehicle';

import { PlayerListStateService } from '../../player/player.list.state.service';
import { PolicePlayerProvider } from '../police/police.player.provider';

type LSMCBed = {
    model: number;
    offset: Vector3;
    rotation: number;
};

const lsmcBeds: LSMCBed[] = [
    {
        model: 2117668672,
        offset: [0, 0, 0.22],
        rotation: 180,
    },
    {
        model: 1631638868,
        offset: [0, 0, 0.22],
        rotation: 180,
    },
    {
        model: -1182962909,
        offset: [0, -0.1, 0.9],
        rotation: 0,
    },
    {
        model: GetHashKey('soz_lsmc_operationrm_operation_table'),
        offset: [0, -0.2, -0.13],
        rotation: 0,
    },
    {
        model: GetHashKey('soz_lsmc_operationrm_irm'),
        offset: [-1, 0.6, -0.13],
        rotation: -90,
    },
    {
        model: 1615299850,
        offset: [0, 0, 0.22],
        rotation: 0,
    },
    {
        model: 1728397219,
        offset: [0, 0, 0.22],
        rotation: 0,
    },
    {
        model: 1298129707, // bed LSMC North
        offset: [0, 0, 0.22],
        rotation: 180,
    },
    {
        model: -1367355192, // surgery LSMC North
        offset: [-0.1, 0.4, -0.7],
        rotation: 5,
    },
];

@Provider()
export class LSMCProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(PlayerService)
    public playerService: PlayerService;

    @Inject(ResourceLoader)
    public resourceLoader: ResourceLoader;

    @Inject(Notifier)
    public notifier: Notifier;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(PlayerWalkstyleProvider)
    private playerWalkstyleProvider: PlayerWalkstyleProvider;

    @Inject(PlayerListStateService)
    private playerListStateService: PlayerListStateService;

    @Inject(VehicleLockProvider)
    private vehicleLockProvider: VehicleLockProvider;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(PolicePlayerProvider)
    private policePlayerProvider: PolicePlayerProvider;

    @Once()
    public onStart() {
        this.blipFactory.create('LSMC', {
            name: 'Los Santos Medical Center',
            coords: { x: 356.35, y: -1416.63, z: 32.51 },
            sprite: 61,
            scale: 1.01,
        });

        this.blipFactory.create('LSMC', {
            name: 'Los Santos Medical Center',
            coords: { x: 1828.51, y: 3673.4, z: 34.28 },
            sprite: 61,
            scale: 1.01,
        });

        this.targetFactory.createForModel(
            lsmcBeds.map(bed => bed.model),
            [
                {
                    icon: 'fas fa-bed',
                    label: "S'allonger sur le lit",
                    action: async entity => {
                        this.onBed(entity);
                    },
                },
                {
                    icon: 'c:ems/stretcher.png',
                    label: 'Allonger sur le lit',
                    canInteract: () => {
                        const state = this.playerService.getState();
                        return state.isEscorting;
                    },
                    action: async entity => {
                        TriggerServerEvent(
                            ServerEvent.LSMC_BED_PUT_ON,
                            GetEntityModel(entity),
                            GetEntityCoords(entity)
                        );
                    },
                },
            ],
            2.5
        );

        this.targetFactory.createForAllVehicle(
            [
                {
                    label: 'Extraire le mort',
                    icon: 'c:ems/sortir.png',
                    job: {
                        [JobType.LSMC]: 0,
                        [JobType.LSPD]: 0,
                        [JobType.BCSO]: 0,
                        [JobType.LSCS]: 0,
                        [JobType.SASP]: 0,
                        [JobType.FBI]: 0,
                    },
                    canInteract: entity => {
                        if (!this.playerService.isOnDuty()) {
                            return false;
                        }

                        const deadPed = this.getDeadPedInVehicle(entity);

                        return deadPed !== null;
                    },
                    action: async entity => {
                        const [ped, place] = this.getDeadPedInVehicle(entity);
                        const playerPed = PlayerPedId();

                        const seat = Object.values(SEATS_CONFIG).find(elem => elem.seatIndex == place);

                        const targetPedCoords =
                            seat && seat.doorBone
                                ? (GetWorldPositionOfEntityBone(
                                      entity,
                                      GetEntityBoneIndexByName(entity, seat.doorBone)
                                  ) as Vector3)
                                : seat && seat.seatBone
                                ? GetWorldPositionOfEntityBone(entity, GetEntityBoneIndexByName(entity, seat.seatBone))
                                : GetEntityCoords(ped);

                        await this.animationService.walkToCoordsAvoidObstacles(targetPedCoords as Vector3, 10000);
                        TaskTurnPedToFaceEntity(playerPed, entity, 1000);
                        await wait(1000);

                        if (
                            seat.doorBone &&
                            !IsVehicleDoorDamaged(entity, place + 1) &&
                            !this.vehicleLockProvider.isVehOpen(entity)
                        ) {
                            const { completed } = await this.progressService.progress(
                                'ded_extract',
                                'Désincarcération  en cours ...',
                                20000,
                                {
                                    task: 'world_human_welding',
                                },
                                {
                                    useAnimationService: true,
                                }
                            );

                            if (!completed) {
                                return;
                            }

                            TriggerServerEvent(ServerEvent.VEHICLE_BREAK_DOOR, VehToNet(entity), place + 1);
                        }

                        if (seat.doorIndex != null && seat.doorIndex <= 0) {
                            this.vehicleLockProvider.setLockTempDisabled(true);
                            TaskEnterVehicle(playerPed, entity, 0.8, place, 1.0, 8, 0);
                            await wait(2000);
                            ClearPedTasksImmediately(playerPed);
                            this.vehicleLockProvider.setLockTempDisabled(false);
                        }

                        const coords = GetEntityCoords(playerPed);
                        TriggerServerEvent(
                            ServerEvent.LSMC_TELEPORTATION,
                            GetPlayerServerId(NetworkGetPlayerIndexFromPed(ped)),
                            coords
                        );
                    },
                },
                {
                    label: 'Faire monter',
                    icon: 'c:ems/sortir.png',
                    canInteract: entity => {
                        if (!this.vehicleLockProvider.isVehOpen(entity)) {
                            return false;
                        }

                        const state = this.playerService.getState();
                        return state.isEscorting;
                    },
                    action: async entity => {
                        TriggerServerEvent(ServerEvent.LSMC_VEH_PUT_ON, VehToNet(entity));
                    },
                },
            ],
            2.5
        );
    }

    @OnEvent(ClientEvent.LSMC_BED_PUT_ON)
    public async onPutOnBed(model: number, coords: Vector3) {
        await this.policePlayerProvider.removeEscorted();
        const entity = GetClosestObjectOfType(coords[0], coords[1], coords[2], 3.0, model, false, false, false);

        if (entity) {
            this.onBed(entity);
        }
    }

    private async onBed(entity: number) {
        const player = PlayerPedId();
        const model = GetEntityModel(entity);
        const bedType = lsmcBeds.find(bed => bed.model == model);

        const coords = GetOffsetFromEntityInWorldCoords(
            entity,
            bedType.offset[0],
            bedType.offset[1],
            bedType.offset[2]
        );
        const heading = GetEntityHeading(entity) - bedType.rotation;
        SetEntityHeading(player, heading);
        SetPedCoordsKeepVehicle(player, coords[0], coords[1], coords[2] + 0.1);

        this.animationService.playAnimation({
            base: {
                dictionary: 'anim@gangops@morgue@table@',
                name: 'body_search',
                blendInSpeed: 8.0,
                blendOutSpeed: 2.0,
                options: {
                    repeat: true,
                },
            },
        });
    }

    @OnEvent(ClientEvent.LSMC_VEH_PUT_ON)
    public async onPutOnVeh(netId: number) {
        await this.policePlayerProvider.removeEscorted();
        const veh = NetToVeh(netId);
        const ped = PlayerPedId();

        const closestSeat = this.vehicleLockProvider.getClosestSeat(ped, veh);
        TaskEnterVehicle(ped, veh, 1.0, closestSeat, 1.0, 16, 0);
    }

    private getDeadPedInVehicle(entity: number) {
        const vehicleSeats = GetVehicleModelNumberOfSeats(GetEntityModel(entity));
        for (let i = -1; i < vehicleSeats; i++) {
            const ped = GetPedInVehicleSeat(entity, i);

            const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(ped));

            if (!target) {
                continue;
            }

            if (this.playerListStateService.isDead(target)) {
                return [ped, i];
            }
        }

        return null;
    }

    @OnEvent(ClientEvent.LSMC_TELEPORTATION)
    public async onTeleportation(coords: Vector3) {
        StartPlayerTeleport(PlayerId(), coords[0], coords[1], coords[2], 0.0, false, true, true);
        await wait(1000);
        ClearPedTasksImmediately(PlayerPedId());
    }

    @OnEvent(ClientEvent.JOBS_LSMC_OPEN_SOCIETY_MENU)
    public onOpenSocietyMenu() {
        if (this.nuiMenu.getOpened() === MenuType.LsmcJobMenu) {
            this.nuiMenu.closeMenu();
            return;
        }

        this.nuiMenu.openMenu(MenuType.LsmcJobMenu, {
            onDuty: this.playerService.isOnDuty(),
        });
    }

    @OnEvent(ClientEvent.LSMC_HEAL)
    public onHeal(value: number) {
        const ped = PlayerPedId();
        SetEntityHealth(ped, GetEntityHealth(ped) + value);
        this.notifier.notify(`Tu as été soigné.`);
        this.playerWalkstyleProvider.updateWalkStyle('injury', null);
    }
}
