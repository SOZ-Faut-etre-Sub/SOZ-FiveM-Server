import { On } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { wait } from '../../core/utils';
import { DrivingSchoolConfig, DrivingSchoolLicense, DrivingSchoolLicenseType } from '../../shared/driving-school';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { RpcEvent } from '../../shared/rpc';
import { PedFactory } from '../factory/ped.factory';
import { Notifier } from '../notifier';
import { TargetOptions } from '../target/target.factory';

@Provider()
export class ExamProvider {
    private licenseData: DrivingSchoolLicense;

    private instructorEntity: number;
    private vehicleEntity: number;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PedFactory)
    private pedFactory: PedFactory;

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

    @On(ClientEvent.DRIVING_SCHOOL_SETUP_EXAM)
    public async setupDrivingSchoolExam(licenseType: DrivingSchoolLicenseType, spawnPoint) {
        await this.screenFadeOut();

        const instructorConfig = DrivingSchoolConfig.peds.instructor;
        const instructor = await this.pedFactory.createPed({
            ...instructorConfig,
            invincible: true,
            blockevents: true,
        });

        const playerPed = PlayerPedId();
        SetEntityCoords(playerPed, spawnPoint.x, spawnPoint.y, spawnPoint.z, false, false, false, false);
        SetEntityHeading(playerPed, spawnPoint.w);
        await wait(200);

        const vehicleModel = this.license.vehicle.model;
        const vehicleNetId = await emitRpc<number>(RpcEvent.DRIVING_SCHOOL_SPAWN_VEHICLE, vehicleModel);

        const vehicle = NetToVeh(vehicleNetId);
        SetVehicleNumberPlateText(vehicle, DrivingSchoolConfig.vehiclePlateText);
        SetPedIntoVehicle(instructor, vehicle, 0);

        this.instructorEntity = instructor;
        this.vehicleEntity = vehicle;

        // TODO: Start exam loop

        await this.screenFadeIn();
    }

    private getSpawnPoint(points: { x: number; y: number; z: number; w: number }[]) {
        for (const point of points) {
            if (!IsPositionOccupied(point.x, point.y, point.z, 0.25, false, true, true, false, false, 0, false)) {
                return point;
            }
        }
    }

    private async screenFadeOut() {
        DoScreenFadeOut(DrivingSchoolConfig.fadeDelay);
        await wait(DrivingSchoolConfig.fadeDelay);
    }

    private async screenFadeIn() {
        await wait(DrivingSchoolConfig.fadeDelay);
        DoScreenFadeIn(DrivingSchoolConfig.fadeDelay);
    }
}
