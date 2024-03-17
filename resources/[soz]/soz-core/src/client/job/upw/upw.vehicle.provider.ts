import { InputService } from '@public/client/nui/input.service';
import { NuiMenu } from '@public/client/nui/nui.menu';
import { PlayerService } from '@public/client/player/player.service';
import { TargetFactory } from '@public/client/target/target.factory';
import { DealershipType } from '@public/config/dealership';
import { Once, OnceStep } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { ServerEvent } from '@public/shared/event';
import { JobPermission, JobType } from '@public/shared/job';
import { UpwConfig } from '@public/shared/job/upw';
import { PositiveNumberValidator } from '@public/shared/nui/input';
import { MenuType } from '@public/shared/nui/menu';
import { isVehicleModelElectric } from '@public/shared/vehicle/vehicle';

import { JobService } from '../job.service';

@Provider()
export class UpwVehicleProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(JobService)
    private jobService: JobService;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    public async changerVehicleBattery(vehicle: number) {
        const vehicleNetworkId = NetworkGetNetworkIdFromEntity(vehicle);

        TriggerServerEvent(ServerEvent.UPW_CHANGE_BATTERY, vehicleNetworkId);
    }

    @Once(OnceStep.PlayerLoaded)
    public async setupUpwBattery() {
        this.targetFactory.createForAllVehicle([
            {
                icon: 'c:mechanic/car_battery.png',
                label: 'Changer la batterie',
                color: 'upw',
                action: this.changerVehicleBattery.bind(this),
                blackoutGlobal: true,
                blackoutJob: 'upw',
                item: 'lithium_battery',
                canInteract: entity => {
                    const player = this.playerService.getPlayer();

                    if (!player) {
                        return false;
                    }

                    if (IsEntityDead(entity)) {
                        return false;
                    }

                    if (!isVehicleModelElectric(GetEntityModel(entity))) {
                        return false;
                    }

                    return player.job.onduty && player.job.id === JobType.Upw;
                },
            },
        ]);
    }

    @Once(OnceStep.Start)
    public async onStart() {
        const orderZone = UpwConfig.Order.zone;
        this.targetFactory.createForBoxZone(orderZone.name, orderZone, [
            {
                label: 'Commander une voiture éléctrique',
                icon: 'c:/mechanic/order.png',
                color: 'upw',
                job: 'upw',
                blackoutJob: 'upw',
                blackoutGlobal: true,
                canInteract: () => {
                    return (
                        this.playerService.isOnDuty() &&
                        this.jobService.hasPermission(JobType.Upw, JobPermission.UpwOrder)
                    );
                },
                action: () => {
                    this.nuiMenu.openMenu(
                        MenuType.VehicleOrderMenu,
                        { dealerships: [DealershipType.Electric] },
                        {
                            position: {
                                position: UpwConfig.Order.zone.center,
                                distance: 3,
                            },
                        }
                    );
                },
            },
            {
                label: 'Prix des chargeurs',
                icon: 'c:/fuel/plug.png',
                color: 'upw',
                job: 'upw',
                blackoutJob: 'upw',
                blackoutGlobal: true,
                canInteract: () => {
                    return (
                        this.playerService.isOnDuty() &&
                        this.jobService.hasPermission(JobType.Upw, JobPermission.UpwChangePrice)
                    );
                },
                action: this.setChargerPrice.bind(this),
            },
        ]);
    }

    public async setChargerPrice() {
        const newPrice = await this.inputService.askInput(
            {
                title: 'Nouveau prix :',
                maxCharacters: 5,
                defaultValue: '1.00',
            },
            PositiveNumberValidator
        );

        if (newPrice == null) {
            return;
        }

        TriggerServerEvent(ServerEvent.UPW_SET_CHARGER_PRICE, newPrice);

        return;
    }
}
