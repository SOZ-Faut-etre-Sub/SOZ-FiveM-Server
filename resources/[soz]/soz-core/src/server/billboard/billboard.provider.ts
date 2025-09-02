import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { uuidv4 } from '@public/core/utils';
import { billboardOffsets, getScreenModel } from '@public/shared/billboard';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { InventoryItem } from '@public/shared/inventory';
import { Item } from '@public/shared/item';
import { JobPermission, JobType } from '@public/shared/job';
import { WorldObject } from '@public/shared/object';
import {
    applyOffset,
    fromVector4Object,
    toVector3Object,
    toVector4Object,
    Vector4,
} from '@public/shared/polyzone/vector';
import axios from 'axios';

import { PrismaService } from '../database/prisma.service';
import { InventoryFactory } from '../inventory/inventory.factory';
import { ItemService } from '../item/item.service';
import { JobService } from '../job.service';
import { Monitor } from '../monitor/monitor';
import { Notifier } from '../notifier';
import { ObjectProvider } from '../object/object.provider';
import { PermissionService } from '../permission.service';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../player/progress.service';

@Provider()
export class BillboardProvider {
    @Inject(ItemService)
    private readonly itemService: ItemService;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Inject(ProgressService)
    private readonly progressService: ProgressService;

    @Inject(ObjectProvider)
    private readonly objectProvider: ObjectProvider;

    @Inject(Notifier)
    private readonly notifier: Notifier;

    @Inject(InventoryFactory)
    private readonly inventory: InventoryFactory;

    @Inject(Monitor)
    private readonly monitor: Monitor;

    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(PermissionService)
    private permissionService: PermissionService;

    @Inject(JobService)
    private jobService: JobService;

    private usedSlot = new Map<
        number,
        {
            id: string;
            index: number;
            url: string;
            job: JobType;
        }[]
    >();

    @Once()
    public init() {
        this.itemService.setItemUseCallback('soz_news_billboard_01', this.useBillboardProp.bind(this));
        this.itemService.setItemUseCallback('soz_news_billboard_02', this.useBillboardProp.bind(this));
        this.itemService.setItemUseCallback('soz_news_billboard_03', this.useBillboardProp.bind(this));
    }

    @Once(OnceStep.DatabaseConnected)
    public async onDatabaseConnected() {
        const dynamicBillboards = await this.prismaService.dynamic_prop_billboard.findMany();

        for (const billboard of dynamicBillboards) {
            const hashModel = GetHashKey(billboard.model);
            const job = billboard.job as JobType;
            const object: WorldObject = {
                id: billboard.id,
                model: GetHashKey(billboard.model),
                position: fromVector4Object(JSON.parse(billboard.position)),
                metadata: {
                    job,
                },
            };
            this.objectProvider.createObject(object);

            const slotsFormodel = this.getSlotsForModel(hashModel);
            const index = slotsFormodel.length + 1;
            const imageModel = getScreenModel(hashModel, index);

            const newObject: WorldObject = {
                id: billboard.id + '_image_0',
                model: GetHashKey(imageModel),
                position: applyOffset(object.position, billboardOffsets[object.model].offset),
                dynamicTexture: {
                    url: billboard.textureUrl,
                    index,
                    baseModel: hashModel,
                },
            };

            this.objectProvider.createObject(newObject);

            slotsFormodel.push({
                id: billboard.id,
                index,
                url: billboard.textureUrl,
                job,
            });
        }
    }

    private getSlotsForModel(hashModel: number) {
        let slotsFormodel = this.usedSlot.get(hashModel);
        if (!slotsFormodel) {
            slotsFormodel = [];
            this.usedSlot.set(hashModel, slotsFormodel);
        }
        return slotsFormodel;
    }

    private async useBillboardProp(source: number, item: Item, inventoryItem: InventoryItem) {
        const hashModel = GetHashKey(item.name);
        const conf = billboardOffsets[hashModel];
        const player = this.playerService.getPlayer(source);
        if (!player || !Object.keys(conf.max).includes(player.job.id)) {
            this.notifier.error(source, "Vous n'avez pas le droit d'utiliser cet objet.");
            return;
        }

        if (!player.job?.onduty) {
            this.notifier.error(source, 'Vous devez être en service pour utiliser cet objet.');
            return;
        }

        if (!(await this.jobService.hasPermission(player, player.job.id, JobPermission.NewsCreateBillboard))) {
            this.notifier.error(source, "Vous n'avez pas la permission d'utiliser cet objet.");
            return;
        }

        const slotsFormodel = this.getSlotsForModel(hashModel);
        if (slotsFormodel.filter(elem => elem.job === player.job.id).length >= conf.max[player.job.id]) {
            this.notifier.error(source, 'Tous les emplacements pour ce modèle sont utilisés');
            return;
        }

        TriggerClientEvent(
            ClientEvent.OBJECT_PLACE_ITEM,
            source,
            ServerEvent.BILLBOARD_PLACE_PROP,
            item.name,
            inventoryItem,
            false,
            'soz_news_billboard_03' == item.name
        );
    }

