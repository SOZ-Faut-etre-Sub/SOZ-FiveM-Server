import { Once, OnceStep, OnEvent, OnNuiEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Notifier } from '@public/client/notifier';
import { ResourceLoader } from '@public/client/repository/resource.loader';
import { VehicleRadarProvider } from '@public/client/vehicle/vehicle.radar.provider';
import { ClientEvent, NuiEvent, ServerEvent } from '@public/shared/event';
import { JobPermission, JobType } from '@public/shared/job';
import { MenuType } from '@public/shared/nui/menu';

import { BlipFactory } from '../../blip';
import { NuiMenu } from '../../nui/nui.menu';
import { PlayerService } from '../../player/player.service';
import { TargetFactory } from '../../target/target.factory';
import { JobPermissionService } from '../job.permission.service';
import { JobService } from '../job.service';

@Provider()
export class MandatoryProvider {
    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(VehicleRadarProvider)
    private vehicleRadarProvider: VehicleRadarProvider;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(JobPermissionService)
    private jobPermissionService: JobPermissionService;

    @Inject(JobService)
    private jobService: JobService;

    private state = {
        radar: false,
    };

    @Once(OnceStep.PlayerLoaded)
    public setupMdrJob() {
        this.createBlips();

        this.targetFactory.createForBoxZone(
            'mdr:duty',
            {
                center: [-553.85, -185.33, 38.22],
                length: 1.0,
                width: 1.0,
                minZ: 37.22,
                maxZ: 40.22,
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
                    job: JobType.MDR,
                },
                {
                    type: 'server',
                    event: 'QBCore:ToggleDuty',
                    icon: 'fas fa-sign-in-alt',
                    label: 'Fin de service',
                    canInteract: () => {
                        return this.playerService.isOnDuty();
                    },
                    job: JobType.MDR,
                },
                {
                    icon: 'fas fa-users',
                    label: 'Employé(e)s en service',
                    action: () => {
                        TriggerServerEvent('QBCore:GetEmployOnDuty');
                    },
                    canInteract: () => {
                        const player = this.playerService.getPlayer();
                        return (
                            this.playerService.isOnDuty() &&
                            this.jobService.hasPermission(player.job.id, JobPermission.OnDutyView)
                        );
                    },
                    job: JobType.MDR,
                },
            ]
        );

        this.targetFactory.createForBoxZone(
            'mdr:wash',
            {
                center: [240.9, -1097.43, 36.13],
                length: 1.4,
                width: 1.0,
                heading: 0,
                minZ: 35.63,
                maxZ: 36.63,
            },
            [
                {
                    icon: 'c:stonk/collecter.png',
                    label: 'Réhabilitation des billets',
                    canInteract: () => {
                        return (
                            this.playerService.isOnDuty() &&
                            this.jobPermissionService.hasPermission(JobType.MDR, JobPermission.MdrMarkedMoneyCleaning)
                        );
                    },
                    job: JobType.MDR,
                    action: () => {
                        TriggerServerEvent(ServerEvent.MDR_MONEY_CLEANING);
                    },
                    blackoutJob: JobType.MDR,
                    blackoutGlobal: true,
                },
            ]
        );
    }

    @OnEvent(ClientEvent.JOBS_MDR_OPEN_SOCIETY_MENU)
    public onOpenSocietyMenu() {
        if (this.nuiMenu.getOpened() === MenuType.MandatoryJobMenu) {
            this.nuiMenu.closeMenu();
            return;
        }

        this.nuiMenu.openMenu(MenuType.MandatoryJobMenu, {
            state: this.state,
            onDuty: this.playerService.isOnDuty(),
        });
    }

    private createBlips() {
        this.blipFactory.create('jobs:mdr', {
            name: 'Mandatory',
            coords: { x: -550.72, y: -194.66, z: 38.87 },
            sprite: 807,
            scale: 1.2,
        });
        this.blipFactory.create('jobs:mdr-court', {
            name: 'Mandatory',
            coords: { x: 243.08, y: -1087.77, z: 28.84 },
            sprite: 807,
            scale: 1.2,
        });
    }

    @OnNuiEvent(NuiEvent.ToggleRadar)
    public toogleRadar(value: boolean): Promise<void> {
        this.state.radar = value;
        this.vehicleRadarProvider.toggleBlip(value);
        return;
    }

    @OnNuiEvent(NuiEvent.RedCall)
    public redCall(): Promise<void> {
        const ped = PlayerPedId();
        const coords = GetEntityCoords(ped);
        const [street, street2] = GetStreetNameAtCoord(coords[0], coords[1], coords[2]);

        if (IsWarningMessageActive() || GetWarningMessageTitleHash() != 1246147334) {
            let name = GetStreetNameFromHashKey(street);
            if (street2) {
                name += ' et ' + GetStreetNameFromHashKey(street2);
            }

            TriggerEvent(
                'police:client:RedCall',
                '555-POLICE',
                `Code Rouge !!! Un membre de Mandatory a besoin d'aide vers ${name}`,
                `Code Rouge !!! Un membre de Mandatory a besoin d'aide vers <span {class}>${name}</span>`
            );
        }

        return;
    }

    @OnEvent(ClientEvent.MDR_USE_TICKET)
    public useTicket(dlc: string) {
        const [player, distance] = this.playerService.getClosestPlayer();

        if (player != -1 && distance < 2.5) {
            const animDict = 'mp_common';
            this.resourceLoader.loadAnimationDictionary(animDict);
            TaskPlayAnim(PlayerPedId(), animDict, 'givetake2_a', 8.0, 8.0, -1, 0, 0, true, false, true);
            const target = GetPlayerServerId(player);
            TriggerServerEvent(ServerEvent.MDR_SHOW_TICKET, target, dlc);
        } else {
            this.notifier.notify("Il n'y a personne à proximité", 'error');
        }
    }
}
