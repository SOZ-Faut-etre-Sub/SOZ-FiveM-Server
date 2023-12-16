import { Once, OnceStep } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { emitRpc } from '../../../core/rpc';
import { wait } from '../../../core/utils';
import { Outfit } from '../../../shared/cloth';
import { ServerEvent } from '../../../shared/event/server';
import { JobType } from '../../../shared/job';
import { BoxZone, Zone } from '../../../shared/polyzone/box.zone';
import { Vector4 } from '../../../shared/polyzone/vector';
import { ProgressAnimation, ProgressOptions } from '../../../shared/progress';
import { getRandomInt } from '../../../shared/random';
import { RpcServerEvent } from '../../../shared/rpc';
import { BlipFactory } from '../../blip';
import { Notifier } from '../../notifier';
import { PlayerWardrobe } from '../../player/player.wardrobe';
import { ProgressService } from '../../progress.service';
import { TargetFactory } from '../../target/target.factory';
import { JobService } from '../job.service';

type TemporaryJob = {
    zone: Zone;
    pedModel: string;
    clothes: Record<number, Outfit>;
    vehicleSpawn: Vector4;
    vehicleModel: string;
    missionZones: Zone[];
    targetIcon: string;
    targetLabel: string;
    targetCanInteract?: (entity: number) => boolean;
    missionMoney: number;
    missionProgressAnimation: ProgressAnimation;
    missionProgressOptions: Partial<ProgressOptions>;
    repeat?: { min: number; max: number };
    description: string;
};

