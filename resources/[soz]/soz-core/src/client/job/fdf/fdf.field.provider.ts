import { Once, OnceStep } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { ItemService } from '@public/client/item/item.service';
import { Notifier } from '@public/client/notifier';
import { ObjectProvider } from '@public/client/object/object.provider';
import { PlayerService } from '@public/client/player/player.service';
import { ProgressService } from '@public/client/progress.service';
import { VEHICLE_TRUNK_TYPES } from '@public/client/vehicle/vehicle.lock.provider';
import { Rpc } from '@public/core/decorators/rpc';
import { emitRpc } from '@public/core/rpc';
import { wait } from '@public/core/utils';
import { ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';
import {
    canCropBeHarvest,
    canCropBeHilled,
    FDFConfig,
    FDFCrop,
    FDFCropConfig,
    FDFCropType,
    FDFFields,
    FDFGreenHouse,
    FDFHarvestStatus,
    FDFPlowStatus,
} from '@public/shared/job/fdf';
import { PolygonZone } from '@public/shared/polyzone/polygon.zone';
import { getDistance, Vector2, Vector3, Vector4 } from '@public/shared/polyzone/vector';
import { getRandomItems } from '@public/shared/random';
import { RpcClientEvent, RpcServerEvent } from '@public/shared/rpc';

import { TargetFactory, TargetOptions } from '../../target/target.factory';

const RAKE_TRAILER = GetHashKey('raketrailer');
const GRAIN_TRAILER = GetHashKey('graintrailer');
const TRACTOR2 = GetHashKey('tractor2');

const CheckPointMessages: Record<number, string> = {
    2: 'Excellent travail, continuez ainsi et le champ sera achevé rapidement.',
    5: 'Vous avez ~g~labouré~s~ la moitié du champ, continuez comme ça !',
    8: 'Nous y sommes presque, assurez-vous de bien couvrir tous les coins.',
};

@Provider()
export class FDFFieldProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(Notifier)
    private notifier: Notifier;

    private cachedCrop: FDFCrop;
    private cachedId: string;
    private updateTime = 0;

    private cachedField: boolean;
    private cachedFieldId: string;
    private updateTimeField = 0;

    @Once(OnceStep.PlayerLoaded)
    public async setupFDFField() {
        Object.values(FDFCropConfig).map(elem => {
            this.targetFactory.createForModel(elem.prop, [
                {
                    label: elem.fieldConfig.speedLabel,
                    color: JobType.FDF,
                    icon: 'c:fdf/buttage.png',
                    blackoutJob: JobType.FDF,
                    blackoutGlobal: true,
                    job: JobType.FDF,
                    canInteract: async entity => {
                        if (!this.playerService.isOnDuty()) {
                            return false;
                        }

                        const id = this.objectProvider.getIdFromEntity(entity);
                        if (!id) {
                            return;
                        }

                        const crop = await this.getCropStatus(id);
                        return canCropBeHilled(crop);
                    },
                    action: async entity => {
                        const id = this.objectProvider.getIdFromEntity(entity);

                        const { completed } = await this.progressService.progress(
                            'fdf_crop_hill',
                            elem.fieldConfig.progressText,
                            10000,
                            elem.fieldConfig.hillingAnim,
                            {
                                useAnimationService: true,
                            }
                        );

                        if (!completed) {
                            return;
                        }

                        TriggerServerEvent(ServerEvent.FDF_FIELD_HILLING, id);
                    },
                },
                {
                    label: 'Récolter',
                    color: JobType.FDF,
                    icon: 'c:fdf/harvest.png',
                    blackoutJob: JobType.FDF,
                    blackoutGlobal: true,
                    job: JobType.FDF,
                    canInteract: async entity => {
                        if (!this.playerService.isOnDuty()) {
                            return false;
                        }

                        const id = this.objectProvider.getIdFromEntity(entity);
                        if (!id) {
                            return;
                        }

                        const crop = await this.getCropStatus(id);
                        return canCropBeHarvest(crop);
                    },
                    action: async entity => {
                        const id = this.objectProvider.getIdFromEntity(entity);

                        const { completed } = await this.progressService.progress(
                            'fdf_crop_harvest',
                            'Récolte en cours...',
                            10000,
                            {
                                task: 'WORLD_HUMAN_GARDENER_PLANT',
                            },
                            {
                                useAnimationService: true,
                            }
                        );

                        if (!completed) {
                            return;
                        }

                        TriggerServerEvent(ServerEvent.FDF_FIELD_HARVEST, id);
                    },
                },
                {
                    label: 'Détruire',
                    color: JobType.FDF,
                    icon: 'c:crimi/destroy.png',
                    blackoutJob: JobType.FDF,
                    blackoutGlobal: true,
                    job: JobType.FDF,
                    canInteract: async entity => {
                        if (!this.playerService.isOnDuty()) {
                            return false;
                        }

                        const id = this.objectProvider.getIdFromEntity(entity);
                        if (!id) {
                            return false;
                        }

                        return true;
                    },
                    action: async entity => {
                        const id = this.objectProvider.getIdFromEntity(entity);

                        const { completed } = await this.progressService.progress(
                            'fdf_crop_destroy',
                            'Destruction en cours ...',
                            10000,
                            {
                                dictionary: 'melee@unarmed@streamed_core',
                                name: 'ground_attack_on_spot',
                                options: {
                                    repeat: true,
                                },
                            }
                        );
                        if (!completed) {
                            return;
                        }

                        TriggerServerEvent(ServerEvent.FDF_FIELD_DESTROY, id);
                    },
                },
                {
                    label: 'Vérifier',
                    color: JobType.FDF,
                    icon: 'c:crimi/time.png',
                    blackoutJob: JobType.FDF,
                    blackoutGlobal: true,
                    job: JobType.FDF,
                    canInteract: async entity => {
                        if (!this.playerService.isOnDuty()) {
                            return false;
                        }

                        const id = this.objectProvider.getIdFromEntity(entity);
                        if (!id) {
                            return false;
                        }

                        return true;
                    },
                    action: async entity => {
                        const id = this.objectProvider.getIdFromEntity(entity);

                        const { completed } = await this.progressService.progress(
                            'drugs_water',
                            'Vérification en cours ...',
                            4000,
                            {
                                dictionary: 'anim@amb@business@weed@weed_inspecting_lo_med_hi@',
                                name: 'weed_crouch_checkingleaves_idle_01_inspector',
                                options: {
                                    repeat: true,
                                },
                            }
                        );
                        if (!completed) {
                            return;
                        }

                        TriggerServerEvent(ServerEvent.FDF_FIELD_CHECK, id);
                    },
                },
            ]);
        });

        for (const [name, field] of Object.entries(FDFFields)) {
            this.fieldTarget(name, field, false);
        }

        for (const [name, field] of Object.entries(FDFGreenHouse)) {
            this.fieldTarget(name, field, true);
        }

        this.targetFactory.createForModel(RAKE_TRAILER, [
            {
                icon: 'c:fdf/plow.png',
                label: 'Labourer',
                blackoutJob: JobType.FDF,
                blackoutGlobal: true,
                job: JobType.FDF,
                canInteract: async () => {
                    if (!this.playerService.isOnDuty()) {
                        return false;
                    }

                    const coords = GetEntityCoords(PlayerPedId()) as Vector3;
                    const field = Object.keys(FDFFields).find(fieldId => FDFFields[fieldId].isPointInside(coords));

                    if (!field) {
                        return false;
                    }

                    return !(await this.getFieldPlowStatus(field));
                },
                action: async entity => {
                    this.tractorPlow(entity);
                },
            },
        ]);

        this.targetFactory.createForModel(GRAIN_TRAILER, [
            {
                icon: 'c:fdf/tractor.png',
                label: 'Récolter',
                blackoutJob: JobType.FDF,
                blackoutGlobal: true,
                job: JobType.FDF,
                canInteract: async () => {
                    if (!this.playerService.isOnDuty()) {
                        return false;
                    }

                    const coords = GetEntityCoords(PlayerPedId()) as Vector3;
                    const field = Object.keys(FDFFields).find(fieldId => FDFFields[fieldId].isPointInside(coords));

                    if (!field) {
                        return false;
                    }

                    return true;
                },
                action: async entity => {
                    this.tractorHarvest(entity);
                },
            },
        ]);
    }

    private async tractorHarvest(trailer: number) {
        const ped = PlayerPedId();
        const coords = GetEntityCoords(ped) as Vector3;
        const field = Object.keys(FDFFields).find(fieldId => FDFFields[fieldId].isPointInside(coords));

        const cropsToHarvest = await emitRpc<Record<string, FDFCrop>>(
            RpcServerEvent.FDF_GET_CROP_TO_TRACTOR_HARVEST,
            field
        );

        this.notifier.notify('Retourne à ton tracteur pour entamer la récolte.');

        for (let k = 0; k < 100; k++) {
            await wait(100);
            const veh = GetVehiclePedIsIn(ped, false);
            if (veh && GetEntityModel(GRAIN_TRAILER)) {
                break;
            }
        }

        this.notifier.notify("Allez, c'est parti.");

        let harvesting = true;
        while (Object.values(cropsToHarvest).length > 0 && harvesting) {
            const veh = GetVehiclePedIsIn(ped, false);
            const coords = GetEntityCoords(ped) as Vector3;
            if (!veh || GetEntityModel(veh) != TRACTOR2) {
                this.notifier.notify(
                    "Il faut être dans un tracteur pour récolter, y a plus qu'à ~r~recommencer~s~ ...",
                    'error'
                );
                break;
            }

            let outWarnDate;
            const [attached, attachedVed] = GetVehicleTrailerVehicle(veh);
            if (!attached || attachedVed != trailer) {
                this.notifier.notify("Elle est où la remorque ?, y a plus qu'à ~r~recommencer~s~ ...", 'error');
                break;
            }

            if (!FDFFields[field].isPointInside(coords)) {
                if (outWarnDate == 0) {
                    this.notifier.notify(
                        'Restez dans le champ, sinon il faudra ~r~recommencer~s~ tout le travail.',
                        'error'
                    );
                    outWarnDate = Date.now();
                } else if (Date.now() - outWarnDate > 10000) {
                    this.notifier.notify(
                        "Il faut être dans un champs pour récolter, y a plus qu'à ~r~recommencer~s~ ...",
                        'error'
                    );
                    break;
                }
            } else if (outWarnDate != 0) {
                outWarnDate = 0;
            }

            if (GetEntitySpeed(ped) * 3.6 > 20) {
                this.notifier.notify(
                    'Tu roule trop vite, tu as gâché tout le travail. Il va falloir tout refaire maintenant.',
                    'error'
                );
                break;
            }

            for (const [cropId, crop] of Object.entries(cropsToHarvest)) {
                const distance = crop.type === FDFCropType.corn ? 5 : 2;
                if (getDistance(crop.coords, coords) < distance && canCropBeHarvest(crop)) {
                    const vehicleModel = GetEntityModel(trailer);
                    const vehicleClass = GetVehicleClass(trailer);
                    const trunkType = VEHICLE_TRUNK_TYPES[vehicleModel] || 'trunk';
                    const vehicleNetworkId = NetworkGetNetworkIdFromEntity(trailer);

                    const cropped = await emitRpc<FDFHarvestStatus>(
                        RpcServerEvent.FDF_CROP_WITH_TRACTOR,
                        cropId,
                        GetVehicleNumberPlateText(trailer).trim(),
                        {
                            model: vehicleModel,
                            class: vehicleClass,
                            entity: vehicleNetworkId,
                        },
                        trunkType
                    );
                    if (cropped === FDFHarvestStatus.SUCCESS) {
                        delete cropsToHarvest[cropId];
                    } else if (cropped === FDFHarvestStatus.INVENTORY_FULL) {
                        this.notifier.notify('La remorque est pleine, décharge la.', 'error');
                        await wait(2000);
                        harvesting = false;
                        break;
                    }
                }
            }

            await wait(100);
        }
    }

    private async tractorPlow(trailer: number) {
        const ped = PlayerPedId();
        const coords = GetEntityCoords(ped) as Vector3;
        const field = Object.keys(FDFFields).find(fieldId => FDFFields[fieldId].isPointInside(coords));

        const plowStatus = await emitRpc<FDFPlowStatus>(RpcServerEvent.FDF_PLOW_STATUS, field);

        if (plowStatus === FDFPlowStatus.WAITING) {
            this.notifier.notify("Le champ doit reposer au moins une heure avant d'être à nouveau labouré.", 'error');
            return;
        }

        this.notifier.notify('Retourne à ton tracteur pour entamer le labour.');

        for (let k = 0; k < 100; k++) {
            await wait(100);
            const veh = GetVehiclePedIsIn(ped, false);
            if (veh && GetEntityModel(RAKE_TRAILER)) {
                break;
            }
        }

        const points = FDFFields[field].getPoints();
        const z = 0.5 * FDFFields[field].minZ + 0.5 * FDFFields[field].maxZ;
        const checkpoints: Vector2[] = [];
        while (checkpoints.length < FDFConfig.fieldCheckpointsCount) {
            const [point1, point2, point3] = getRandomItems(points, 3);
            const pound = Math.random();
            const res = [
                (1 - pound) * point1[0] + (pound / 2) * point2[0] + (pound / 2) * point3[0],
                (1 - pound) * point1[1] + (pound / 2) * point2[1] + (pound / 2) * point3[1],
            ] as Vector2;
            if (FDFFields[field].isPointInside([...res, z])) {
                checkpoints.push(res);
            }
        }

        let outWarnDate = 0;
        const done = new Array(checkpoints.length).fill(false);
        while (done.filter(Boolean).length < checkpoints.length) {
            const veh = GetVehiclePedIsIn(ped, false);
            const coords = GetEntityCoords(ped) as Vector3;
            if (!veh || GetEntityModel(veh) != TRACTOR2) {
                this.notifier.notify(
                    "Il faut être dans un tracteur pour labourer, y a plus qu'à ~r~recommencer~s~ ...",
                    'error'
                );
                break;
            }

            const [attached, attachedVed] = GetVehicleTrailerVehicle(veh);
            if (!attached || attachedVed != trailer) {
                this.notifier.notify("Elle est où la charrue?, y a plus qu'à ~r~recommencer~s~ ...", 'error');
                break;
            }

            if (!FDFFields[field].isPointInside(coords)) {
                if (outWarnDate == 0) {
                    this.notifier.notify(
                        'Restez dans le champ, sinon il faudra ~r~recommencer~s~ tout le travail.',
                        'error'
                    );
                    outWarnDate = Date.now();
                } else if (Date.now() - outWarnDate > 10000) {
                    this.notifier.notify(
                        "Il faut être dans un champs pour labourer, y a plus qu'à ~r~recommencer~s~ ...",
                        'error'
                    );
                    break;
                }
            } else if (outWarnDate != 0) {
                outWarnDate = 0;
            }

            if (GetEntitySpeed(ped) * 3.6 > 20) {
                this.notifier.notify(
                    'Tu roule trop vite, tu as gâché tout le travail. Il va falloir tout refaire maintenant.',
                    'error'
                );
                break;
            }

            for (let index = 0; index < checkpoints.length; index++) {
                if (done[index]) {
                    continue;
                }

                if (getDistance(coords, checkpoints[index]) < 8.0) {
                    done[index] = true;
                    const mesg = CheckPointMessages[done.filter(Boolean).length];
                    if (mesg) {
                        this.notifier.notify(mesg, 'success');
                    }
                }
            }

            await wait(100);
        }

        if (done.filter(Boolean).length == checkpoints.length) {
            TriggerServerEvent(ServerEvent.FDF_FIELD_PLOW, field);
        }
    }

    private fieldTarget(name: string, field: PolygonZone<Vector4>, withPlow: boolean) {
        const targets = Object.values(FDFCropType)
            .filter(type => Object.keys(FDFCropConfig[type].fieldConfig.fields).includes(name))
            .map(type => {
                const item = this.itemService.getItem(type);
                return {
                    icon: `c:fdf/${type}.png`,
                    label: 'Planter ' + item.label,
                    blackoutJob: JobType.FDF,
                    blackoutGlobal: true,
                    job: JobType.FDF,
                    item: FDFCropConfig[type].seed,
                    canInteract: async () => {
                        if (!this.playerService.isOnDuty()) {
                            return false;
                        }

                        return await this.getFieldPlowStatus(name);
                    },
                    action: async () => {
                        TriggerServerEvent(ServerEvent.FDF_FIELD_PLANT, FDFCropConfig[type].seed);
                    },
                } as TargetOptions;
            });

        if (withPlow) {
            targets.push({
                icon: 'c:fdf/plow.png',
                label: 'Labourer',
                blackoutJob: JobType.FDF,
                blackoutGlobal: true,
                job: JobType.FDF,
                canInteract: async () => {
                    if (!this.playerService.isOnDuty()) {
                        return false;
                    }

                    return !(await this.getFieldPlowStatus(name));
                },
                action: async () => {
                    const { completed } = await this.progressService.progress(
                        'fdf_crop_harvest',
                        'Labours en cours...',
                        60000,
                        {
                            dictionary: 'anim@amb@drug_field_workers@rake@male_a@base',
                            name: 'base',
                            options: {
                                repeat: true,
                            },
                            props: [
                                {
                                    model: 'prop_tool_shovel5',
                                    position: [0.0, 0.05, -0.7],
                                    rotation: [-13.5, 0.0, 0.0],
                                    bone: 28422,
                                },
                            ],
                        },
                        {
                            useAnimationService: true,
                        }
                    );

                    if (!completed) {
                        return;
                    }

                    TriggerServerEvent(ServerEvent.FDF_FIELD_PLOW, name);
                },
            });
        }

        this.targetFactory.createForPolygoneZone('fdf:field' + name, field, targets);
    }

    private async getCropStatus(id: string) {
        if (this.cachedCrop && this.cachedId == id && this.updateTime + 2000 > Date.now()) {
            return this.cachedCrop;
        }

        this.cachedCrop = await emitRpc<FDFCrop>(RpcServerEvent.FDF_CROP_GET, id);
        this.cachedId = id;
        this.updateTime = Date.now();

        return this.cachedCrop;
    }

    private async getFieldPlowStatus(name: string) {
        if (this.cachedField && this.cachedFieldId == name && this.updateTimeField + 2000 > Date.now()) {
            return this.cachedField;
        }

        this.cachedField = await emitRpc<boolean>(RpcServerEvent.FDF_FIELD_ISPLOW, name);
        this.cachedFieldId = name;
        this.updateTimeField = Date.now();

        return this.cachedField;
    }

    @Rpc(RpcClientEvent.FDF_CHECK_ZONE)
    public async checkZone(): Promise<[boolean, Vector3[]]> {
        const playerPed = PlayerPedId();
        const coords = GetEntityCoords(playerPed) as Vector3;
        const resultPosition: Vector3[] = [];

        if (IsPedInAnyVehicle(playerPed, true)) {
            this.notifier.notify("Impossible d'utiliser cela dans un vehicule", 'error');
            return [true, resultPosition];
        }

        if (IsEntityInWater(playerPed)) {
            this.notifier.notify("Impossible d'utiliser cela dans l'eau", 'error');
            return [true, resultPosition];
        }

        const offsets = [
            [0, 1, 0],
            [2, 1, 0],
            [-2, 1, 0],
        ];

        for (const offset of offsets) {
            const zone = GetOffsetFromEntityInWorldCoords(playerPed, offset[0], offset[1], offset[2]) as Vector3;
            const z = GetGroundZFor_3dCoord_2(zone[0], zone[1], zone[2], false);
            if (!z[0]) {
                continue;
            }
            zone[2] = z[1];

            if (getDistance(GetEntityCoords(playerPed, true) as Vector3, zone) > 3) {
                continue;
            }

            const rayHandle = StartShapeTestCapsule(
                coords[0],
                coords[1],
                coords[2],
                coords[0],
                coords[1],
                coords[2] + 1,
                0.8,
                58,
                playerPed,
                0
            );

            let result: [number, boolean, number[], number[], number];
            do {
                result = GetShapeTestResult(rayHandle);
                await wait(0);
            } while (result[0] == 1);

            if (result[0] == 0) {
                continue;
            }

            if (result[1]) {
                continue;
            }

            resultPosition.push(zone);
        }

        if (!resultPosition.length) {
            this.notifier.notify('Impossible de planter ici.', 'error');
            return [true, resultPosition];
        }

        return [false, resultPosition];
    }
}
