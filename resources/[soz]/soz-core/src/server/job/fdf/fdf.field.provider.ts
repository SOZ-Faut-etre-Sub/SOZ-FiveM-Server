import { Once, OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { emitClientRpc } from '@public/core/rpc';
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
    FDFCrop,
    FDFCropConfig,
    FDFCropType,
    FDFFieldConfig,
    FDFGreenhouseConfig,
    harvestDiff,
} from '@public/shared/job/fdf';
import { getLocationHash } from '@public/shared/locationhash';
import { getDistance, rad, toVector3Object, Vector3 } from '@public/shared/polyzone/vector';
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

    @Inject(Monitor)
    private monitor: Monitor;

    private cropsPerField = new Map<string, Map<string, FDFCrop>>();
    private crops = new Map<string, FDFCrop>();
    private cropRemainingBerforePlow = new Map<string, number>();

    @Once()
    public async onStart() {
        for (const config of Object.values(FDFCropConfig)) {
            this.itemService.setItemUseCallback(config.seed, this.plantSeed.bind(this));
        }
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

            const heading = GetEntityHeading(ped);
            coords[0] -= Math.sin(rad(heading));
            coords[1] += Math.cos(rad(heading));

            const isPositionOccupied = await emitClientRpc<[boolean, number]>(
                RpcClientEvent.FDF_CHECK_ZONE,
                source,
                coords
            );
            if (isPositionOccupied[0]) {
                return;
            }

            coords[2] = isPositionOccupied[1];

            const id = `fdf_crop_${getLocationHash(coords)}`;
            const items = this.cropsPerField.get(field);

            if (!items) {
                this.notifier.notify(source, 'Impossible placer un plant dans un champs non labouré', 'error');
                return;
            }
            if (items.size > 0) {
                const [first] = items.values();
                if (first.type != type) {
                    this.notifier.notify(source, 'Impossible de mélanger les cultures dans le même champ', 'error');
                    return;
                }

                if (items.size >= config.fieldConfig.maxprop) {
                    this.notifier.notify(source, 'Il y a trop de plants dans ce champs', 'error');
                    return;
                }

                for (const item of items.values()) {
                    if (getDistance(item.coords, coords) < 1) {
                        this.notifier.notify(source, 'Il y a un autre plant trop proche', 'error');
                        return;
                    }
                }
            }

            const remainingBeforePlow = this.cropRemainingBerforePlow.get(field);
            if (remainingBeforePlow <= 0) {
                this.notifier.notify(
                    source,
                    'La terre doit de nouveau être travaillée avant de pouvoir y semer de nouvelles graines',
                    'error'
                );
                return;
            }

            items.set(id, {
                coords: coords,
                createdAt: Date.now(),
                type: type,
                hilled: false,
                field: field,
            });
            this.crops.set(id, items.get(id));

            this.cropRemainingBerforePlow.set(field, remainingBeforePlow - 1);

            this.objectProvider.createObject({
                id: id,
                model: config.prop,
                position: [...coords, 0],
            });

            this.inventoryManager.removeItemFromInventory(
                source,
                item.name,
                1,
                inventoryItem.metadata,
                inventoryItem.slot
            );

            this.monitor.publish(
                'fdf_plant',
                {
                    player_source: source,
                },
                {
                    type: type,
                    coords: coords,
                    field: field[0],
                }
            );
        } catch (error) {
            console.error(error);
        }
    }

    @OnEvent(ServerEvent.FDF_FIELD_HILLING)
    public onCropHilling(source: number, id: string) {
        const crop = this.crops.get(id);
        if (!canCropBeHilled(crop)) {
            return;
        }

        crop.hilled = true;

        this.notifier.notify(source, FDFCropConfig[crop.type].fieldConfig.hillingText);

        this.monitor.publish(
            'job_fdf_field_hilling',
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
    }

    @OnEvent(ServerEvent.FDF_FIELD_HARVEST)
    public onCropHarvest(source: number, id: string) {
        const crop = this.crops.get(id);
        if (!canCropBeHarvest(crop)) {
            return;
        }

        const nbItem = FDFCropConfig[crop.type].harvestCount;
        if (!this.inventoryManager.canCarryItem(source, crop.type, nbItem)) {
            this.notifier.notify(
                source,
                `Vous ne possédez pas suffisamment de place dans votre inventaire pour récolter.`,
                'error'
            );
            return 0;
        }

        this.inventoryManager.addItemToInventory(source, crop.type, nbItem);

        this.notifier.notify(
            source,
            `Vous avez récolté ~y~${nbItem}~s~ ~g~${this.itemService.getItem(crop.type).label}~s~.`
        );

        this.objectProvider.deleteObject(id);
        this.crops.delete(id);
        this.cropsPerField.get(crop.field).delete(id);
        if (this.cropsPerField.get(crop.field).size <= 0) {
            this.cropsPerField.delete(crop.field);
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
    }

    @OnEvent(ServerEvent.FDF_FIELD_DESTROY)
    public onCropDestroy(source: number, id: string) {
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
    }

    @OnEvent(ServerEvent.FDF_FIELD_PLOW)
    public onFiledPlow(source: number, name: string) {
        this.cropsPerField.set(name, new Map());

        const fields = [FDFFieldConfig, FDFGreenhouseConfig];
        const config = fields.find(item => Object.keys(item.fields).includes(name));
        this.cropRemainingBerforePlow.set(name, config.maxprop);

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

    @Rpc(RpcServerEvent.FDF_FIELD_ISPLOW)
    public isPlow(source: number, id: string): boolean {
        return !!this.cropsPerField.get(id);
    }

    @Rpc(RpcServerEvent.FDF_CROP_GET)
    public onHarvestGet(source: number, id: string): FDFCrop {
        return this.crops.get(id);
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
}
