import { On } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { DrivingSchoolConfig } from '../../shared/driving-school';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { Notifier } from '../notifier';
import { TargetOptions } from '../target/target.factory';

@Provider()
export class ExamProvider {
    private licenseData;

    @Inject(Notifier)
    private notifier: Notifier;

    private get license() {
        return this.licenseData;
    }

    private set license(data) {
        this.licenseData = data;
    }

    @On(ClientEvent.DRIVING_SCHOOL_START_EXAM)
    public async examPrecheck(data: TargetOptions) {
        const licenseType = data.license;
        this.license = DrivingSchoolConfig.licenses[licenseType];

        const vData = this.license.vehicle;
        const spawnPoint = this.getSpawnPoint(vData.spawnPoints);

        if (!spawnPoint) {
            this.notifier.notify("Parking encombré, l'instructeur ne peut pas garer le véhicule d'examen.", 'error');
            return;
        }

        TriggerServerEvent(ServerEvent.DRIVING_SCHOOL_PLAYER_PAY, licenseType, spawnPoint);
    }

    @On(ClientEvent.DRIVING_SCHOOL_SPAWN_VEHICLE)
    public async setupDrivingSchoolExam() {
        // TODO
    }

    private getSpawnPoint(points: { x: number; y: number; z: number; w: number }[]) {
        for (const point of points) {
            if (!IsPositionOccupied(point.x, point.y, point.z, 0.25, false, true, true, false, false, 0, false)) {
                return point;
            }
        }
    }
}
