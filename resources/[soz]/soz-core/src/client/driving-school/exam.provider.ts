import { On, OnGameEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { emitRpc } from '../../core/rpc';
import { wait } from '../../core/utils';
import {
    Checkpoint,
    Checkpoints,
    CurrentExam,
    DrivingSchoolConfig,
    DrivingSchoolLicense,
    DrivingSchoolLicenseType,
} from '../../shared/driving-school';
import { EntityType } from '../../shared/entity';
import { ClientEvent, GameEvent, ServerEvent } from '../../shared/event';
import { getDistance, Vector3, Vector4 } from '../../shared/polyzone/vector';
import { Err, isErr, isOk, Ok, Result } from '../../shared/result';
import { RpcEvent } from '../../shared/rpc';
import { PedFactory } from '../factory/ped.factory';
import { Notifier } from '../notifier';
import { PhoneService } from '../phone/phone.service';
import { PlayerService } from '../player/player.service';
import { TargetOptions } from '../target/target.factory';
import { VehicleSeatbeltProvider } from '../vehicle/vehicle.seatbelt.provider';
import { Penalties } from './penalties';

@Provider()
export class ExamProvider {
    private examState: CurrentExam = this.resetExamState();

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PedFactory)
    private pedFactory: PedFactory;

    @Inject(PhoneService)
    private phoneService: PhoneService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(VehicleSeatbeltProvider)
    private seatbeltProvider: VehicleSeatbeltProvider;

    @On(ClientEvent.DRIVING_SCHOOL_START_EXAM)
    public async examPrecheck(data: TargetOptions) {
        const lData: DrivingSchoolLicense = DrivingSchoolConfig.licenses[data.license];

        if (!lData) {
            this.notifier.notify("Impossible de démarrer l'examen", 'error');
            return;
        }

        const spawnPoint = this.getSpawnPoint(lData.vehicle.spawnPoints);

        if (!spawnPoint) {
            this.notifier.notify("Parking encombré, l'instructeur ne peut pas garer le véhicule d'examen.", 'error');
            return;
        }

        TriggerServerEvent(ServerEvent.DRIVING_SCHOOL_PLAYER_PAY, lData.licenseType, spawnPoint);
    }

    @On(ClientEvent.DRIVING_SCHOOL_SETUP_EXAM)
    public async setupDrivingSchoolExam(licenseType: DrivingSchoolLicenseType, spawnPoint: Vector4) {
        await this.screenFadeOut();

        this.examState.license = DrivingSchoolConfig.licenses[licenseType];

        this.examState.spawnPoint = spawnPoint;

        const instructorConfig = DrivingSchoolConfig.peds.instructor;
        const instructor = await this.pedFactory.createPed({
            ...instructorConfig,
            invincible: true,
            blockevents: true,
        });

        this.teleportPlayer(this.examState.spawnPoint);
        await wait(200);

        const vehicleModel = this.examState.license.vehicle.model;
        const vehicleNetId = await emitRpc<number>(RpcEvent.DRIVING_SCHOOL_SPAWN_VEHICLE, vehicleModel);

        const vehicle = NetToVeh(vehicleNetId);
        SetVehicleNumberPlateText(vehicle, DrivingSchoolConfig.vehiclePlateText);
        SetPedIntoVehicle(instructor, vehicle, 0);

        this.examState.instructorEntity = instructor;
        this.examState.vehicleEntity = vehicle;

        this.startExam();

        await this.screenFadeIn();
    }

    @OnGameEvent(GameEvent.CEventNetworkVehicleUndrivable)
    private async onVehicleUndrivable(veh: number) {
        if (!this.examState.isExamRunning) {
            return;
        }

        if (GetEntityType(veh) == EntityType.Vehicle && IsEntityDead(veh)) {
            if (Array.isArray(this.examState.undrivableVehicles)) {
                this.examState.undrivableVehicles.push(veh);
            } else {
                this.examState.undrivableVehicles = [veh];
            }
        }
    }

    @Tick(TickInterval.EVERY_FRAME)
    private async examLoop() {
        if (!this.examState.isExamRunning) {
            return;
        }

        const vehCoords = GetEntityCoords(this.examState.vehicleEntity, true) as Vector3;

        if (!this.examState.isPenaltyLoopRunning) {
            if (getDistance(this.examState.spawnPoint, vehCoords) > 2.0) {
                this.startPenaltyLoop();
            }
        }

        DisplayRadar(true);

        const dist = getDistance(this.examState.currentCheckpoint.coords, vehCoords);

        if (dist > this.examState.license.marker.size) {
            return;
        }

        DeleteCheckpoint(this.examState.checkpointEntity);

        const msg = this.examState.currentCheckpoint.message;
        if (typeof msg === 'string' && msg.length > 0) {
            this.notifier.notify(msg, 'info');
        }

        this.notifier.notify(
            `Checkpoint ${this.examState.license.checkpointCount + 1 - this.examState.checkpoints.length}/${
                this.examState.license.checkpointCount + 1
            }`,
            'info'
        );

        this.examState.currentCheckpoint = this.examState.checkpoints.shift();
        if (this.examState.currentCheckpoint) {
            this.examState.checkpointEntity = this.displayCheckpoint(this.examState.currentCheckpoint);
        } else {
            this.terminateExam(Ok(true));
        }
    }

    @Tick(200)
    private async penaltyLoop() {
        if (!this.examState.isPenaltyLoopRunning) {
            return;
        }

        for (const penalty of this.examState.penalties) {
            if (isErr(penalty.performCheck())) {
                await this.terminateExam(Err(false));
            }
        }
    }

    private teleportPlayer([x, y, z, w]: Vector4) {
        const playerPed = PlayerPedId();
        SetEntityCoords(playerPed, x, y, z, false, false, false, false);
        SetEntityHeading(playerPed, w);
    }

    private getSpawnPoint(points: Vector4[]) {
        for (const point of points) {
            const [x, y, z] = point;
            if (!IsPositionOccupied(x, y, z, 0.25, false, true, true, false, false, 0, false)) {
                return point;
            }
        }
    }

    private startExam() {
        this.displayInstructorStartSpeech(this.examState.license.licenseType);

        this.examState.checkpoints = this.getRandomCheckpoints(
            this.examState.license.licenseType,
            this.examState.license.checkpointCount
        );

        this.examState.checkpoints.push(this.examState.license.finalCheckpoint);

        this.examState.currentCheckpoint = this.examState.checkpoints.shift();
        this.examState.checkpointEntity = this.displayCheckpoint(this.examState.currentCheckpoint);

        this.examState.isExamRunning = true;
    }

    private startPenaltyLoop() {
        this.setupPenaltySystem();
        this.examState.isPenaltyLoopRunning = true;
    }

    private async terminateExam(result: Result<boolean, boolean>) {
        this.examState.isExamRunning = false;
        this.examState.isPenaltyLoopRunning = false;

        if (this.playerService.getPlayer().metadata.isdead) {
            this.deleteVehicleAndPed();
        } else {
            await wait(2000);
            await this.deleteEntitiesAndTeleportBack();
        }

        if (this.examState.checkpointEntity) {
            DeleteCheckpoint(this.examState.checkpointEntity);
        }

        if (this.examState.checkpointBlip) {
            RemoveBlip(this.examState.checkpointBlip);
        }

        DisplayRadar(false);

        if (isOk(result)) {
            TriggerServerEvent(
                ServerEvent.DRIVING_SCHOOL_UPDATE_LICENSE,
                this.examState.license.licenseType,
                this.examState.license.label.toLowerCase()
            );
        }

        this.examState = this.resetExamState();
    }

    private setupPenaltySystem() {
        this.examState.context = {
            phoneService: this.phoneService,
            playerService: this.playerService,
            notifier: this.notifier,
            seatbeltProvider: this.seatbeltProvider,
            undrivableVehicles: [],
            vehicle: this.examState.vehicleEntity,
        };

        this.examState.penalties = [...Penalties]
            .map(P => new P(this.examState.context))
            .filter(P => (Array.isArray(P.exclude) ? !P.exclude.includes(this.examState.license.licenseType) : true));
    }

    private resetExamState(): CurrentExam {
        return {
            isExamRunning: false,
            isPenaltyLoopRunning: false,
        };
    }

    private deleteVehicleAndPed() {
        DeletePed(this.examState.instructorEntity);
        DeleteVehicle(this.examState.vehicleEntity);
    }

    private async deleteEntitiesAndTeleportBack() {
        await this.screenFadeOut();

        this.deleteVehicleAndPed();

        this.teleportPlayer(DrivingSchoolConfig.playerDefaultLocation);

        await this.screenFadeIn();
    }

    private getRandomCheckpoints(licenseType: DrivingSchoolLicenseType, count: number) {
        if (count > Checkpoints.length) count = Checkpoints.length;

        const eligibleCheckpoints = [...Checkpoints].filter(c => c.licenses.includes(licenseType));

        return [...Array(count).keys()].map(() => {
            const idx = Math.floor(Math.random() * eligibleCheckpoints.length);
            return eligibleCheckpoints.splice(idx, 1)[0];
        });
    }

    private displayCheckpoint(current: Checkpoint) {
        const m = this.examState.license.marker;

        const type = this.examState.checkpoints.length > 0 ? m.type : m.typeFinal;

        const [x1, y1, z1] = current.coords;

        const [r, g, b, a] = Object.values(m.color);

        const cpId = CreateCheckpoint(type, x1, y1, z1, 0.0, 0.0, 0.0, m.size, r, g, b, a, 0);

        SetCheckpointCylinderHeight(cpId, m.size, m.size, m.size);

        if (this.examState.checkpointBlip) {
            RemoveBlip(this.examState.checkpointBlip);
        }

        this.examState.checkpointBlip = AddBlipForCoord(x1, y1, z1);
        const blipColor = DrivingSchoolConfig.blip.color;
        SetBlipColour(this.examState.checkpointBlip, blipColor);
        SetBlipRouteColour(this.examState.checkpointBlip, blipColor);
        SetBlipRoute(this.examState.checkpointBlip, true);

        return cpId;
    }

    private displayInstructorStartSpeech(licenseType: DrivingSchoolLicenseType) {
        DrivingSchoolConfig.startSpeeches
            .filter(s => Array.isArray(s.exclude) && !s.exclude.includes(licenseType))
            .forEach(s => {
                this.notifier.notify(s.message, 'info');
            });
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
