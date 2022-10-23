import { Command } from '../../core/decorators/command';
import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { NuiEvent, ServerEvent } from '../../shared/event';
import { MenuType } from '../../shared/nui/menu';
import { Ok } from '../../shared/result';
import { ClipboardService } from '../clipboard.service';
import { DrawService } from '../draw.service';
import { Notifier } from '../notifier';
import { InputService } from '../nui/input.service';
import { NuiMenu } from '../nui/nui.menu';
import { AdminMenuProvider } from './admin.menu.provider';

@Provider()
export class AdminMenuDeveloperProvider {
    @Inject(ClipboardService)
    private clipboard: ClipboardService;

    @Inject(DrawService)
    private draw: DrawService;

    @Inject(InputService)
    private input: InputService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(AdminMenuProvider)
    private adminMenuProvider: AdminMenuProvider;

    private showCoordinatesInterval = null;

    private isCreatingZone = false;

    @OnNuiEvent(NuiEvent.AdminCreateZone)
    public async createZone(): Promise<void> {
        if (!this.isCreatingZone) {
            this.isCreatingZone = true;
            TriggerEvent('polyzone:pzcreate', 'box', 'create_zone', ['box', 'create_zone', 1, 1]);
            this.nuiMenu.closeMenu();
        }
    }
    @Command('soz_admin_finish_create_zone', {
        description: "Valider la création d'une zone",
        keys: [
            {
                mapper: 'keyboard',
                key: 'E',
            },
        ],
    })
    public async endCreatingZone() {
        if (this.isCreatingZone) {
            this.isCreatingZone = false;
            const zone = exports['PolyZone'].EndPolyZone();
            this.clipboard.copy(
                `new BoxZone([${zone.center.x}, ${zone.center.y}, ${zone.center.z}], ${zone.length}, ${zone.width}, {
                    heading: ${zone.heading},
                    minZ: ${zone.center.z - 1},
                    maxZ: ${zone.center.z + 2},
                });`
            );
            await this.adminMenuProvider.openAdminMenu('developer');
        }
    }

    @OnNuiEvent(NuiEvent.AdminToggleNoClip)
    public async toggleNoClip(): Promise<void> {
        exports['soz-utils'].ToggleNoClipMode();
    }

    @OnNuiEvent(NuiEvent.AdminToggleShowCoordinates)
    public async toggleShowCoordinates(active: boolean): Promise<void> {
        if (!active) {
            clearInterval(this.showCoordinatesInterval);
            this.showCoordinatesInterval = null;
            return;
        }
        this.showCoordinatesInterval = setInterval(() => {
            const coords = GetEntityCoords(PlayerPedId(), true);
            const heading = GetEntityHeading(PlayerPedId()).toFixed(2);

            const x = coords[0].toFixed(2);
            const y = coords[1].toFixed(2);
            const z = coords[2].toFixed(2);

            this.draw.drawText(
                0.4,
                0.01,
                0,
                0,
                0.4,
                66,
                182,
                245,
                255,
                `~w~Ped coordinates:~b~ vector4(${x}, ${y}, ${z}, ${heading})`
            );
        }, 1);
    }

    @OnNuiEvent(NuiEvent.AdminCopyCoords)
    public async copyCoords(type: 'coords3' | 'coords4') {
        const coords = GetEntityCoords(PlayerPedId(), true);
        const heading = GetEntityHeading(PlayerPedId()).toFixed(2);

        const x = coords[0].toFixed(2);
        const y = coords[1].toFixed(2);
        const z = coords[2].toFixed(2);

        switch (type) {
            case 'coords3':
                this.clipboard.copy(`[${x}, ${y}, ${z}]`);
                break;
            case 'coords4':
                this.clipboard.copy(`[${x}, ${y}, ${z}, ${heading}]`);
                break;
        }
        this.notifier.notify('Coordonnées copiées dans le presse-papier');
    }

    @OnNuiEvent(NuiEvent.AdminChangePlayer)
    public async changePlayer(): Promise<void> {
        const citizenId = await this.input.askInput(
            {
                title: 'Citizen ID',
                defaultValue: '',
                maxCharacters: 32,
            },
            () => {
                return Ok(true);
            }
        );

        if (citizenId) {
            TriggerServerEvent(ServerEvent.ADMIN_CHANGE_PLAYER, citizenId);
        }
    }

    @OnNuiEvent(NuiEvent.AdminResetHealthData)
    public async resetHealthData(): Promise<void> {
        TriggerServerEvent(ServerEvent.QBCORE_SET_METADATA, 'thirst', 100);
        TriggerServerEvent(ServerEvent.QBCORE_SET_METADATA, 'hunger', 100);
        TriggerServerEvent(ServerEvent.QBCORE_SET_METADATA, 'alcohol', 0);
        TriggerServerEvent(ServerEvent.QBCORE_SET_METADATA, 'drug', 0);
    }
}
