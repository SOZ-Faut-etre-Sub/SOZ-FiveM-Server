import { Once, OnceStep, OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { emitClientRpc } from '@public/core/rpc';
import { PrismaService } from '@public/server/database/prisma.service';
import { InventoryManager } from '@public/server/inventory/inventory.manager';
import { ItemService } from '@public/server/item/item.service';
import { Monitor } from '@public/server/monitor/monitor';
import { Notifier } from '@public/server/notifier';
import { ObjectProvider } from '@public/server/object/object.provider';
import { PlayerService } from '@public/server/player/player.service';
import { ProgressService } from '@public/server/player/progress.service';
import { ServerEvent } from '@public/shared/event';
import { InventoryItem, Item } from '@public/shared/item';
import { JobType } from '@public/shared/job';
import {
    canCropBeHarvest,
    canCropBeHilled,
    FDFConfig,
    FDFCrop,
    FDFCropConfig,
    FDFCropType,
    FDFFieldConfig,
    FDFGreenhouseConfig,
    FDFHarvestStatus,
    FDFPlowStatus,
    harvestDiff,
} from '@public/shared/job/fdf';
import { getLocationHash } from '@public/shared/locationhash';
import { getDistance, toVector3Object, Vector3 } from '@public/shared/polyzone/vector';
import { RpcClientEvent, RpcServerEvent } from '@public/shared/rpc';
import { formatDuration } from '@public/shared/utils/timeformat';

@Provider()
export class FDFFieldProvider {
    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(Monitor)
    private monitor: Monitor;

    private cropsPerField = new Map<string, Map<string, FDFCrop>>();
    private crops = new Map<string, FDFCrop>();
    private cropRemainingBeforePlow = new Map<string, number>();
    private dateBeforePlow = new Map<string, number>();

    @Once()
    public async onStart() {
        for (const config of Object.values(FDFCropConfig)) {
            this.itemService.setItemUseCallback(config.seed, this.plantSeed.bind(this));
        }
    }

    @Once(OnceStep.DatabaseConnected)
    public async retrievingData() {
        const databaseCrops = await this.prismaService.fdf_crops.findMany();

        databaseCrops.forEach(crop => {
            const data: FDFCrop = {
                coords: JSON.parse(crop.coords),
                hilled: crop.hilled,
                createdAt: crop.createdAt.getTime(),
                field: crop.field,
                type: crop.type as FDFCropType,
            };

            this.crops.set(crop.id, data);

            if (!this.cropsPerField.has(crop.field)) {
                this.cropsPerField.set(crop.field, new Map());
                this.cropRemainingBeforePlow.set(crop.field, 0);
            }

            this.cropsPerField.get(crop.field).set(crop.id, data);
            this.objectProvider.createObject({
                id: crop.id,
                model: FDFCropConfig[data.type].prop,
                position: [...data.coords, 0],
            });
        });
    }

    @OnEvent(ServerEvent.FDF_FIELD_PLANT)
    public onCropPlant(source: number, name: string) {
        const invItem = this.inventoryManager.findItem(source, item => item.name == name);
        const item = this.itemService.getItem(name);

        this.plantSeed(source, item, invItem);
    }

    public async plantSeed(source: number, item: Item, inventoryItem: InventoryItem): Promise<void> {
        try {
            const type = Object.values(FDFCropType).find(type => FDFCropConfig[type].seed == item.name);
            const config = FDFCropConfig[type];
            const player = this.playerService.getPlayer(source);

            if (!player) {
                return;
            }

            if (player.job.id != JobType.FDF || !player.job.onduty) {
                this.notifier.notify(
                    source,
                    'Seul les employés de Ferme de Fou en service peuvent utiliser ca',
                    'error'
                );
                return;
            }

            const ped = GetPlayerPed(source);
            if (GetVehiclePedIsIn(GetPlayerPed(source), false)) {
                this.notifier.notify(source, "Impossible d'utiliser cela dans un vehicule", 'error');
                return;
            }

            const coords = GetEntityCoords(ped) as Vector3;

            const field = Object.keys(config.fieldConfig.fields).find(fieldId =>
                config.fieldConfig.fields[fieldId].isPointInside(coords)
            );
            if (!field) {
                this.notifier.notify(source, "Impossible d'utiliser cela en dehors d'un champs", 'error');
                return;
            }

            const progress = await this.progressService.progress(
                source,
                'fdf_add_seeds',
                'Plantation en cours...',
                10000,
                {
                    task: 'WORLD_HUMAN_GARDENER_PLANT',
                }
            );

            if (!progress.completed) {
                return;
            }

            const isPositionOccupied = await emitClientRpc<[boolean, Vector3[]]>(RpcClientEvent.FDF_CHECK_ZONE, source);

            if (isPositionOccupied[0]) {
                return;
            }

            let cropsPlanted = 0;
            for (const coords of isPositionOccupied[1]) {
                const id = `fdf_crop_${getLocationHash(coords)}`;
                const items = this.cropsPerField.get(field);
                if (!items) {
                    this.notifier.notify(source, 'Impossible de placer un plant dans un champs non labouré', 'error');
                    break;
                }
                if (items.size > 0) {
                    const [first] = items.values();
                    if (first.type != type) {
                        this.notifier.notify(source, 'Impossible de mélanger les cultures dans le même champ', 'error');
                        break;
                    }

                    if (items.size >= config.fieldConfig.maxprop) {
                        this.notifier.notify(source, 'Il y a trop de plants dans ce champs', 'error');
                        break;
                    }

                    const cropField = Object.keys(config.fieldConfig.fields).find(fieldId =>
                        config.fieldConfig.fields[fieldId].isPointInside(coords)
                    );

                    if (cropField !== field) {
                        this.notifier.notify(source, "Une des graines n'est pas dans le champ.", 'error');
                        continue;
                    }

                    if (Array.from(items.values()).find(item => getDistance(item.coords, coords) < 1.5)) {
                        this.notifier.notify(
                            source,
                            "Une des graines est trop proche d'un autre plant et n'a pas été plantée.",
                            'warning'
                        );
                        continue;
                    }
                }

                const remainingBeforePlow = this.cropRemainingBeforePlow.get(field);
                if (remainingBeforePlow <= 0) {
                    this.notifier.notify(
                        source,
                        'La terre doit de nouveau être travaillée avant de pouvoir y semer de nouvelles graines',
                        'error'
                    );
                    break;
                }

                const date = new Date();

                if (
                    !this.inventoryManager.removeItemFromInventory(
                        source,
                        item.name,
                        1,
                        inventoryItem.metadata,
                        inventoryItem.slot
                    )
                ) {
                    this.notifier.notify(source, "Tu n'as pas assez de graines.", 'error');
                    break;
                }

                items.set(id, {
                    coords: coords,
                    createdAt: date.getTime(),
                    type: type,
                    hilled: false,
                    field: field,
                });
                this.crops.set(id, items.get(id));

                this.cropRemainingBeforePlow.set(field, remainingBeforePlow - 1);

                this.objectProvider.createObject({
                    id: id,
                    model: config.prop,
                    position: [...coords, 0],
                });

                await this.prismaService.fdf_crops.create({
                    data: {
                        id: id,
                        coords: JSON.stringify(coords),
                        field: field,
                        hilled: false,
                        type: type,
                        createdAt: date,
                    },
                });

                cropsPlanted++;
            }
            if (cropsPlanted) {
                this.notifier.notify(
                    source,
                    `Tu as planté ~y~${cropsPlanted}~s~ graines de ~b~${this.itemService.getItem(type).label}.~s~`
                );
            }

            this.monitor.publish(
                'fdf_plant',
                {
                    player_source: source,
                },
                {
                    type: type,
                    coords: coords,
                    field: field,
                }
            );
        } catch (error) {
            console.error(error);
        }
    }

    @OnEvent(ServerEvent.FDF_FIELD_HILLING)
    public async onCropHilling(source: number, id: string) {
        const crop = this.crops.get(id);
        if (!canCropBeHilled(crop)) {
            return;
        }
        const cropsIdToHill = [id];

        for (let i = 0; i < 2; i++) {
            const found = Array.from(this.cropsPerField.get(crop.field).entries()).find(
                ([itemId, item]) =>
                    getDistance(item.coords, crop.coords) < 2.2 &&
                    canCropBeHilled(item) &&
                    !cropsIdToHill.includes(itemId)
            );

            if (found) {
                cropsIdToHill.push(found[0]);
            }
        }

        let hilledCrops = 0;
        for (const cropId of cropsIdToHill) {
            const currentCrop = this.crops.get(cropId);

            this.monitor.publish(
                'job_fdf_field_hilling',
                {
                    player_source: source,
                    type: crop.type,
                },
                {
                    field: crop.field,
                    id: cropId,
                    position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
                }
            );

            currentCrop.hilled = true;

            await this.prismaService.fdf_crops.update({
                where: {
                    id: cropId,
                },
                data: {
                    hilled: true,
                },
            });
            hilledCrops++;
        }

        this.notifier.notify(
            source,
            `Vous avez ${FDFCropConfig[crop.type].fieldConfig.hillingLabel} ${hilledCrops} plant${
                hilledCrops > 1 ? 's' : ''
            }, il${hilledCrops > 1 ? 's' : ''} ser${hilledCrops > 1 ? 'ont' : 'a'} récoltable un peu plus tôt.`
        );

        crop.hilled = true;
    }

    @Rpc(RpcServerEvent.FDF_CROP_WITH_TRACTOR)
    public async onCropTractorHarvest(
        source: number,
        id: string,
        trailerPlate: string,
        context: { model: string; class: string; entity: number },
        trunkType: string
    ) {
        const crop = this.crops.get(id);
        const inv = await this.inventoryManager.getOrCreateInventory(trunkType, trailerPlate, context);
        const nbItem = FDFCropConfig[crop.type].harvestCount;
        const { success } = this.inventoryManager.addItemToInventoryNotPlayer(
            'trunk_' + trailerPlate,
            crop.type,
            nbItem
        );
        if (success) {
            this.removeCrop(source, crop, nbItem, id);
            this.notifier.notify(
                source,
                `Vous avez récolté ~y~${nbItem}~s~ ~g~${this.itemService.getItem(crop.type).label}~s~.`
            );
            return FDFHarvestStatus.SUCCESS;
        } else {
            return FDFHarvestStatus.INVENTORY_FULL;
        }
    }

    public async removeCrop(source: number, crop: FDFCrop, nbItem: number, id: string) {
        this.objectProvider.deleteObject(id);
        this.crops.delete(id);
        this.cropsPerField.get(crop.field).delete(id);
        if (this.cropsPerField.get(crop.field).size <= 0 && this.cropRemainingBeforePlow.get(crop.field) <= 0) {
            this.cropsPerField.delete(crop.field);
            this.dateBeforePlow.set(crop.field, Date.now() + FDFConfig.plowDelay);
        }

        this.monitor.publish(
            'job_fdf_field_harvest',
            {
                player_source: source,
                type: crop.type,
            },
            {
                field: crop.field,
                id: id,
                count: nbItem,
                position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
            }
        );

        await this.prismaService.fdf_crops.delete({
            where: {
                id: id,
            },
        });
    }

    @OnEvent(ServerEvent.FDF_FIELD_HARVEST)
    public async onCropHarvest(source: number, id: string) {
        const crop = this.crops.get(id);
        if (!canCropBeHarvest(crop)) {
            return;
        }

        const cropsIdToRemove = [id];

        for (let i = 0; i < 2; i++) {
            const found = Array.from(this.cropsPerField.get(crop.field).entries()).find(
                ([itemId, item]) =>
                    getDistance(item.coords, crop.coords) < 2.2 &&
                    canCropBeHarvest(item) &&
                    !cropsIdToRemove.includes(itemId)
            );

            if (found) {
                cropsIdToRemove.push(found[0]);
            }
        }

        let harvestCount = 0;
        let removedCrops = 0;
        for (const cropId of cropsIdToRemove) {
            const currentCrop = this.crops.get(cropId);
            const nbItem = FDFCropConfig[currentCrop.type].harvestCount;
            if (!this.inventoryManager.canCarryItem(source, currentCrop.type, nbItem)) {
                this.notifier.notify(
                    source,
                    `Vous ne possédez pas suffisamment de place dans votre inventaire pour récolter.`,
                    'error'
                );
                return 0;
            }

            this.inventoryManager.addItemToInventory(source, currentCrop.type, nbItem);
            harvestCount += nbItem;
            removedCrops += 1;
            this.removeCrop(source, currentCrop, nbItem, cropId);
        }
        this.notifier.notify(
            source,
            `Vous avez récolté ~y~${harvestCount}~s~ ~g~${
                this.itemService.getItem(crop.type).label
            }~s~ sur ~y~${removedCrops}~s~ plant${removedCrops > 1 ? 's' : ''}.`
        );
    }

    @OnEvent(ServerEvent.FDF_FIELD_DESTROY)
    public async onCropDestroy(source: number, id: string) {
        const crop = this.crops.get(id);
        if (!crop) {
            return;
        }

        this.notifier.notify(
            source,
            `Vous avez détruit un plant de ~r~${this.itemService.getItem(crop.type).label}~s~.`
        );

        this.objectProvider.deleteObject(id);
        this.crops.delete(id);
        this.cropsPerField.get(crop.field).delete(id);

        this.monitor.publish(
            'job_fdf_field_destroy',
            {
                player_source: source,
                type: crop.type,
            },
            {
                field: crop.field,
                id: id,
                position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
            }
        );
        await this.prismaService.fdf_crops.delete({
            where: {
                id: id,
            },
        });
    }

    @OnEvent(ServerEvent.FDF_FIELD_PLOW)
    public onFiledPlow(source: number, name: string) {
        this.cropsPerField.set(name, new Map());
        const fields = [FDFFieldConfig, FDFGreenhouseConfig];
        const config = fields.find(item => Object.keys(item.fields).includes(name));
        this.cropRemainingBeforePlow.set(name, config.maxprop);
        this.notifier.notify(
            source,
            `Vous avez terminé de ~g~labourer~s~ champ, il est maintenant prêt pour accueillir les plantations.`
        );

        this.monitor.publish(
            'job_fdf_field_plow',
            {
                player_source: source,
                field: name,
            },
            {
                position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
            }
        );
    }

    @Rpc(RpcServerEvent.FDF_PLOW_STATUS)
    public getPlowStatus(source: number, id): string {
        if (this.dateBeforePlow.get(id) > Date.now()) {
            return FDFPlowStatus.WAITING;
        }
        return FDFPlowStatus.AVALAIBLE;
    }

    @Rpc(RpcServerEvent.FDF_FIELD_ISPLOW)
    public isPlow(source: number, id: string): boolean {
        return !!this.cropsPerField.get(id);
    }

    @Rpc(RpcServerEvent.FDF_CROP_GET)
    public onHarvestGet(source: number, id: string): FDFCrop {
        return this.crops.get(id);
    }

    @Rpc(RpcServerEvent.FDF_GET_CROP_TO_TRACTOR_HARVEST)
    public async getCropsToHarvest(source: number, id: string) {
        const returnOject: Record<string, FDFCrop> = {};

        if (this.cropsPerField.get(id)) {
            for (const [cropId, crop] of this.cropsPerField.get(id)) {
                returnOject[cropId] = crop;
            }
        }

        return returnOject;
    }

    @OnEvent(ServerEvent.FDF_FIELD_CHECK)
    async drugsCheck(source: number, id: string): Promise<void> {
        const crop = this.crops.get(id);
        if (!crop) {
            return;
        }

        const diff = Math.max(harvestDiff(crop), 0);
        const config = FDFCropConfig[crop.type].fieldConfig;

        this.notifier.notify(
            source,
            `<span style="text-decoration: underline;">État de la plantation.</span>~n~` +
                (diff > 0
                    ? `<strong>Temps avant récolte :</strong> ${formatDuration(diff)}~n~`
                    : '<strong>Prêt à être récolté</strong>~n~') +
                `<strong>${config.hillLabel} :</strong> ${crop.hilled ? 'Oui' : 'Non'}`,
            'success'
        );
    }

    public exportData() {
        const ret = {
            Champs: {},
            Serres: {},
        };

        const fieldTypes = {
            Champs: FDFFieldConfig.fields,
            Serres: FDFGreenhouseConfig.fields,
        };

        for (const [kind, fields] of Object.entries(fieldTypes)) {
            for (const [name, field] of Object.entries(fields)) {
                const crops = this.cropsPerField.get(name);
                if (crops && crops.size > 0) {
                    const [firstValue] = crops.values();
                    ret[kind][name] = {
                        culture: this.itemService.getItem(firstValue.type).label,
                        count: crops.size,
                        location: [field.data[0], field.data[1], field.data[2]],
                    };
                } else {
                    ret[kind][name] = {
                        culture: null,
                        count: 0,
                        location: [field.data[0], field.data[1], field.data[2]],
                    };
                }
            }
        }

        return ret;
    }
}
