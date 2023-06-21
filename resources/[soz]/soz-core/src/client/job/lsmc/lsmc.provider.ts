import { Once, OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { BlipFactory } from '@public/client/blip';
import { Notifier } from '@public/client/notifier';
import { NuiMenu } from '@public/client/nui/nui.menu';
import { PlayerService } from '@public/client/player/player.service';
import { PlayerWalkstyleProvider } from '@public/client/player/player.walkstyle.provider';
import { ResourceLoader } from '@public/client/resources/resource.loader';
import { TargetFactory } from '@public/client/target/target.factory';
import { wait } from '@public/core/utils';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';
import { MenuType } from '@public/shared/nui/menu';
import { Vector3 } from '@public/shared/polyzone/vector';

import { PlayerListStateService } from '../../player/player.list.state.service';

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

    @Once()
    public onStart() {
        this.blipFactory.create('LSMC', {
            name: 'Los Santos Medical Center',
            coords: { x: 356.35, y: -1416.63, z: 32.51 },
            sprite: 61,
            scale: 1.01,
        });

        this.targetFactory.createForBoxZone(
            'duty:lsmc',
            {
                center: [356.62, -1417.61, 32.51],
                length: 0.65,
                width: 0.5,
                minZ: 32.41,
                maxZ: 32.61,
                heading: 325,
            },
            [
                {
                    type: 'server',
                    event: 'QBCore:ToggleDuty',
                    icon: 'fas fa-sign-in-alt',
                    label: 'Prise de service',
                    canInteract: () => {
                        return !this.playerService.isOnDuty();
                    },
                    job: JobType.LSMC,
                },
                {
                    type: 'server',
                    event: 'QBCore:ToggleDuty',
                    icon: 'fas fa-sign-in-alt',
                    label: 'Fin de service',
                    canInteract: () => {
                        return this.playerService.isOnDuty();
                    },
                    job: JobType.LSMC,
                },
            ]
        );

        const lit_ems = [2117668672, 1631638868, -1182962909];

        this.targetFactory.createForModel(
            lit_ems,
            [
                {
                    icon: 'fas fa-bed',
                    label: "S'allonger sur le lit",
                    action: async entity => {
                        const player = PlayerPedId();
                        const coords = GetEntityCoords(entity);
                        let heading = GetEntityHeading(entity);
                        if (heading >= 180) {
                            heading = heading - 179;
                        } else {
                            heading = heading + 179;
                        }
                        SetEntityHeading(player, heading);
                        SetPedCoordsKeepVehicle(player, coords[0], coords[1], coords[2] + 0.1);
                        await this.resourceLoader.loadAnimationDictionary('anim@gangops@morgue@table@');
                        TaskPlayAnim(
                            player,
                            'anim@gangops@morgue@table@',
                            'body_search',
                            8.0,
                            2.0,
                            -1,
                            1,
                            0,
                            false,
                            false,
                            false
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
                    canInteract: entity => {
                        if (!this.playerService.isOnDuty()) {
                            return false;
                        }

                        const deadPed = this.getDeadPedInVehicle(entity);

                        return deadPed !== null;
                    },
                    action: async entity => {
                        const ped = await this.getDeadPedInVehicle(entity);
                        const coords = GetEntityCoords(PlayerPedId());

                        TriggerServerEvent(
                            ServerEvent.LSMC_TELEPORTATION,
                            GetPlayerServerId(NetworkGetPlayerIndexFromPed(ped)),
                            coords
                        );
                    },
                    job: JobType.LSMC,
                },
            ],
            2.5
        );
    }

    private getDeadPedInVehicle(entity: number) {
        const vehicleSeats = GetVehicleModelNumberOfSeats(GetEntityModel(entity));
        for (let i = -1; i < vehicleSeats - 2; i++) {
            const ped = GetPedInVehicleSeat(entity, i);

            const target = GetPlayerServerId(NetworkGetPlayerIndexFromPed(ped));

            if (!target) {
                continue;
            }

            if (this.playerListStateService.isDead(target)) {
                return ped;
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
