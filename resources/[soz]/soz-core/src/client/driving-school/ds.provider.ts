import { emitRpc } from '@public/core/rpc';
import { Feature, isFeatureEnabled } from '@public/shared/features';
import { RpcServerEvent } from '@public/shared/rpc';

import { Once, OnceStep, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { DrivingSchoolConfig, DrivingSchoolLicenseType } from '../../shared/driving-school';
import { ClientEvent, NuiEvent, ServerEvent } from '../../shared/event';
import { MenuType } from '../../shared/nui/menu';
import { Vector3 } from '../../shared/polyzone/vector';
import { BlipFactory } from '../blip';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { TargetFactory, TargetOptions } from '../target/target.factory';

@Provider()
export class DrivingSchoolProvider {
    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Once(OnceStep.Start)
    public onPlayerLoaded() {
        const secretaryPedConfig = DrivingSchoolConfig.peds.secretary;
        this.targetFactory.createForPed({
            ...secretaryPedConfig,
            freeze: true,
            invincible: true,
            blockevents: true,
            spawnNow: true,
            scenario: 'WORLD_HUMAN_STAND_IMPATIENT',
            target: {
                options: this.getTargetOptions([
                    secretaryPedConfig.coords.x,
                    secretaryPedConfig.coords.y,
                    secretaryPedConfig.coords.z,
                ]),
                distance: 2.5,
            },
        });

        const blipConfig = DrivingSchoolConfig.blip;
        this.blipFactory.create('displayDrivingSchoolBlip', {
            name: blipConfig.name,
            coords: secretaryPedConfig.coords,
            sprite: blipConfig.sprite,
            color: blipConfig.color,
            scale: blipConfig.scale,
        });
    }

    @OnNuiEvent<{ limit: number; price: number }>(NuiEvent.DrivingSchoolUpdateVehicleLimit)
    public async updateVehicleLimit({ limit, price }) {
        TriggerServerEvent(ServerEvent.DRIVING_SCHOOL_UPDATE_VEHICLE_LIMIT, limit, price);
        this.nuiMenu.closeMenu();
    }

    private getTargetOptions(position: Vector3): TargetOptions[] {
        const targetOptions: TargetOptions[] = [
            {
                label: `Carte grise`,
                icon: 'c:driving-school/voiture.png',
                blackoutGlobal: true,
                action: async () => {
                    const remainingSlots = await emitRpc<number>(RpcServerEvent.DRIVING_SCHOOL_CHECK_REMAINING_SLOTS);
                    this.nuiMenu.openMenu(
                        MenuType.DrivingSchool,
                        {
                            currentVehicleLimit: this.playerService.getPlayer().metadata.vehiclelimit,
                            remainingSlots,
                        },
                        {
                            position: {
                                position,
                                distance: 2.5,
                            },
                        }
                    );
                },
            },
        ];
        const licensesConfig = DrivingSchoolConfig.licenses;

        Object.values(licensesConfig).forEach(license => {
            if (license.licenseType == DrivingSchoolLicenseType.Boat && !isFeatureEnabled(Feature.Boat)) {
                return;
            }

            targetOptions.push({
                license: license.licenseType,
                label: `${license.label} ($${license.price})`,
                icon: license.icon,
                event: ClientEvent.DRIVING_SCHOOL_START_EXAM,
                blackoutGlobal: true,
            });
        });

        return targetOptions;
    }
}
