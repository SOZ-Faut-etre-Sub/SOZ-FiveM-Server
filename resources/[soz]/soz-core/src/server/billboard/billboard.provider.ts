import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { uuidv4 } from '@public/core/utils';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { InventoryItem } from '@public/shared/inventory';
import { Item } from '@public/shared/item';
import { JobType } from '@public/shared/job';
import { WorldObject } from '@public/shared/object';
import { fromVector4Object, toVector3Object, toVector4Object, Vector4 } from '@public/shared/polyzone/vector';

import { PrismaService } from '../database/prisma.service';
import { InventoryFactory } from '../inventory/inventory.factory';
import { ItemService } from '../item/item.service';
import { Monitor } from '../monitor/monitor';
import { Notifier } from '../notifier';
import { ObjectProvider } from '../object/object.provider';
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
            const object: WorldObject = {
                id: billboard.id,
                model: GetHashKey(billboard.model),
                position: fromVector4Object(JSON.parse(billboard.position)),
                placeOnGround: false,
                permanent: false,
                textureUrl: billboard.textureUrl,
                metadata: {
                    job: billboard.job as JobType,
                },
            };
            this.objectProvider.createObject(object);
        }
    }

    private async useBillboardProp(source: number, item: Item, inventoryItem: InventoryItem) {
        const player = this.playerService.getPlayer(source);
        if (!player || ![JobType.YouNews, JobType.News, JobType.FBI].includes(player.job.id)) {
            this.notifier.error(source, "Vous n'avez pas le droit d'utiliser cet objet.");
            return;
        }

        if (!player.job?.onduty) {
            this.notifier.error(source, 'Vous devez être en service pour utiliser cet objet.');
            return;
        }

        TriggerClientEvent(
            ClientEvent.OBJECT_PLACE_ITEM,
            source,
            ServerEvent.BILLBOARD_PLACE_PROP,
            item.name,
            inventoryItem,
            false
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

        const item = this.itemService.getItem(inventoryItem.name);
        const inventory = await this.inventory.getPlayerInventory(source);

        if (!inventory.removeAtSlot(inventoryItem.slot, 1)) {
            this.notifier.error(source, `Il vous manque un ~b~${item.label}~s~.`);
            return;
        }

        /**
         * ENREGISTREMENT BDD
         */

        const objectId = `${inventoryItem.name}_${uuidv4()}`;

        await this.prismaService.dynamic_prop_billboard.create({
            data: {
                id: objectId,
                model: inventoryItem.name,
                position: JSON.stringify(toVector4Object(position)),
                job: player.job.id,
                createdAt: new Date(),
            },
        });

        const object: WorldObject = {
            id: objectId,
            model: GetHashKey(inventoryItem.name),
            position: position,
            permanent: false,
            metadata: {
                job: player.job.id,
            },
        };

        this.monitor.traceEvent('prob_billboard_placement', {
            id: object.id,
            player_source: source,
            position: toVector3Object(position),
        });
        this.objectProvider.createObject(object);
    }

    @OnEvent(ServerEvent.BILLBOARD_UPDATE_PROP)
    public async updateBillboardProp(source: number, objectId: string, textureUrl?: string): Promise<void> {
        const object = this.objectProvider.getObject(objectId);
        if (!object) {
            return;
        }
        await this.prismaService.dynamic_prop_billboard.update({
            where: { id: objectId },
            data: { textureUrl: textureUrl ?? '', updatedAt: new Date() },
        });
        object.textureUrl = textureUrl ?? '';
        this.objectProvider.updateObject(object);
        this.monitor.traceEvent('prob_billboard_image_update', {
            id: object.id,
            player_source: source,
            message: textureUrl,
        });
    }

    @OnEvent(ServerEvent.BILLBOARD_DELETE_PROP)
    public async deleteBillboardProp(source: number, objectId: string): Promise<void> {
        this.objectProvider.deleteObject(objectId);
        await this.prismaService.dynamic_prop_billboard.delete({ where: { id: objectId } });
        this.monitor.traceEvent('prob_billboard_image_delete', {
            id: objectId,
            player_source: source,
        });
    }
}
