import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Rpc } from '../../core/decorators/rpc';
import { DrivingSchoolConfig, DrivingSchoolLicenseType } from '../../shared/driving-school';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { RpcEvent } from '../../shared/rpc';
import { Notifier } from '../notifier';
import { QBCore } from '../qbcore';
import { VehicleSpawner } from '../vehicle/vehicle.spawner';

@Provider()
export class DrivingSchoolProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(QBCore)
    private QBCore: QBCore;

    @Inject(VehicleSpawner)
    private vehicleSpawner: VehicleSpawner;

    @OnEvent(ServerEvent.DRIVING_SCHOOL_PLAYER_PAY)
    public makePlayerPay(source: number, licenseType: DrivingSchoolLicenseType, spawnPoint) {
        const qbPlayer = this.QBCore.getPlayer(source);
        if (!qbPlayer) return;

        const lData = DrivingSchoolConfig.licenses[licenseType];
        if (!lData || typeof lData.price !== 'number') return;

        if (!qbPlayer.Functions.RemoveMoney('money', lData.price)) {
            this.notifier.notify(source, "Vous n'avez pas assez d'argent", 'error');
            return;
        }

        TriggerClientEvent(ClientEvent.DRIVING_SCHOOL_SETUP_EXAM, source, licenseType, spawnPoint);
    }

    @Rpc(RpcEvent.DRIVING_SCHOOL_SPAWN_VEHICLE)
    public async spawnExamVehicle(source: number, model: string) {
        return await this.vehicleSpawner.spawnTemporaryVehicle(source, model);
    }
}
