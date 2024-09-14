import { emitRpc } from '@public/core/rpc';
import { Feature, isFeatureEnabled } from '@public/shared/features';
import { RpcServerEvent } from '@public/shared/rpc';

import { Once, OnceStep, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { TaxType } from '../../shared/bank';
import { DrivingSchoolConfig, DrivingSchoolLicense, DrivingSchoolLicenseType } from '../../shared/driving-school';
import { ClientEvent, NuiEvent, ServerEvent } from '../../shared/event';
import { MenuType } from '../../shared/nui/menu';
import { Vector3, Vector4 } from '../../shared/polyzone/vector';
import { TargetOption } from '../../shared/target';
import { BlipFactory } from '../blip';
import { Notifier } from '../notifier';
import { NuiMenu } from '../nui/nui.menu';
import { PlayerService } from '../player/player.service';
import { TaxRepository } from '../repository/tax.repository';
import { TargetFactory } from '../target/target.factory';

@Provider()
export class DrivingSchoolProvider {
    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(TaxRepository)
    private taxRepository: TaxRepository;

    @Inject(NuiMenu)
    private nuiMenu: NuiMenu;

    @Inject(Notifier)
    private notifier: Notifier;

    @Once(OnceStep.RepositoriesLoaded)
    public setupDrivingSchool() {
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

    private getTargetOptions(position: Vector3): TargetOption[] {
        const targetOptions: TargetOption[] = [
            {
                label: `Carte grise`,
                icon: 'driving-school/voiture',
                category: 'citizen',
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

            const price = this.taxRepository.getPriceWithTax(license.price, TaxType.VEHICLE);

            targetOptions.push({
                label: `${license.label}`,
                subLabel: `$${price}`,
                icon: license.icon,
                blackoutGlobal: true,
                category: 'citizen',
                action: () => {
                    const lData: DrivingSchoolLicense = DrivingSchoolConfig.licenses[license.licenseType];

                    if (!lData) {
                        this.notifier.notify("Impossible de démarrer l'examen", 'error');
                        return;
                    }

                    const spawnPoint = this.getSpawnPoint(lData.vehicle.spawnPoints);

                    if (!spawnPoint) {
                        this.notifier.notify(
                            "Parking encombré, l'instructeur ne peut pas garer le véhicule d'examen.",
                            'error'
                        );
                        return;
                    }

                    TriggerServerEvent(ServerEvent.DRIVING_SCHOOL_PLAYER_PAY, lData.licenseType, spawnPoint);
                    TriggerEvent(ClientEvent.DRIVING_SCHOOL_START_EXAM);
                },
            });
        });

        return targetOptions;
    }

    private getSpawnPoint(points: Vector4[]) {
        for (const point of points) {
            const [x, y, z] = point;
            if (!IsPositionOccupied(x, y, z, 0.25, false, true, true, false, false, 0, false)) {
                return point;
            }
        }
    }
}
