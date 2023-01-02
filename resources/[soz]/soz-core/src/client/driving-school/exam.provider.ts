import { On, OnGameEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { emitRpc } from '../../core/rpc';
import { wait } from '../../core/utils';
import {
    Checkpoint,
    Checkpoints,
    DrivingSchoolConfig,
    DrivingSchoolLicense,
    DrivingSchoolLicenseType,
    PenaltyContext,
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
import { Penalties, Penalty } from './penalties';

@Provider()
export class ExamProvider {
    private license: DrivingSchoolLicense;
    private spawnPoint: Vector4;

    private isExamRunning = false;
    private isPenaltyLoopRunning = false;

    private checkpoints: Checkpoint[];
    private currentCp: Checkpoint;
    private cpEntity: number;
    private cpBlip: number;

    private context: PenaltyContext;
    private penalties: Penalty[];

    private undrivableVehicles: number[] = [];

    private instructorEntity: number;
    private vehicleEntity: number;

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

        this.license = DrivingSchoolConfig.licenses[licenseType];

        this.spawnPoint = spawnPoint;

        const instructorConfig = DrivingSchoolConfig.peds.instructor;
        const instructor = await this.pedFactory.createPed({
            ...instructorConfig,
            invincible: true,
            blockevents: true,
        });

        this.teleportPlayer(this.spawnPoint);
        await wait(200);

        const vehicleModel = this.license.vehicle.model;
        const vehicleNetId = await emitRpc<number>(RpcEvent.DRIVING_SCHOOL_SPAWN_VEHICLE, vehicleModel);

        const vehicle = NetToVeh(vehicleNetId);
        SetVehicleNumberPlateText(vehicle, DrivingSchoolConfig.vehiclePlateText);
        SetPedIntoVehicle(instructor, vehicle, 0);

        this.instructorEntity = instructor;
        this.vehicleEntity = vehicle;

        this.startExam();

        await this.screenFadeIn();
    }

    @OnGameEvent(GameEvent.CEventNetworkVehicleUndrivable)
    private async onVehicleUndrivable(veh: number) {
        if (!this.isExamRunning) {
            return;
        }

        if (GetEntityType(veh) == EntityType.Vehicle && IsEntityDead(veh)) {
            if (Array.isArray(this.undrivableVehicles)) {
                this.undrivableVehicles.push(veh);
            } else {
                this.undrivableVehicles = [veh];
            }
        }
    }

    @Tick(TickInterval.EVERY_FRAME)
    private async examLoop() {
        if (!this.isExamRunning) {
            return;
        }

        const vehCoords = GetEntityCoords(this.vehicleEntity, true) as Vector3;

        if (!this.isPenaltyLoopRunning) {
            if (getDistance(this.spawnPoint, vehCoords) > 2.0) {
                this.startPenaltyLoop();
            }
        }

        DisplayRadar(true);

        const dist = getDistance(this.currentCp.coords, vehCoords);

        if (dist > this.license.marker.size) {
            return;
        }

        DeleteCheckpoint(this.cpEntity);

        const msg = this.currentCp.message;
        if (typeof msg === 'string' && msg.length > 0) {
            this.notifier.notify(msg, 'info');
        }

        this.notifier.notify(
            `Checkpoint ${this.license.checkpointCount + 1 - this.checkpoints.length}/${
                this.license.checkpointCount + 1
            }`,
            'info'
        );

        this.currentCp = this.checkpoints.shift();
        if (this.currentCp) {
            this.cpEntity = this.displayCheckpoint(this.currentCp);
        } else {
            this.terminateExam(Ok(true));
        }
    }

    @Tick(200)
    private async penaltyLoop() {
        if (!this.isPenaltyLoopRunning) {
            return;
        }

        for (const penalty of this.penalties) {
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
        this.displayInstructorStartSpeech(this.license.licenseType);

        this.checkpoints = this.getRandomCheckpoints(this.license.licenseType, this.license.checkpointCount);

        this.checkpoints.push(this.license.finalCheckpoint);

        this.currentCp = this.checkpoints.shift();
        this.cpEntity = this.displayCheckpoint(this.currentCp);

        this.isExamRunning = true;
    }

    private startPenaltyLoop() {
        this.setupPenaltySystem();
        this.isPenaltyLoopRunning = true;
    }

    private async terminateExam(result: Result<boolean, boolean>) {
        this.isExamRunning = false;
        this.isPenaltyLoopRunning = false;

        if (this.playerService.getPlayer().metadata.isdead) {
            this.deleteVehicleAndPed();
        } else {
            await wait(2000);
            this.deleteEntitiesAndTeleportBack();
        }

        if (this.cpEntity) {
            DeleteCheckpoint(this.cpEntity);
        }

        if (this.cpBlip) {
            RemoveBlip(this.cpBlip);
        }

        DisplayRadar(false);

        if (isOk(result)) {
            TriggerServerEvent(
                ServerEvent.DRIVING_SCHOOL_UPDATE_LICENSE,
                this.license.licenseType,
                this.license.label.toLowerCase()
            );
        }

        this.cleanupPenaltySystem();
        this.cleanupExamSystem();
    }

    private setupPenaltySystem() {
        this.context = {
            phoneService: this.phoneService,
            playerService: this.playerService,
            notifier: this.notifier,
            seatbeltProvider: this.seatbeltProvider,
            undrivableVehicles: this.undrivableVehicles,
            vehicle: this.vehicleEntity,
        };

        this.penalties = [...Penalties]
            .map(P => new P(this.context))
            .filter(P => (Array.isArray(P.exclude) ? !P.exclude.includes(this.license.licenseType) : true));
    }

    private cleanupExamSystem() {
        delete this.license;
        delete this.spawnPoint;
        delete this.checkpoints;
        delete this.currentCp;
        delete this.cpEntity;
        delete this.cpBlip;
        delete this.undrivableVehicles;
    }

    private cleanupPenaltySystem() {
        delete this.context;
        delete this.penalties;
    }

    private deleteVehicleAndPed() {
        DeletePed(this.instructorEntity);
        DeleteVehicle(this.vehicleEntity);

        delete this.instructorEntity;
        delete this.vehicleEntity;
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
        const m = this.license.marker;

        const type = this.checkpoints.length > 0 ? m.type : m.typeFinal;

        const [x1, y1, z1] = current.coords;

        const [r, g, b, a] = Object.values(m.color);

        const cpId = CreateCheckpoint(type, x1, y1, z1, 0.0, 0.0, 0.0, m.size, r, g, b, a, 0);

        SetCheckpointCylinderHeight(cpId, m.size, m.size, m.size);

        if (this.cpBlip) {
            RemoveBlip(this.cpBlip);
        }

        this.cpBlip = AddBlipForCoord(x1, y1, z1);
        const blipColor = DrivingSchoolConfig.blip.color;
        SetBlipColour(this.cpBlip, blipColor);
        SetBlipRouteColour(this.cpBlip, blipColor);
        SetBlipRoute(this.cpBlip, true);

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
