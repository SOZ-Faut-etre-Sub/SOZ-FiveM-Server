import { PlayerVehicleState } from '@public/shared/vehicle/player.vehicle';

import { On, Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { DrivingSchoolConfig, DrivingSchoolLicenseType } from '../../shared/driving-school';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { Vector4 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { PrismaService } from '../database/prisma.service';
import { Notifier } from '../notifier';
import { PlayerMoneyService } from '../player/player.money.service';
import { PlayerPositionProvider } from '../player/player.position.provider';
import { PlayerService } from '../player/player.service';
import { VehicleSpawner } from '../vehicle/vehicle.spawner';

@Provider()
export class DrivingSchoolProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(VehicleSpawner)
    private vehicleSpawner: VehicleSpawner;

    @Inject(PlayerPositionProvider)
    private playerPositionProvider: PlayerPositionProvider;

    @Once()
    public onStart() {
        this.playerPositionProvider.registerZone(
            DrivingSchoolConfig.playerDefaultLocationName,
            DrivingSchoolConfig.playerDefaultLocation
        );
    }

    @On(ServerEvent.DRIVING_SCHOOL_PLAYER_PAY)
    public makePlayerPay(source: number, licenseType: DrivingSchoolLicenseType, spawnPoint: Vector4) {
        const lData = DrivingSchoolConfig.licenses[licenseType];
        if (!lData || typeof lData.price !== 'number') {
            return;
        }

        if (!this.playerMoneyService.remove(source, lData.price)) {
            this.notifier.notify(source, "Vous n'avez pas assez d'argent", 'error');
            return;
        }

        const spawnName = 'PERMIS_SPAWN_POINT_' + source;
        this.playerPositionProvider.registerZone(spawnName, spawnPoint);

        TriggerClientEvent(ClientEvent.DRIVING_SCHOOL_SETUP_EXAM, source, licenseType, spawnPoint, spawnName);
    }

    @On(ServerEvent.DRIVING_SCHOOL_UPDATE_LICENSE)
    public updatePlayerLicense(source: number, licenseType: DrivingSchoolLicenseType) {
        const license = DrivingSchoolConfig.licenses[licenseType];

        if (!license) {
            this.notifier.notify(source, 'Erreur lors de la délivrance de votre permis', 'error');

            return;
        }

        this.playerService.addLicence(source, license);
        this.notifier.notify(source, `Félicitations ! Vous venez d'obtenir votre ${license.label}`, 'success');
    }

    @Rpc(RpcServerEvent.DRIVING_SCHOOL_SPAWN_VEHICLE)
    public async spawnExamVehicle(source: number, model: string) {
        return await this.vehicleSpawner.spawnTemporaryVehicle(source, model);
    }

    @On(ServerEvent.DRIVING_SCHOOL_UPDATE_VEHICLE_LIMIT)
    public async updateVehicleLimit(source: number, limit: number, price: number) {
        if (!this.playerMoneyService.remove(source, price, 'money')) {
            this.notifier.notify(source, "Vous n'avez pas assez d'argent", 'error');
            return;
        }

        this.playerService.setPlayerMetadata(source, 'vehiclelimit', limit);

        this.notifier.notify(
            source,
            `Vous venez d'améliorer votre carte grise au niveau ${limit} pour $${price}`,
            'success'
        );
    }

    @Rpc(RpcServerEvent.DRIVING_SCHOOL_CHECK_REMAINING_SLOTS)
    public async checkRemainingSlots(source: number) {
        const player = this.playerService.getPlayer(source);
        if (!player) return;

        const vehicleModels = (
            await this.prismaService.vehicle.findMany({
                select: {
                    model: true,
                },
                where: {
                    dealershipId: {
                        not: null,
                    },
                    AND: {
                        dealershipId: {
                            not: 'cycle',
                        },
                    },
                },
            })
        ).map(v => v.model);
        const playerVehicleCount = await this.prismaService.playerVehicle.count({
            where: {
                citizenid: player.citizenid,
                job: null,
                state: {
                    not: PlayerVehicleState.Destroyed,
                },
                vehicle: {
                    in: vehicleModels,
                },
            },
        });
        const limit = player.metadata.vehiclelimit;

        return Math.max(limit - playerVehicleCount, 0);
    }
}
