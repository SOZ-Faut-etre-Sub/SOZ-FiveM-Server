import { OnEvent } from '@core/decorators/event';
import { Exportable } from '@core/decorators/exports';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Rpc } from '@core/decorators/rpc';
import { emitClientRpc } from '@core/rpc';
import { uuidv4 } from '@core/utils';
import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { Notifier } from '@public/server/notifier';
import { ProgressService } from '@public/server/player/progress.service';
import { joaat } from '@public/shared/joaat';
import { Vector4 } from '@public/shared/polyzone/vector';
import { isErr } from '@public/shared/result';

import { ClientEvent, ServerEvent } from '../../shared/event';
import { WorldObject } from '../../shared/object';
import { RpcClientEvent, RpcServerEvent } from '../../shared/rpc';
import { ItemService } from '../item/item.service';

const OBJETS_COLLECT_TO_ITEM_ID: Record<number, string | null> = {
    [joaat('prop_ld_greenscreen_01')]: 'n_fix_greenscreen',
    [joaat('prop_tv_cam_02')]: 'n_fix_camera',
    [joaat('prop_kino_light_01')]: 'n_fix_light',
    [joaat('v_ilev_fos_mic')]: 'n_fix_mic',
};

@Provider()
export class ObjectProvider {
    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ItemService)
    private itemService: ItemService;

    private objects: Record<string, WorldObject> = {};

    public addObjects(objects: WorldObject[]): void {
        for (const object of objects) {
            this.objects[object.id] = object;
        }

        TriggerLatentClientEvent(ClientEvent.OBJECT_CREATE, -1, 16 * 1024, objects);
    }

    public async getGroundPositionForObject(
        source: number,
        object: string,
        rotation: number,
        offset = 0
    ): Promise<Vector4> {
        return await emitClientRpc<Vector4>(
            RpcClientEvent.OBJECT_GET_GROUND_POSITION,
            source,
            object,
            offset,
            rotation
        );
    }

    @OnEvent(ServerEvent.OBJECT_PLACE)
    public async onPlaceObject(source: number, item: string, object: string, position: Vector4) {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (!inventory.remove(item, 1, false)) {
            this.notifier.error(source, 'Vous ne possédez pas cet objet.');

            return;
        }

        const { completed } = await this.progressService.progress(
            source,
            'spawn_object',
            'Disposition en cours',
            2500,
            {
                dictionary: 'anim@narcotics@trash',
                name: 'drop_front',
                options: {
                    onlyUpperBody: true,
                },
            },
            {
                disableMouse: false,
                disableMovement: true,
                disableCombat: true,
                disableCarMovement: true,
            }
        );

        if (!completed) {
            inventory.add(item);

            return;
        }

        this.createObject({
            id: uuidv4(),
            model: GetHashKey(object),
            position,
        });
    }

    @OnEvent(ServerEvent.OBJECT_COLLECT)
    public async onObjectCollect(source: number, id: string) {
        const { completed } = await this.progressService.progress(
            source,
            'object:collect',
            'Récupération en cours',
            2500,
            {
                dictionary: 'weapons@first_person@aim_rng@generic@projectile@thermal_charge@',
                name: 'plant_floor',
                options: {
                    onlyUpperBody: true,
                },
            }
        );

        if (!completed) {
            return;
        }

        const object = this.getObject(id);

        if (!object) {
            return;
        }

        const item = OBJETS_COLLECT_TO_ITEM_ID[object.model];

        if (!item) {
            this.deleteObject(id);

            return;
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (isErr(inventory.add(item, 1))) {
            this.notifier.error(source, 'Vous ne pouvez pas récupérer cet objet');

            return;
        }

        this.deleteObject(id);

        const itemDef = this.itemService.getItem(item);
        this.notifier.notify(source, `Vous avez récupéré ~g~${itemDef.label}~s~.`);
    }

    @Rpc(RpcServerEvent.OBJECT_GET_LIST)
    public getObjects(): WorldObject[] {
        return Object.values(this.objects);
    }

    @Exportable('CreateObject')
    public createObjectFromExternal(object: Omit<WorldObject, 'id'>): string {
        const id = uuidv4();
        const worldObject = { ...object, id };

        this.createObject(worldObject);

        return id;
    }

    public createObject(object: WorldObject): string {
        this.addObjects([object]);

        return object.id;
    }

    @Exportable('DeleteObject')
    public deleteObject(id: string): void {
        this.deleteObjects([id]);
    }

    public deleteObjects(ids: string[]): void {
        for (const id of ids) {
            delete this.objects[id];
        }

        TriggerLatentClientEvent(ClientEvent.OBJECT_DELETE, -1, 16 * 1024, ids);
    }

    public getObject(id: string): WorldObject {
        return this.objects[id];
    }

    public updateObject(object: WorldObject) {
        this.objects[object.id] = object;

        TriggerClientEvent(ClientEvent.OBJECT_EDIT, -1, object);
    }

    @OnEvent(ServerEvent.OBJECT_DELETE)
    public async onObjectDelete(source: number, id: string) {
        this.deleteObject(id);
    }
}
