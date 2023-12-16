import { NotificationPoliceLogoType, NotificationPoliceType, NotificationType } from '@public/shared/notification';

import { Command } from '../../core/decorators/command';
import { OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { NuiEvent, ServerEvent } from '../../shared/event';
import { Font } from '../../shared/hud';
import { Ok } from '../../shared/result';
import { ClipboardService } from '../clipboard.service';
import { DrawService } from '../draw.service';
import { GetObjectList, GetPedList, GetPickupList, GetVehicleList } from '../enumerate';
import { Notifier } from '../notifier';
import { InputService } from '../nui/input.service';
import { NuiZoneProvider } from '../nui/nui.zone.provider';
import { ObjectProvider } from '../object/object.provider';
import { NoClipProvider } from '../utils/noclip.provider';
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

    @Inject(NuiZoneProvider)
    private nuiZoneProvider: NuiZoneProvider;

    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

    @Inject(NoClipProvider)
    private noClipProvider: NoClipProvider;

    public showCoordinates = false;

    public showMileage = false;

    @OnNuiEvent(NuiEvent.AdminCreateZone)
    public async createZone(): Promise<void> {
        const zone = await this.nuiZoneProvider.askZone();

        this.clipboard.copy(
            `new BoxZone([${zone.center[0].toFixed(2)}, ${zone.center[1].toFixed(2)}, ${zone.center[2].toFixed(
                2
            )}], ${zone.length.toFixed(2)}, ${zone.width.toFixed(2)}, {
                heading: ${zone.heading.toFixed(2)},
                minZ: ${(zone.minZ || zone.center[2] - 1.0).toFixed(2)},
                maxZ: ${(zone.maxZ || zone.center[2] + 2.0).toFixed(2)},
            });`
        );
    }

    @OnNuiEvent(NuiEvent.AdminToggleNoClip)
    public async toggleNoClip(): Promise<void> {
        this.noClipProvider.ToggleNoClipMode();
    }

    public isIsNoClipMode(): boolean {
        return this.noClipProvider.IsNoClipMode();
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
            this.draw.drawText(`~w~fuel :~b~ ${condition.fuelLevel.toFixed(2)}`, [0.8, 0.002], {
                font: Font.ChaletComprimeCologne,
                size: 0.4,
                color: [66, 182, 245, 255],
            });
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
            TriggerServerEvent(ServerEvent.ADMIN_SWITCH_CHARACTER, citizenId);
        }
    }

    @OnNuiEvent(NuiEvent.AdminTriggerNotification)
    public async triggerNotification(type: 'basic' | 'advanced' | 'police') {
        const notificationStyle = await this.input.askInput(
            {
                title: 'Notification style',
                defaultValue: 'info',
                maxCharacters: 32,
            },
            () => {
                return Ok(true);
            }
        );

        if (notificationStyle) {
            // this.notifier.notify('Message de notification' + style, notificationStyle as NotificationType);
            if (type === 'basic') {
                this.notifier.notify(
                    `Message de notification ${notificationStyle}`,
                    notificationStyle as NotificationType
                );
            }
            if (type === 'advanced') {
                await this.notifier.notifyAdvanced({
                    title: 'Titre test',
                    subtitle: 'Sous-titre de test',
                    message: 'Message de notification',
                    image: '',
                    style: notificationStyle as NotificationType,
                    delay: 5000,
                });
            }
            if (type === 'police') {
                await this.notifier.notifyPolice({
                    message: 'Message de notification',
                    policeStyle: notificationStyle as NotificationPoliceType,
                    style: 'info' as NotificationType,
                    delay: 5000,
                    title: 'Titre test',
                    hour: '00:24',
                    logo: 'bcso' as NotificationPoliceLogoType,
                    notificationId: 777,
                });
            }
        }
    }

    @OnNuiEvent(NuiEvent.AdminResetHealthData)
    public async resetHealthData(): Promise<void> {
        TriggerServerEvent(ServerEvent.QBCORE_SET_METADATA, 'thirst', 100);
        TriggerServerEvent(ServerEvent.QBCORE_SET_METADATA, 'hunger', 100);
        TriggerServerEvent(ServerEvent.QBCORE_SET_METADATA, 'alcohol', 0);
        TriggerServerEvent(ServerEvent.QBCORE_SET_METADATA, 'drug', 0);
    }

    @Command('debug-entity')
    public async debugObjects(): Promise<void> {
        const objects = GetObjectList();
        const peds = GetPedList();
        const vehicles = GetVehicleList();
        const pickups = GetPickupList();

        let countObjects = 0,
            countObjectsNetworked = 0,
            countPeds = 0,
            countPedsNetworked = 0,
            countVehicles = 0,
            countVehiclesNetworked = 0,
            countPickups = 0,
            countPickupsNetworked = 0;

        for (const object of objects) {
            countObjects++;
            if (NetworkGetEntityIsNetworked(object)) {
                countObjectsNetworked++;
            }
        }

        for (const ped of peds) {
            countPeds++;
            if (NetworkGetEntityIsNetworked(ped)) {
                countPedsNetworked++;
            }
        }

        for (const vehicle of vehicles) {
            countVehicles++;
            if (NetworkGetEntityIsNetworked(vehicle)) {
                countVehiclesNetworked++;
            }
        }

        for (const pickup of pickups) {
            countPickups++;
            if (NetworkGetEntityIsNetworked(pickup)) {
                countPickupsNetworked++;
            }
        }

        console.log(
            `Objects : ${countObjects} total, ${
                countObjects - countObjectsNetworked
            } not networked, ${countObjectsNetworked} networked, ${GetMaxNumNetworkObjects()} max networked`
        );
        console.log(
            `Peds : ${countPeds} total, ${
                countPeds - countPedsNetworked
            } not networked, ${countPedsNetworked} networked, ${GetMaxNumNetworkPeds()} max networked`
        );
        console.log(
            `Vehicles : ${countVehicles} total, ${
                countVehicles - countVehiclesNetworked
            } not networked, ${countVehiclesNetworked} networked, ${GetMaxNumNetworkVehicles()} max networked`
        );
        console.log(
            `Pikcups : ${countPickups} total, ${
                countPickups - countPickupsNetworked
            } not networked, ${countPickupsNetworked} networked, ${GetMaxNumNetworkPickups()} max networked`
        );
        console.log(`Object from soz : ${this.objectProvider.getLoadedObjectsCount()} total`);
    }
}
