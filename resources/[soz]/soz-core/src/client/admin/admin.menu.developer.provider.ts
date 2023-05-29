import { Command } from '../../core/decorators/command';
import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { ClientEvent, NuiEvent, ServerEvent } from '../../shared/event';
import { Font } from '../../shared/hud';
import { Ok } from '../../shared/result';
import { ClipboardService } from '../clipboard.service';
import { DrawService } from '../draw.service';
import { Notifier } from '../notifier';
import { InputService } from '../nui/input.service';
import { NuiMenu } from '../nui/nui.menu';
import { VehicleConditionProvider } from '../vehicle/vehicle.condition.provider';

@Provider()
export class AdminMenuDeveloperProvider {
    @Inject(VehicleConditionProvider)
    private vehicleConditionProvider: VehicleConditionProvider;

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

    public showCoordinates = false;

    public showMileage = false;

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
                `new BoxZone([${zone.center.x.toFixed(2)}, ${zone.center.y.toFixed(2)}, ${zone.center.z.toFixed(
                    2
                )}], ${zone.length.toFixed(2)}, ${zone.width.toFixed(2)}, {
                    heading: ${zone.heading.toFixed(2)},
                    minZ: ${(zone.center.z - 1.0).toFixed(2)},
                    maxZ: ${(zone.center.z + 2.0).toFixed(2)},
                });`
            );

            TriggerEvent(ClientEvent.ADMIN_OPEN_MENU, 'developer');
        }
    }

    @OnNuiEvent(NuiEvent.AdminToggleNoClip)
    public async toggleNoClip(): Promise<void> {
        exports['soz-utils'].ToggleNoClipMode();
    }

    public isIsNoClipMode(): boolean {
        return exports['soz-utils'].IsNoClipMode();
    }

    @OnNuiEvent(NuiEvent.AdminToggleShowCoordinates)
    public async toggleShowCoordinates(active: boolean): Promise<void> {
        this.showCoordinates = active;
    }

    @Tick()
    public async showCoords(): Promise<void> {
        if (!this.showCoordinates) {
            return;
        }

        const coords = GetEntityCoords(PlayerPedId(), true);
        const heading = GetEntityHeading(PlayerPedId()).toFixed(2);

        const x = coords[0].toFixed(2);
        const y = coords[1].toFixed(2);
        const z = coords[2].toFixed(2);

        this.draw.drawText(`~w~Ped coordinates:~b~ vector4(${x}, ${y}, ${z}, ${heading})`, [0.4, 0.015], {
            font: Font.ChaletComprimeCologne,
            size: 0.4,
            color: [66, 182, 245, 255],
        });
    }

    @OnNuiEvent(NuiEvent.AdminToggleShowMileage)
    public async toggleShowMileage(active: boolean): Promise<void> {
        this.showMileage = active;
    }

    @Tick()
    public async showMileageTick(): Promise<void> {
        if (!this.showMileage) {
            return;
        }

        const ped = PlayerPedId();
        const vehicle = GetVehiclePedIsIn(ped, false);
        if (vehicle) {
            const networkId = NetworkGetNetworkIdFromEntity(vehicle);
            const condition = this.vehicleConditionProvider.getVehicleCondition(networkId);

            this.draw.drawText(`~w~Vehicle mileage :~b~ ${(condition.mileage / 1000).toFixed(2)}`, [0.4, 0.002], {
                font: Font.ChaletComprimeCologne,
                size: 0.4,
                color: [66, 182, 245, 255],
            });

            const [isTrailerExists, trailerEntity] = GetVehicleTrailerVehicle(vehicle);

            if (isTrailerExists) {
                const trailerNetworkId = NetworkGetNetworkIdFromEntity(trailerEntity);
                const trailerCondition = this.vehicleConditionProvider.getVehicleCondition(trailerNetworkId);

                this.draw.drawText(
                    `~w~Trailer mileage :~b~ ${(trailerCondition.mileage / 1000).toFixed(2)}`,
                    [0.6, 0.002],
                    {
                        font: Font.ChaletComprimeCologne,
                        size: 0.4,
                        color: [66, 182, 245, 255],
                    }
                );
            }
        }
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