    @OnEvent(ServerEvent.BILLBOARD_PLACE_PROP)
    public async billboardUse(source: number, position: Vector4, inventoryItem: InventoryItem) {
        const progress = await this.progressService.progress(source, 'billboard_use', 'Placement en cours...', 10000, {
            dictionary: 'anim@amb@clubhouse@tutorial@bkr_tut_ig3@',
            name: 'machinic_loop_mechandplayer',
            options: {
                onlyUpperBody: true,
            },
        });

        if (!progress.completed) {
            return;
        }

        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        if (!(await this.jobService.hasPermission(player, player.job.id, JobPermission.NewsCreateBillboard))) {
            return;
        }

        const item = this.itemService.getItem(inventoryItem.name);

        const hashModel = GetHashKey(item.name);
        const conf = billboardOffsets[hashModel];
        const slotsFormodel = this.getSlotsForModel(hashModel);
        if (slotsFormodel.filter(elem => elem.job === player.job.id).length >= conf.max[player.job.id]) {
            this.notifier.error(source, 'Tous les emplacements pour ce modèle sont utilisés');
            return;
        }
        let index = 0;
        const total = Object.values(conf.max).reduce((prev, cur) => prev + cur, 0);
        for (let i = 1; i <= total; i++) {
            if (!slotsFormodel.find(elem => elem.index == i)) {
                index = i;
                break;
            }
        }

        if (index == 0) {
            this.notifier.error(source, 'Tous les emplacements pour ce modèle sont utilisés');
            return;
        }

        const inventory = await this.inventory.getPlayerInventory(source);
        if (!inventory.removeAtSlot(inventoryItem.slot, 1)) {
            this.notifier.error(source, `Il vous manque un ~b~${item.label}~s~.`);
            return;
        }

        /**
         * ENREGISTREMENT BDD
         */

        const objectId = `${inventoryItem.name}_${uuidv4()}`;

        this.usedSlot.get(hashModel).push({
            id: objectId,
            index,
            url: null,
            job: player.job.id,
        });

        await this.prismaService.dynamic_prop_billboard.create({
            data: {
                id: objectId,
                model: inventoryItem.name,
                position: JSON.stringify(toVector4Object(position)),
                job: player.job.id,
                createdAt: new Date(),
            },
        });

        const modelHash = GetHashKey(inventoryItem.name);
        const object: WorldObject = {
            id: objectId,
            model: modelHash,
            position: position,
            permanent: false,
            metadata: {
                job: player.job.id,
            },
        };

        this.objectProvider.createObject(object);
        const imageModel = getScreenModel(hashModel, index);

        const newObject: WorldObject = {
            id: objectId + '_image_0',
            model: GetHashKey(imageModel),
            position: applyOffset(object.position, billboardOffsets[object.model].offset),
            permanent: false,
            dynamicTexture: {
                index,
                url: null,
                baseModel: modelHash,
            },
        };

        this.objectProvider.createObject(newObject);

        this.monitor.traceEvent('prob_billboard_placement', {
            id: object.id,
            player_source: source,
            position: toVector3Object(position),
        });
    }

    @OnEvent(ServerEvent.BILLBOARD_UPDATE_PROP)
    public async updateBillboardProp(source: number, objectId: string, textureUrl?: string): Promise<void> {
        const object = this.objectProvider.getObject(objectId + '_image_0');
        if (!object) {
            return;
        }

        if (source !== -1) {
            const player = this.playerService.getPlayer(source);
            if (!player) {
                return;
            }

            if (!(await this.jobService.hasPermission(player, player.job.id, JobPermission.NewsUpdateBillboard))) {
                return;
            }
        }

        if (textureUrl && source !== -1 && !this.permissionService.isStaff(source)) {
            try {
                const resp = await axios.get(textureUrl);
                if (resp.status != 200 && resp.status != 304) {
                    this.notifier.error(source, 'URL non valide');
                    return;
                }
                const contentType = resp.headers['content-type'] ?? resp.headers['Content-Type'];
                if (!contentType || !contentType.toString().startsWith('image')) {
                    this.notifier.error(source, `L'URL n'est pas une image`);
                    return;
                }
            } catch (e) {
                this.notifier.error(source, 'URL non valide');
                return;
            }
        }

        await this.prismaService.dynamic_prop_billboard.update({
            where: { id: objectId },
            data: { textureUrl: textureUrl ?? '', updatedAt: new Date() },
        });
        object.dynamicTexture.url = textureUrl ?? '';
        this.objectProvider.updateObject(object);
        this.monitor.traceEvent('prob_billboard_image_update', {
            id: object.id,
            player_source: source,
            message: textureUrl,
        });
    }

    @OnEvent(ServerEvent.BILLBOARD_DELETE_PROP)
    public async deleteBillboardProp(source: number, objectId: string): Promise<void> {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        if (!(await this.jobService.hasPermission(player, player.job.id, JobPermission.NewsCreateBillboard))) {
            return;
        }

        this.objectProvider.deleteObject(objectId);
        this.objectProvider.deleteObject(objectId + '_image_0');
        const data = await this.prismaService.dynamic_prop_billboard.delete({ where: { id: objectId } });

        const hasModel = GetHashKey(data.model);
        const index = this.usedSlot.get(hasModel).findIndex(elem => elem.id === objectId);
        this.usedSlot.get(hasModel).splice(index, 1);

        this.monitor.traceEvent('prob_billboard_image_delete', {
            id: objectId,
            player_source: source,
        });
    }
}
