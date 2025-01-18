import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Notifier } from '@public/client/notifier';
import { ProgressService } from '@public/client/progress.service';
import { TargetFactory } from '@public/client/target/target.factory';
import { WeaponService } from '@public/client/weapon/weapon.service';
import { Once, OnEvent } from '@public/core/decorators/event';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { getDistance, Vector3 } from '@public/shared/polyzone/vector';
import { getRandomInt } from '@public/shared/random';
import { VehicleClass } from '@public/shared/vehicle/vehicle';

const ALLOWED_WEAPON = ['weapon_knife', 'weapon_switchblade', 'weapon_dagger'];

export enum TyreBone {
    Wheel_left_front = 'wheel_lf',
    Wheel_right_front = 'wheel_rf',
    Wheel_left_rear = 'wheel_lr',
    Wheel_right_rear = 'wheel_rr',
    Wheel_left_middle_1 = 'wheel_lm1',
    Wheel_right_middle_1 = 'wheel_rm1',
    Wheel_left_middle_2 = 'wheel_lm2',
    Wheel_right_middle_2 = 'wheel_rm2',
}

const CarWheels: Record<TyreBone, number> = {
    [TyreBone.Wheel_left_front]: 0,
    [TyreBone.Wheel_right_front]: 1,
    [TyreBone.Wheel_left_middle_1]: 2,
    [TyreBone.Wheel_right_middle_1]: 3,
    [TyreBone.Wheel_left_rear]: 4,
    [TyreBone.Wheel_right_rear]: 5,
    [TyreBone.Wheel_left_middle_2]: 45,
    [TyreBone.Wheel_right_middle_2]: 47,
};
const BikeWheels: Partial<Record<TyreBone, number>> = {
    [TyreBone.Wheel_left_front]: 0,
    [TyreBone.Wheel_left_rear]: 4,
};
const TriBikeWheels: Partial<Record<TyreBone, number>> = {
    [TyreBone.Wheel_left_front]: 0,
    [TyreBone.Wheel_left_rear]: 4,
    [TyreBone.Wheel_right_rear]: 5,
};

@Provider()
export class VehicleTyreProvider {
    @Inject(WeaponService)
    private weaponService: WeaponService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Once()
    public onInit() {
        for (const bone of Object.values(TyreBone)) {
            this.targetFactory.createForBone(
                bone,
                [
                    {
                        label: 'Crever un pneu',
                        icon: 'crimi/destroy',
                        category: 'criminal',
                        canInteract: entity => {
                            const model = GetEntityModel(entity);
                            if (
                                IsThisModelABoat(model) ||
                                IsThisModelAHeli(model) ||
                                IsThisModelAJetski(model) ||
                                IsThisModelAPlane(model) ||
                                IsThisModelATrain(model)
                            ) {
                                return;
                            }

                            const weapon = this.weaponService.getCurrentWeapon();
                            if (!ALLOWED_WEAPON.includes(weapon?.name)) {
                                return false;
                            }

                            const tyreIndex = this.tyreIds(entity)[bone];
                            if (
                                IsVehicleTyreBurst(entity, tyreIndex, true) ||
                                IsVehicleTyreBurst(entity, tyreIndex, false)
                            ) {
                                return false;
                            }

                            return true;
                        },
                        action: async entity => {
                            const duration = getRandomInt(3000, 5000);
                            const { completed } = await this.progressService.progress(
                                'deflate_tire_with_weapon',
                                'Vous percez le pneu...',
                                duration,
                                {
                                    dictionary: 'anim@amb@clubhouse@tutorial@bkr_tut_ig3@',
                                    name: 'machinic_loop_mechandplayer',
                                    options: {
                                        repeat: true,
                                    },
                                }
                            );
                            if (!completed) {
                                return;
                            }

                            if (
                                getDistance(
                                    GetWorldPositionOfEntityBone(
                                        entity,
                                        GetEntityBoneIndexByName(entity, bone)
                                    ) as Vector3,
                                    GetEntityCoords(PlayerPedId()) as Vector3
                                ) > 2.5
                            ) {
                                this.notifier.error('Le véhicule est trop loin');
                                return;
                            }

                            const tyreIndex = this.tyreIds(entity)[bone];
                            if (
                                IsVehicleTyreBurst(entity, tyreIndex, true) ||
                                IsVehicleTyreBurst(entity, tyreIndex, false)
                            ) {
                                return false;
                            }

                            const vehicleNetworkId = NetworkGetNetworkIdFromEntity(entity);
                            TriggerServerEvent(ServerEvent.VEHICLE_BURST_TYRE_TO_OWNER, vehicleNetworkId, tyreIndex);
                        },
                    },
                ],
                1.3
            );
        }
    }

    @OnEvent(ClientEvent.VEHICLE_BURST_TYRE)
    public onCrimiBurstTyre(vehicleNetworkId: number, index: number) {
        SetVehicleTyreBurst(NetToVeh(vehicleNetworkId), index, false, 1000);
    }

    private tyreIds(veh: number) {
        const model = GetEntityModel(veh);
        if (IsThisModelABike(model)) {
            return BikeWheels;
        }
        if (IsThisModelAQuadbike(model) && GetVehicleClass(veh) == VehicleClass.Motorcycles) {
            return TriBikeWheels;
        }
        return CarWheels;
    }
}
