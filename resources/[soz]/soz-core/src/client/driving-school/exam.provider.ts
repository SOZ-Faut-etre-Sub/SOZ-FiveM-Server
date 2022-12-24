import { On, OnGameEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { emitRpc } from '../../core/rpc';
import { wait } from '../../core/utils';
import {
    DrivingSchoolConfig,
    DrivingSchoolLicense,
    DrivingSchoolLicenseType,
    PenaltyContext,
} from '../../shared/driving-school';
import { EntityType } from '../../shared/entity';
import { ClientEvent, GameEvent, ServerEvent } from '../../shared/event';
import { getDistance, Vector3, Vector4 } from '../../shared/polyzone/vector';
import { Err, isErr, isOk, Result } from '../../shared/result';
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

    private context: PenaltyContext;
    private isExamRunning = false;
    private isPenaltyLoopRunning = false;
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
    public async setupDrivingSchoolExam(licenseType: DrivingSchoolLicenseType, spawnPoint: Vector4) {
        await this.screenFadeOut();

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

        // TODO: Start exam loop
        this.startExam(spawnPoint);

        await this.screenFadeIn();
    }

    @OnGameEvent(GameEvent.CEventNetworkVehicleUndrivable)
    private async onVehicleUndrivable(veh: number) {
        console.log(GetEntityType(veh), EntityType.Vehicle, IsEntityDead(veh));
        if (GetEntityType(veh) == EntityType.Vehicle && IsEntityDead(veh)) {
            this.undrivableVehicles.push(veh);
        }
    }

    @Tick(TickInterval.EVERY_FRAME)
    private async examLoop() {
        if (!this.isExamRunning) return;

        if (!this.isPenaltyLoopRunning) {
            const vehCoords = GetEntityCoords(this.vehicleEntity, true) as Vector3;
            if (getDistance(this.spawnPoint, vehCoords) > 2.0) {
                this.startPenaltyLoop();
            }
        }

        // TODO: Checkpoints
    }

    @Tick(200)
    private async penaltyLoop() {
        if (!this.isPenaltyLoopRunning) return;

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

    private startExam(spawnPoint: Vector4) {
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

        this.cleanupPenaltySystem();

        // TODO:
        // CLEAR CHECKPOINT
        // HIDE GPS

        if (isOk(result)) {
            TriggerServerEvent('soz-driving-license:server:update_license', this.license.licenseType);
            this.notifier.notify(`Félicitations ! Vous venez d'obtenir votre ${this.license.label.toLowerCase()}`);
        }
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
            .filter(P => {
                if (Array.isArray(P.exclude)) {
                    return !P.exclude.includes(this.license.licenseType);
                } else return true;
            });
    }

    private cleanupPenaltySystem() {
        delete this.context;
        delete this.penalties;
    }

    private deleteVehicleAndPed() {
        DeletePed(this.instructorEntity);
        DeleteVehicle(this.vehicleEntity);
        // TODO: REMOVE KEYS ?
    }

    private async deleteEntitiesAndTeleportBack() {
        await this.screenFadeOut();

        this.deleteVehicleAndPed();

        this.teleportPlayer(DrivingSchoolConfig.playerDefaultLocation);

        await this.screenFadeIn();
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
