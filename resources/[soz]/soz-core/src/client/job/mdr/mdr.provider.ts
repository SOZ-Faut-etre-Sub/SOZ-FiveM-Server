import { Once, OnceStep, OnEvent, OnNuiEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Notifier } from '@public/client/notifier';
import { ResourceLoader } from '@public/client/resources/resource.loader';
import { VehicleRadarProvider } from '@public/client/vehicle/vehicle.radar.provider';
import { ClientEvent, NuiEvent, ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';
import { MenuType } from '@public/shared/nui/menu';

import { BlipFactory } from '../../blip';
import { InventoryManager } from '../../inventory/inventory.manager';
import { ItemService } from '../../item/item.service';
import { NuiMenu } from '../../nui/nui.menu';
import { PlayerService } from '../../player/player.service';
import { TargetFactory } from '../../target/target.factory';

@Provider()
export class MandatoryProvider {
    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(ItemService)
    private itemService: ItemService;

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

    private state = {
        radar: false,
    };

    @Once(OnceStep.PlayerLoaded)
    public onPlayerLoaded() {
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
                `Code Rouge !!! Un membre de Mandatory a besoin d'aide vers ${name}`
            );
        }

        return;
    }

    @OnEvent(ClientEvent.MDR_USE_TICKET)
    public useTicket(dlc: string) {
        const [player, distance] = this.playerService.getClosestPlayer();

        if (player && distance < 2.5) {
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
