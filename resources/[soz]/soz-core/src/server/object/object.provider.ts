import { OnEvent } from '@core/decorators/event';
import { Exportable } from '@core/decorators/exports';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Rpc } from '@core/decorators/rpc';
import { uuidv4 } from '@core/utils';
import { InventoryManager } from '@public/server/inventory/inventory.manager';
import { Notifier } from '@public/server/notifier';
import { ProgressService } from '@public/server/player/progress.service';
import { joaat } from '@public/shared/joaat';

import { ClientEvent, ServerEvent } from '../../shared/event';
import { WorldObject } from '../../shared/object';
import { RpcServerEvent } from '../../shared/rpc';

const OBJETS_COLLECT_TO_ITEM_ID: Record<number, string> = {
    [joaat('prop_ld_greenscreen_01')]: 'n_fix_greenscreen',
    [joaat('prop_tv_cam_02')]: 'n_fix_camera',
    [joaat('prop_kino_light_01')]: 'n_fix_light',
    [joaat('v_ilev_fos_mic')]: 'n_fix_mic',
};

@Provider()
export class ObjectProvider {
    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(Notifier)
    private notifier: Notifier;

    private objects: Record<string, WorldObject> = {};

    public addObjects(objects: WorldObject[]): void {
        for (const object of objects) {
            this.objects[object.id] = object;
        }

        TriggerLatentClientEvent(ClientEvent.OBJECT_CREATE, -1, 16 * 1024, objects);
    }

    @OnEvent(ServerEvent.OBJECT_COLLECT)
    public async onObjectCollect(source: number, id: string) {
        const object = this.getObject(id);

        if (!object) {
            return;
        }

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

        const item = OBJETS_COLLECT_TO_ITEM_ID[object.model];

        if (!item) {
            return;
        }

        if (!this.inventoryManager.canCarryItem(source, item, 1)) {
            this.notifier.error(source, 'Vous ne pouvez pas récupérer cet objet');

            return;
        }

        this.inventoryManager.addItemToInventory(source, item, 1);
        this.deleteObject(id);
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
}