const TemporaryJobs: Partial<Record<JobType, TemporaryJob>> = {
    [JobType.Religious]: {
        zone: new BoxZone([-766.24, -24.39, 40.08], 1, 1, {
            heading: 213.06,
        }),
        pedModel: 'ig_priest',
        clothes: {
            [GetHashKey('mp_m_freemode_01')]: {
                Components: {
                    '3': { Drawable: 11, Texture: 0, Palette: 0 },
                    '4': { Drawable: 0, Texture: 0, Palette: 0 },
                    '6': { Drawable: 14, Texture: 0, Palette: 0 },
                    '7': { Drawable: 22, Texture: 4, Palette: 0 },
                    '8': { Drawable: -1, Texture: 0, Palette: 0 },
                    '9': { Drawable: 0, Texture: 0, Palette: 0 },
                    '10': { Drawable: 0, Texture: 0, Palette: 0 },
                    '11': { Drawable: 13, Texture: 3, Palette: 0 },
                },
                Props: {},
            },
            [GetHashKey('mp_f_freemode_01')]: {
                Components: {
                    '3': { Drawable: 14, Texture: 0, Palette: 0 },
                    '4': { Drawable: 0, Texture: 0, Palette: 0 },
                    '6': { Drawable: 2, Texture: 2, Palette: 0 },
                    '7': { Drawable: 0, Texture: 0, Palette: 0 },
                    '8': { Drawable: 0, Texture: 0, Palette: 0 },
                    '9': { Drawable: 0, Texture: 0, Palette: 0 },
                    '10': { Drawable: 0, Texture: 0, Palette: 0 },
                    '11': { Drawable: 9, Texture: 2, Palette: 0 },
                },
                Props: {},
            },
        },
        vehicleSpawn: [-763.69, -39.26, 37.69, 119.87],
        vehicleModel: 'fixter',
        missionZones: [
            new BoxZone([-1517.37, -433.94, 63.06], 45.4, 53.8, { heading: 49, maxZ: 43.46, minZ: 34.46 }),
            new BoxZone([235.83, 235.83, 105.5], 45.8, 54.0, { heading: 340, maxZ: 110.0, minZ: 104.0 }),
            new BoxZone([-1221.01, -1546.34, 18.48], 48.8, 76.6, { heading: 305, maxZ: 7.08, minZ: 3.08 }),
        ],
        targetIcon: 'fas fa-sign-in-alt',
        targetLabel: 'Donner une info chat',
        targetCanInteract: (entity: number) => {
            return GetEntityType(entity) === 1;
        },
        missionMoney: 12,
        missionProgressAnimation: {
            dictionary: 'timetable@amanda@ig_4',
            name: 'ig_4_base',
            options: {
                repeat: true,
            },
        },
        missionProgressOptions: {
            disableMovement: true,
            disableCarMovement: true,
            disableCombat: true,
            disableMouse: false,
        },
        repeat: { min: 3, max: 6 },
        description: 'Vous êtes un prêtre, rend toi dans chaque zone et donne des infochats aux passants.',
    },
    [JobType.Delivery]: {
        zone: new BoxZone([-424.06, -2789.62, 5.4], 1, 1, {
            heading: 314.46,
        }),
        pedModel: 's_m_m_postal_01',
        clothes: {
            [GetHashKey('mp_m_freemode_01')]: {
                Components: {
                    '3': { Drawable: 0, Texture: 0, Palette: 0 },
                    '4': { Drawable: 6, Texture: 0, Palette: 0 },
                    '6': { Drawable: 9, Texture: 10, Palette: 0 },
                    '7': { Drawable: 0, Texture: 0, Palette: 0 },
                    '8': { Drawable: 0, Texture: 25, Palette: 0 },
                    '9': { Drawable: 0, Texture: 0, Palette: 0 },
                    '10': { Drawable: 0, Texture: 0, Palette: 0 },
                    '11': { Drawable: 9, Texture: 12, Palette: 0 },
                },
                Props: {},
            },
            [GetHashKey('mp_f_freemode_01')]: {
                Components: {
                    '3': { Drawable: 14, Texture: 0, Palette: 0 },
                    '4': { Drawable: 8, Texture: 4, Palette: 0 },
                    '6': { Drawable: 3, Texture: 5, Palette: 0 },
                    '7': { Drawable: 0, Texture: 0, Palette: 0 },
                    '8': { Drawable: 0, Texture: 0, Palette: 0 },
                    '9': { Drawable: 0, Texture: 0, Palette: 0 },
                    '10': { Drawable: 0, Texture: 0, Palette: 0 },
                    '11': { Drawable: 14, Texture: 9, Palette: 0 },
                },
                Props: {},
            },
        },
        vehicleSpawn: [-413.45, -2791.54, 7.0, 317.52],
        vehicleModel: 'faggio3',
        missionZones: [
            new BoxZone([859.15, -531.95, 57.33], 1, 1, { heading: 0, maxZ: 58.08, minZ: 56.08 }),
            new BoxZone([-1225.8, -1094.27, 8.17], 1, 1, { heading: 0, maxZ: 8.57, minZ: 6.77 }),
            new BoxZone([-618.08, -950.34, 21.7], 1, 1, { heading: 0, maxZ: 21.9, minZ: 20.5 }),
            new BoxZone([-822.38, -995.39, 13.07], 1, 1, { heading: 29, maxZ: 14.07, minZ: 12.27 }),
            new BoxZone([-1365.82, -686.5, 25.32], 1, 1, { heading: 37, maxZ: 25.32, minZ: 23.72 }),
        ],
        targetIcon: 'c:pole/livrer.png',
        targetLabel: 'Livrez la fougère',
        missionMoney: 10,
        missionProgressAnimation: {
            dictionary: 'mp_common',
            name: 'givetake2_a',
            options: {
                repeat: true,
            },
        },
        missionProgressOptions: {
            disableMovement: true,
            disableCarMovement: true,
            disableCombat: true,
            disableMouse: false,
        },
        description:
            'Vous êtes un livreur de fougère, livrez la fougère dans la boite aux lettres indiqué sur votre carte.',
    },
    [JobType.Adsl]: {
        zone: new BoxZone([479.17, -107.53, 62.16], 1, 1, {
            heading: 196.24,
            maxZ: 43.07,
            minZ: 40.07,
        }),
        pedModel: 's_m_y_construct_01',
        clothes: {
            [GetHashKey('mp_m_freemode_01')]: {
                Components: {
                    '3': { Drawable: 0, Texture: 0, Palette: 0 },
                    '4': { Drawable: 9, Texture: 3, Palette: 0 },
                    '6': { Drawable: 25, Texture: 0, Palette: 0 },
                    '7': { Drawable: 0, Texture: 0, Palette: 0 },
                    '8': { Drawable: 59, Texture: 0, Palette: 0 },
                    '9': { Drawable: 0, Texture: 0, Palette: 0 },
                    '10': { Drawable: 0, Texture: 0, Palette: 0 },
                    '11': { Drawable: 22, Texture: 0, Palette: 0 },
                },
                Props: {},
            },
            [GetHashKey('mp_f_freemode_01')]: {
                Components: {
                    '3': { Drawable: 14, Texture: 0, Palette: 0 },
                    '4': { Drawable: 11, Texture: 4, Palette: 0 },
                    '6': { Drawable: 25, Texture: 0, Palette: 0 },
                    '7': { Drawable: 0, Texture: 0, Palette: 0 },
                    '8': { Drawable: 36, Texture: 0, Palette: 0 },
                    '9': { Drawable: 0, Texture: 0, Palette: 0 },
                    '10': { Drawable: 0, Texture: 0, Palette: 0 },
                    '11': { Drawable: 14, Texture: 0, Palette: 0 },
                },
                Props: {},
            },
        },
        vehicleSpawn: [500.79, -105.88, 62.07, 253.78],
        vehicleModel: 'utillitruck3',
        missionZones: [
            new BoxZone([406.88, -968.05, 29.45], 1.8, 1.2, { heading: 358, maxZ: 30.4, minZ: 27.8 }),
            new BoxZone([-245.4, -705.67, 33.57], 1.8, 0.8, { heading: 343, maxZ: 34.17, minZ: 32.17 }),
            new BoxZone([-588.54, -225.87, 36.43], 1.6, 1.2, { heading: 29, maxZ: 37.43, minZ: 35.03 }),
            new BoxZone([-613.4, -942.67, 21.96], 2.0, 0.6, { heading: 0, maxZ: 22.56, minZ: 20.36 }),
            new BoxZone([353.33, -1350.68, 32.87], 0.8, 1.8, { heading: 320, maxZ: 32.67, minZ: 31.27 }),
            new BoxZone([-738.09, -638.77, 30.33], 1.75, 0.6, { heading: 0, maxZ: 30.53, minZ: 28.93 }),
            new BoxZone([-566.75, -356.01, 35.06], 1.0, 1.6, { heading: 1, maxZ: 36.06, minZ: 33.86 }),
            new BoxZone([-298.36, -154.46, 41.33], 1.6, 0.6, { heading: 358, maxZ: 41.73, minZ: 19.93 }),
        ],
        targetIcon: 'c:pole/repair.png',
        targetLabel: 'Réparer',
        missionMoney: 12,
        missionProgressAnimation: {
            task: 'WORLD_HUMAN_WELDING',
            options: {
                repeat: true,
            },
        },
        missionProgressOptions: {
            disableMovement: true,
            disableCarMovement: true,
            disableCombat: true,
            disableMouse: false,
        },
        description:
            'Vous êtes un technicien ADSL, rendez-vous dans chaque zone et réparez les boitiers ADSL défectueux.',
    },
};

