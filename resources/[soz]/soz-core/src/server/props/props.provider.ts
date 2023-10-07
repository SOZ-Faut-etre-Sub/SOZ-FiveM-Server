import { Command } from '@public/core/decorators/command';
import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import {
    DebugProp,
    PropCollection,
    PropCollectionData,
    PropServerData,
    WorldObject,
    WorldPlacedProp,
} from '@public/shared/object';
import { Err } from '@public/shared/result';
import { RpcServerEvent } from '@public/shared/rpc';

import { PrismaService } from '../database/prisma.service';
import { ItemService } from '../item/item.service';
import { Monitor } from '../monitor/monitor';
import { Notifier } from '../notifier';
import { ObjectProvider } from '../object/object.provider';
import { PermissionService } from '../permission.service';
import { PlayerService } from '../player/player.service';

@Provider()
export class PropsProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(PermissionService)
    private permissionService: PermissionService;

    private collections: Record<string, PropCollection> = {};
    private collectionOfProp: Record<string, string> = {};

    @Once(OnceStep.DatabaseConnected)
    public async loadObjectsOnStart() {
        const placedPropsDB = await this.prismaService.placed_prop.findMany();
        const propCollectionsDB = await this.prismaService.collection_prop.findMany();

        for (const propCollection of propCollectionsDB) {
            this.collections[propCollection.name] = {
                name: propCollection.name,
                creator_citizenID: propCollection.creator,
                creatorName: await this.playerService.getNameFromCitizenId(propCollection.creator),
                creation_date: propCollection.date,
                size: 0,
                loaded_size: 0,
                props: {},
            };
        }

        for (const placedProp of placedPropsDB) {
            if (!this.collections[placedProp.collection]) {
                continue;
            }
            const prop: WorldPlacedProp = {
                collection: placedProp.collection,
                loaded: false,
                model: placedProp.model,
                object: {
                    id: placedProp.unique_id,
                    model: GetHashKey(placedProp.model),
                    position: JSON.parse(placedProp.position),
                    matrix: placedProp.matrix ? JSON.parse(placedProp.matrix) : null,
                    noCollision: !placedProp.collision,
                },
            };
            this.collections[placedProp.collection].props[placedProp.unique_id] = prop;
            this.collections[placedProp.collection].size++;
            this.collectionOfProp[placedProp.unique_id] = placedProp.collection;
        }
    }

    @Rpc(RpcServerEvent.PROP_REQUEST_CREATE_COLLECTION)
    public async createCollection(source: number, collection_name: string): Promise<PropCollectionData[]> {
        if (this.collections[collection_name]) {
            this.notifier.notify(source, `La collection ${collection_name} existe déjà`, 'error');
        } else {
            const player = this.playerService.getPlayer(source);
            const creation_date = new Date();
            await this.prismaService.collection_prop.create({
                data: {
                    name: collection_name,
                    creator: player.citizenid,
                    date: creation_date,
                },
            });
            this.collections[collection_name] = {
                name: collection_name,
                creator_citizenID: player.citizenid,
                creatorName: player.charinfo.firstname + ' ' + player.charinfo.lastname,
                creation_date: creation_date,
                size: 0,
                loaded_size: 0,
                props: {},
            };
            this.notifier.notify(source, `La collection ${collection_name} a été créée`, 'success');

            this.monitor.publish(
                'hammer_create_collection',
                {
                    player_source: source,
                },
                {
                    collection_name: collection_name,
                }
            );
        }

        return this.getCollectionData(source);
    }

    @Rpc(RpcServerEvent.PROP_REQUEST_DELETE_COLLECTION)
    public async deleteCollection(source: number, collectionName: string): Promise<PropCollectionData[]> {
        const collection = this.collections[collectionName];
        if (!collection) {
            this.notifier.notify(source, `La collection ${collectionName} n'existe pas`, 'error');
        } else {
            this.unloadCollection(source, collection);
            await this.prismaService.collection_prop.delete({
                where: {
                    name: collectionName,
                },
            });
            delete this.collections[collectionName];
            this.notifier.notify(source, `La collection ${collectionName} a été supprimée`, 'success');

            this.monitor.publish(
                'hammer_delete_collection',
                {
                    player_source: source,
                },
                {
                    collection_name: collectionName,
                }
            );
        }
        return this.getCollectionData(source);
    }

    @Rpc(RpcServerEvent.PROP_REQUEST_CREATE_PROP)
    public async createProp(source: number, prop: DebugProp) {
        if (prop.collection && !this.collections[prop.collection]) {
            this.notifier.notify(
                source,
                `Impossible de créer le prop car sa collection ${prop.collection} n'existe pas`,
                'error'
            );
            return Err("Collection doesn't exist");
        }
        if (this.collectionOfProp[prop.id]) {
            this.notifier.notify(source, `Impossible de créer le prop car son id ${prop.id} existe déjà`, 'error');
            return Err('id already exist');
        }
        await this.prismaService.placed_prop.create({
            data: {
                unique_id: prop.id,
                model: prop.model,
                collection: prop.collection,
                position: JSON.stringify(prop.position),
                matrix: prop.matrix ? JSON.stringify(prop.matrix) : null,
                collision: prop.collision,
            },
        });

        this.collections[prop.collection].props[prop.id] = {
            collection: prop.collection,
            loaded: false,
            model: prop.model,
            object: {
                id: prop.id,
                model: GetHashKey(prop.model),
                position: prop.position,
                matrix: prop.matrix,
                noCollision: !prop.collision,
            },
        };
        this.collections[prop.collection].size++;
        this.collectionOfProp[prop.id] = prop.collection;

        this.monitor.publish(
            'hammer_create_prop',
            {
                player_source: source,
            },
            {
                prop: prop,
            }
        );

        this.notifier.notify(source, 'Le prop a bien été créé !', 'success');

        return this.collections[prop.collection].props[prop.id];
    }

    @OnEvent(ServerEvent.PROP_REQUEST_DELETE_PROP)
    public async deleteProps(source: number, propCollectionName: string, propId: string) {
        this.deletePropsToAllClients([propId]);

        const propCollection = this.collections[propCollectionName];
        if (!propCollection) {
            this.notifier.notify(
                source,
                `Impossible de supprimer l'objet ${propId} car sa collection n'existe pas.`,
                'error'
            );
            return;
        }

        if (!propCollection.props[propId]) {
            this.notifier.notify(source, `Impossible de supprimer l'objet ${propId} car il n'existe pas.`, 'error');
            return;
        }

        await this.prismaService.placed_prop.delete({
            where: {
                unique_id: propId,
            },
        });

        this.monitor.publish(
            'hammer_delete_prop',
            {
                player_source: source,
            },
            {
                prop: this.collectionOfProp[propId],
            }
        );

        delete this.collectionOfProp[propId];
        delete this.collections[propCollectionName].props[propId];
        this.collections[propCollectionName].size--;

        this.notifier.notify(source, `L'objet a été supprimés`, 'success');
    }

    @OnEvent(ServerEvent.PROP_REQUEST_EDIT_PROP)
    public async editProp(source: number, prop: WorldObject, loaded: boolean) {
        const collectionName = this.collectionOfProp[prop.id];
        const collection = this.collections[collectionName];

        if (!collectionName) {
            this.notifier.notify(source, `Impossible de modifier l'objet ${prop.id} car il n'existe pas.`, 'error');
            return;
        }

        await this.prismaService.placed_prop.update({
            where: {
                unique_id: prop.id,
            },
            data: {
                position: JSON.stringify(prop.position),
                matrix: prop.matrix ? JSON.stringify(prop.matrix) : null,
                collision: !prop.noCollision,
            },
        });

        const oldProp = collection.props[prop.id];
        oldProp.object.position = prop.position;
        oldProp.object.matrix = prop.matrix;
        oldProp.object.noCollision = prop.noCollision;

        if (loaded) {
            this.editPropToAllClients(prop);
        }

        this.monitor.publish(
            'hammer_edit_prop',
            {
                player_source: source,
            },
            {
                prop: prop,
            }
        );

        this.notifier.notify(source, `L'objet ${prop.id} a été modifié`, 'success');
    }

    @Rpc(RpcServerEvent.PROP_REQUEST_TOGGLE_LOAD_COLLECTION)
    public async toggleLoadCollection(source: number, collectionName: string, value: boolean) {
        if (!this.collections[collectionName]) {
            this.notifier.notify(
                source,
                `Impossible de charger ou décharger la collection ${collectionName} car elle n'existe pas.`,
                'error'
            );
            return;
        }
        if (value) {
            this.loadCollection(source, this.collections[collectionName]);
        } else {
            this.unloadCollection(source, this.collections[collectionName]);
        }

        this.monitor.publish(
            'hammer_load_unload_collection',
            {
                player_source: source,
            },
            {
                collection_name: collectionName,
                loading: value,
            }
        );

        return await this.getCollection(source, collectionName);
    }

    public loadCollection(source: number, collection: PropCollection) {
        collection.loaded_size = Object.keys(collection.props).length;
        this.createPropsToAllClients(
            Object.values(collection.props).map(item => {
                item.loaded = true;
                return item.object;
            })
        );
    }

    public unloadCollection(source: number, collection: PropCollection) {
        collection.loaded_size = 0;
        this.deletePropsToAllClients(
            Object.values(collection.props).map(item => {
                item.loaded = false;
                return item.object.id;
            })
        );
    }

    @Rpc(RpcServerEvent.PROP_GET_COLLECTIONS_DATA)
    public async getCollectionData(source: number): Promise<PropCollectionData[]> {
        const collectionDatas: PropCollectionData[] = [];
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const isStaff = this.permissionService.isStaff(source);

        for (const propCollection of Object.values(this.collections)) {
            if (!isStaff && player.citizenid != propCollection.creator_citizenID) {
                continue;
            }
            const creatorName = isStaff
                ? await this.playerService.getNameFromCitizenId(propCollection.creator_citizenID)
                : null;
            collectionDatas.push({
                name: propCollection.name,
                creator_citizenID: propCollection.creator_citizenID,
                creatorName: creatorName,
                creation_date: propCollection.creation_date,
                size: propCollection.size,
                loaded_size: propCollection.loaded_size,
            });
        }

        return collectionDatas;
    }

    @Rpc(RpcServerEvent.PROP_GET_PROP_COLLECTION)
    public async getCollection(source: number, collectionName: string): Promise<PropCollection> {
        const collection = this.collections[collectionName];

        if (!collection) {
            this.notifier.notify(source, `La collection ${collectionName} n'existe pas.`, 'error');
            return;
        }

        return collection;
    }

    @Rpc(RpcServerEvent.PROP_GET_SERVER_DATA)
    public async getPropServerData(): Promise<PropServerData> {
        let total = 0;
        let loaded = 0;
        Object.values(this.collections).forEach(collection => {
            total += collection.size;
            loaded += collection.loaded_size;
        });
        return {
            total: total,
            loaded: loaded,
        };
    }

    @Rpc(RpcServerEvent.PROP_GET_LOADED_PROPS)
    public async getLoadedProps(): Promise<WorldPlacedProp[]> {
        const loadedProps: WorldPlacedProp[] = [];
        Object.values(this.collections).forEach(collection => {
            Object.values(collection.props).forEach(prop => {
                if (prop.loaded) {
                    loadedProps.push(prop);
                }
            });
        });
        return loadedProps;
    }

    private async onUseSozHammer(source: number) {
        TriggerClientEvent(ClientEvent.PROP_OPEN_MENU, source);
    }

    @Once()
    public async onStart() {
        this.itemService.setItemUseCallback('soz_hammer', this.onUseSozHammer.bind(this));
    }

    public createPropsToAllClients(props: WorldObject[]) {
        this.objectProvider.addObjects(props);
    }
    public deletePropsToAllClients(propIds: string[]) {
        for (const propId of propIds) {
            this.objectProvider.deleteObject(propId);
        }
    }
    public async editPropToAllClients(prop: WorldObject) {
        this.objectProvider.updateObject(prop);
    }

    @Command('tpcollection', {
        role: ['staff', 'admin', 'gamemaster'],
        description: 'TP to a props collection (Admin Only)',
    })
    public tpcollection(source: number, collectionName: string) {
        const collection = this.collections[collectionName];
        if (!collection) {
            this.notifier.notify(source, `La collection ${collectionName} n'existe pas`, 'error');
            return;
        }

        const [firstProp] = Object.values(collection.props);
        if (!firstProp) {
            this.notifier.notify(source, `La collection ${collectionName} n'a pas de props`, 'error');
            return;
        }

        TriggerClientEvent(ClientEvent.PLAYER_TELEPORT, source, firstProp.object.position);
    }
}
