import { On } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { DrivingSchoolConfig, DrivingSchoolLicenseType } from '../../shared/driving-school';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { Vector4 } from '../../shared/polyzone/vector';
import { RpcEvent } from '../../shared/rpc';
import { Notifier } from '../notifier';
import { PlayerMoneyService } from '../player/player.money.service';
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

    @Inject(VehicleSpawner)
    private vehicleSpawner: VehicleSpawner;

    @On(ServerEvent.DRIVING_SCHOOL_PLAYER_PAY)
    public makePlayerPay(source: number, licenseType: DrivingSchoolLicenseType, spawnPoint: Vector4) {
        const lData = DrivingSchoolConfig.licenses[licenseType];
        if (!lData || typeof lData.price !== 'number') {
            return;
        }

        if (this.playerMoneyService.remove(source, lData.price)) {
            this.notifier.notify(source, "Vous n'avez pas assez d'argent", 'error');
            return;
        }

        TriggerClientEvent(ClientEvent.DRIVING_SCHOOL_SETUP_EXAM, source, licenseType, spawnPoint);
    }

    @On(ServerEvent.DRIVING_SCHOOL_UPDATE_LICENSE)
    public updatePlayerLicense(source: number, licenseType: DrivingSchoolLicenseType, licenseLabel: string) {
        const player = this.playerService.getPlayer(source);

        const licenses = player.metadata['licences'];
        const licenseData = DrivingSchoolConfig.licenses[licenseType];
        if (!licenses || !licenseData) {
            this.notifier.notify(source, 'Erreur lors de la délivrance de votre permis', 'error');
            return;
        }

        licenses[licenseType] = licenseData.points || true;

        this.playerService.setPlayerMetadata(source, 'licences', licenses);
        this.playerService.save(source);

        this.notifier.notify(source, `Félicitations ! Vous venez d'obtenir votre ${licenseLabel}`, 'success');
    }

    @Rpc(RpcEvent.DRIVING_SCHOOL_SPAWN_VEHICLE)
    public async spawnExamVehicle(source: number, model: string) {
        return await this.vehicleSpawner.spawnTemporaryVehicle(source, model);
    }
}