@Provider()
export class TemporaryProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(JobService)
    private jobService: JobService;

    @Inject(PlayerWardrobe)
    private playerWardrobe: PlayerWardrobe;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(Notifier)
    private notifier: Notifier;

    private jobVehicle: number | null = null;

    private missionIndex: number | null = null;

    private successfulMission = 0;

    private entityDones: number[] = [];

    private repeatCount = 1;

    @Once(OnceStep.PlayerLoaded)
    public temporaryLoad(): void {
        const options = [];

        for (const jobType of Object.keys(TemporaryJobs)) {
            const temporaryJob = TemporaryJobs[jobType as JobType];
            const job = this.jobService.getJob(jobType as JobType);

            options.push({
                icon: temporaryJob.targetIcon,
                label: 'Allez au métier: ' + job.label,
                action: () => {
                    this.notifier.notify(
                        `${job.label} recrute, rendez vous au point sur votre carte pour prendre le métier`
                    );

                    SetNewWaypoint(temporaryJob.zone.center[0], temporaryJob.zone.center[1]);
                },
            });

            this.targetFactory.createForPed({
                model: temporaryJob.pedModel,
                coords: {
                    w: temporaryJob.zone.heading,
                    x: temporaryJob.zone.center[0],
                    y: temporaryJob.zone.center[1],
                    z: temporaryJob.zone.center[2],
                },
                width: temporaryJob.zone.width,
                length: temporaryJob.zone.length,
                invincible: true,
                blockevents: true,
                freeze: true,
                target: {
                    distance: 2.5,
                    options: [
                        {
                            icon: 'c:pole/start.png',
                            label: job.label,
                            job: JobType.Unemployed,
                            blackoutGlobal: true,
                            action: () => {
                                this.startJob(jobType as JobType);
                            },
                        },
                        {
                            icon: 'c:pole/restart.png',
                            label: 'Relancer',
                            job: jobType,
                            blackoutGlobal: true,
                            action: () => {
                                this.relaunchJob(jobType as JobType);
                            },
                        },
                        {
                            icon: 'c:pole/end.png',
                            label: 'Terminer',
                            job: jobType,
                            action: () => {
                                this.stopJob(jobType as JobType);
                            },
                        },
                    ],
                },
            });
        }

        this.targetFactory.createForPed({
            model: 'cs_barry',
            coords: {
                w: 341.95,
                x: 236.53,
                y: -409.22,
                z: 46.92,
            },
            invincible: true,
            blockevents: true,
            freeze: true,
            target: {
                distance: 2.5,
                options,
            },
        });

        this.blipFactory.create('temporary_job', {
            sprite: 280,
            name: 'Pôle emploi',
            color: 2,
            scale: 0.8,
            coords: { x: 236.53, y: -409.22, z: 47.92 },
        });
    }

    private async startJob(jobType: JobType) {
        const job = TemporaryJobs[jobType];

        TriggerServerEvent(ServerEvent.JOB_TEMPORARY_SET_JOB, jobType);
        const outfit = job.clothes[GetEntityModel(PlayerPedId())];

        if (!outfit) {
            return;
        }

        const { completed } = await this.playerWardrobe.waitProgress(false);

        if (!completed) {
            return;
        }

        TriggerServerEvent(ServerEvent.CHARACTER_SET_JOB_CLOTHES, outfit);

        const vehicleNetId = await emitRpc<number>(
            RpcServerEvent.VEHICLE_SPAWN_TEMPORARY,
            job.vehicleModel,
            job.vehicleSpawn
        );

        if (!vehicleNetId) {
            return;
        }

        this.jobVehicle = vehicleNetId;
        const vehicleEntity = NetworkGetEntityFromNetworkId(vehicleNetId);

        this.blipFactory.create('temporary_job_vehicle', {
            sprite: 225,
            color: 32,
            scale: 0.8,
            name: 'Véhicule de service',
            coords: { x: job.vehicleSpawn[0], y: job.vehicleSpawn[1], z: job.vehicleSpawn[2] },
        });

        this.notifier.notify('Monte dans ton véhicule de service pour commencer le travail.');

        while (!IsPedInVehicle(PlayerPedId(), vehicleEntity, true)) {
            await wait(100);
        }

        this.notifier.notify(job.description);

        this.blipFactory.remove('temporary_job_vehicle');
        this.startMission(jobType);
    }

    private startMission(jobType: JobType) {
        const job = TemporaryJobs[jobType];

        let newMissionIndex = getRandomInt(0, job.missionZones.length - 1);

        while (newMissionIndex === this.missionIndex) {
            newMissionIndex = getRandomInt(0, job.missionZones.length - 1);
        }

        const missionZone = job.missionZones[newMissionIndex];

        this.missionIndex = newMissionIndex;
        this.repeatCount = 1;
        this.entityDones = [];

        if (job.repeat) {
            this.repeatCount = getRandomInt(job.repeat.min, job.repeat.max);
        }

        this.blipFactory.create('temporary_job_mission', {
            sprite: 761,
            color: 32,
            scale: 0.8,
            name: 'Mission temporaire',
            coords: { x: missionZone.center[0], y: missionZone.center[1], z: missionZone.center[2] },
        });

        SetNewWaypoint(missionZone.center[0], missionZone.center[1]);

        this.targetFactory.createForBoxZone('temporary_mission', missionZone, [
            {
                icon: job.targetIcon,
                label: job.targetLabel,
                canInteract: entity => {
                    if (job.repeat && this.entityDones.includes(entity)) {
                        return false;
                    }

                    return job.targetCanInteract ? job.targetCanInteract(entity) : true;
                },
                action: entity => {
                    this.doMission(jobType, entity);
                },
            },
        ]);

        this.notifier.notify('Rendez-vous au point sur la carte pour continuer votre travail.');
    }

    private async doMission(jobType: JobType, entity: number) {
        const job = TemporaryJobs[jobType];

        const { completed } = await this.progressService.progress(
            'temporary_mission',
            `Travail en cours ${job.repeat ? this.repeatCount + ' restant(s)' : ''}...`,
            job.repeat ? 7_500 : 30_000,
            job.missionProgressAnimation,
            job.missionProgressOptions
        );

        if (!completed) {
            return;
        }

        this.repeatCount--;
        this.entityDones.push(entity);

        if (this.repeatCount > 0) {
            this.notifier.notify(`Continue comme ca, ${this.repeatCount} tâches restantes dans la zone.`);

            return;
        }

        this.successfulMission++;

        this.targetFactory.removeBoxZone('temporary_mission');
        this.blipFactory.remove('temporary_job_mission');

        if (this.successfulMission >= 4) {
            this.missionIndex = null;

            SetNewWaypoint(job.zone.center[0], job.zone.center[1]);
            this.notifier.notify('Retournez au point de départ pour continuer ou finir le travail.');

            return;
        }

        this.startMission(jobType);
    }

    private async relaunchJob(jobType: JobType) {
        const job = TemporaryJobs[jobType];

        if (this.successfulMission > 0) {
            const amount = this.successfulMission * job.missionMoney;

            TriggerServerEvent(ServerEvent.JOB_TEMPORARY_PAYOUT, amount);
        }

        this.successfulMission = 0;

        if (!this.jobVehicle || !DoesEntityExist(NetworkGetEntityFromNetworkId(this.jobVehicle))) {
            this.jobVehicle = await emitRpc<number>(
                RpcServerEvent.VEHICLE_SPAWN_TEMPORARY,
                job.vehicleModel,
                job.vehicleSpawn
            );
        }

        this.startMission(jobType);
    }

    private async stopJob(jobType: JobType) {
        const job = TemporaryJobs[jobType];

        if (this.successfulMission > 0) {
            const amount = this.successfulMission * job.missionMoney;

            TriggerServerEvent(ServerEvent.JOB_TEMPORARY_PAYOUT, amount);
        }

        this.successfulMission = 0;
        this.targetFactory.removeBoxZone('temporary_mission');
        this.blipFactory.remove('temporary_job_mission');

        TriggerServerEvent(ServerEvent.JOB_TEMPORARY_UNEMPLOYED, this.jobVehicle);
        this.jobVehicle = null;

        await this.playerWardrobe.waitProgress(false);

        TriggerServerEvent(ServerEvent.CHARACTER_SET_JOB_CLOTHES, null);
    }
}
