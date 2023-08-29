import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { PropCollection, PropCollectionData, PropServerData, WorldPlacedProp } from '@public/shared/object';
import { Err } from '@public/shared/result';
import { RpcServerEvent } from '@public/shared/rpc';

import { PrismaService } from '../database/prisma.service';
import { ItemService } from '../item/item.service';
import { Notifier } from '../notifier';
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
                unique_id: placedProp.unique_id,
                model: placedProp.model,
                collection: placedProp.collection,
                position: JSON.parse(placedProp.position),
                matrix: placedProp.matrix ? JSON.parse(placedProp.matrix) : null,
                loaded: false,
                collision: placedProp.collision,
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
            const citizenId = this.playerService.getPlayer(source).citizenid;
            const creation_date = new Date();
            await this.prismaService.collection_prop.create({
                data: {
                    name: collection_name,
                    creator: citizenId,
                    date: creation_date,
                },
            });
            this.collections[collection_name] = {
                name: collection_name,
                creator_citizenID: citizenId,
                creation_date: creation_date,
                size: 0,
                loaded_size: 0,
                props: {},
            };
            this.notifier.notify(source, `La collection ${collection_name} a été créée`, 'success');
        }
        return this.getCollectionData();
    }

    @Rpc(RpcServerEvent.PROP_REQUEST_DELETE_COLLECTION)
    public async deleteCollection(source: number, collectionName: string): Promise<PropCollectionData[]> {
        if (!this.collections[collectionName]) {
            this.notifier.notify(source, `La collection ${collectionName} n'existe pas`, 'error');
        } else {
            const propsToDelete = Object.keys(this.collections[collectionName].props);
            await this.deleteProps(source, propsToDelete); // Need to delete props of this collection!
            await this.prismaService.collection_prop.delete({
                where: {
                    name: collectionName,
                },
            });
            delete this.collections[collectionName];
            this.notifier.notify(source, `La collection ${collectionName} a été supprimée`, 'success');
        }
        return this.getCollectionData();
    }

    @Rpc(RpcServerEvent.PROP_REQUEST_CREATE_PROP)
    public async createProps(source: number, prop: WorldPlacedProp) {
        if (prop.collection && !this.collections[prop.collection]) {
            this.notifier.notify(
                source,
                `Impossible de créer le prop ${prop.unique_id} car sa collection ${prop.collection} n'existe pas`,
                'error'
            );
            return Err("Collection doesn't exist");
        }

        if (this.collections[prop.collection].props[prop.unique_id]) {
            this.notifier.notify(
                source,
                `Impossible de créer le prop ${prop.unique_id} car il existe déjà dans la collection ${prop.collection}`,
                'error'
            );
            return Err('Prop already exists');
        }

        await this.prismaService.placed_prop.create({
            data: {
                unique_id: prop.unique_id,
                model: prop.model,
                collection: prop.collection,
                position: JSON.stringify(prop.position),
                matrix: prop.matrix ? JSON.stringify(prop.matrix) : null,
                collision: prop.collision ? prop.collision : true,
            },
        });

        this.collections[prop.collection].props[prop.unique_id] = prop;
        this.collections[prop.collection].size++;
        this.collectionOfProp[prop.unique_id] = prop.collection;

        this.notifier.notify(source, 'Le prop a bien été créé !', 'success');

        return await this.getCollection(source, prop.collection);
    }

    // Need to unload before deleting!
    @OnEvent(ServerEvent.PROP_REQUEST_DELETE_PROPS)
    public async deleteProps(source: number, propIds: string[]) {
        await this.unloadProps(source, propIds);

        for (const propId of propIds) {
            const propCollectionName = this.collectionOfProp[propId];
            if (!propCollectionName) {
                this.notifier.notify(
                    source,
                    `Impossible de supprimer l'objet ${propId} car il n'a pas de collection.`,
                    'error'
                );
                continue;
            }
            const propCollection = this.collections[propCollectionName];
            if (!propCollection) {
                this.notifier.notify(
                    source,
                    `Impossible de supprimer l'objet ${propId} car sa collection n'existe pas.`,
                    'error'
                );
                continue;
            }
            if (!propCollection.props[propId]) {
                this.notifier.notify(source, `Impossible de supprimer l'objet ${propId} car il n'existe pas.`, 'error');
                continue;
            }

            await this.prismaService.placed_prop.delete({
                where: {
                    unique_id: propId,
                },
            });

            delete this.collectionOfProp[propId];
            delete this.collections[propCollectionName].props[propId];
            this.collections[propCollectionName].size--;
        }
        this.notifier.notify(source, `Les props ont été supprimés`, 'success');
    }

    @OnEvent(ServerEvent.PROP_REQUEST_EDIT_PROP)
    public async editProp(source: number, prop: WorldPlacedProp) {
        if (!prop.collection || !this.collections[prop.collection]) {
            this.notifier.notify(
                source,
                `Impossible de modifier l'objet ${prop.unique_id} car sa collection n'existe pas.`,
                'error'
            );
            return;
        }

        if (!this.collections[prop.collection].props[prop.unique_id]) {
            this.notifier.notify(
                source,
                `Impossible de modifier l'objet ${prop.unique_id} car il n'existe pas.`,
                'error'
            );
            return;
        }

        await this.prismaService.placed_prop.update({
            where: {
                unique_id: prop.unique_id,
            },
            data: {
                model: prop.model,
                collection: prop.collection,
                position: JSON.stringify(prop.position),
                matrix: prop.matrix ? JSON.stringify(prop.matrix) : null,
                collision: prop.collision ? prop.collision : true,
            },
        });

        this.collections[prop.collection].props[prop.unique_id] = prop;

        await this.editPropToAllClients(prop.unique_id, prop);

        this.notifier.notify(source, `L'objet ${prop.unique_id} a été modifié`, 'success');
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
        const keys = Object.keys(this.collections[collectionName].props);
        if (value) {
            await this.loadProps(source, keys);
        } else {
            await this.unloadProps(source, keys);
        }
        return await this.getCollection(source, collectionName);
    }

    @OnEvent(ServerEvent.PROP_REQUEST_LOAD_PROPS)
    public async loadProps(source: number, propIds: string[]) {
        const propsToLoad: WorldPlacedProp[] = [];

        for (const propId of propIds) {
            const propCollection = this.collectionOfProp[propId];
            if (!propCollection) {
                this.notifier.notify(
                    source,
                    `Impossible de charger l'objet ${propId} car sa collection n'existe pas.`,
                    'error'
                );
                continue;
            }
            const prop = this.collections[propCollection].props[propId];
            if (!prop) {
                this.notifier.notify(source, `Impossible de charger l'objet ${propId} car il n'existe pas.`, 'error');
                continue;
            }
            propsToLoad.push(prop);
            if (!this.collections[propCollection].props[propId].loaded) {
                this.collections[propCollection].loaded_size++;
            }
            this.collections[propCollection].props[propId].loaded = true;
        }

        await this.createPropsToAllClients(propsToLoad);
    }

    @Rpc(RpcServerEvent.PROP_REQUEST_UNLOAD_PROPS)
    public async unloadProps(source: number, propIds: string[]) {
        const propIdsToUnload: string[] = [];

        for (const propId of propIds) {
            const propCollection = this.collectionOfProp[propId];
            if (!propCollection) {
                this.notifier.notify(
                    source,
                    `Impossible de décharger l'objet ${propId} car sa collection n'existe pas.`,
                    'error'
                );
                continue;
            }
            const prop = this.collections[propCollection].props[propId];
            if (!prop) {
                this.notifier.notify(source, `Impossible de charger l'objet ${propId} car il n'existe pas.`, 'error');
                continue;
            }
            propIdsToUnload.push(prop.unique_id);
            if (this.collections[propCollection].props[propId].loaded) {
                this.collections[propCollection].loaded_size--;
            }
            this.collections[propCollection].props[propId].loaded = false;
        }

        await this.deletePropsToAllClients(propIdsToUnload);
    }

    @Rpc(RpcServerEvent.PROP_GET_COLLECTIONS_DATA)
    public async getCollectionData(): Promise<PropCollectionData[]> {
        const collectionDatas: PropCollectionData[] = [];

        for (const propCollection of Object.values(this.collections)) {
            collectionDatas.push({
                name: propCollection.name,
                creator_citizenID: propCollection.creator_citizenID,
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

    public async createPropsToClient(source: number, props: WorldPlacedProp[]) {
        TriggerClientEvent(ClientEvent.PROP_CREATE_CLIENTSIDE, source, props);
    }
    public async createPropsToAllClients(props: WorldPlacedProp[]) {
        TriggerClientEvent(ClientEvent.PROP_CREATE_CLIENTSIDE, -1, props);
    }
    public async deletePropsToClient(source: number, propIds: string[]) {
        TriggerClientEvent(ClientEvent.PROP_DELETE_CLIENTSIDE, source, propIds);
    }
    public async deletePropsToAllClients(propIds: string[]) {
        TriggerClientEvent(ClientEvent.PROP_DELETE_CLIENTSIDE, -1, propIds);
    }
    public async editPropToClient(source: number, propId: string, prop: WorldPlacedProp) {
        TriggerClientEvent(ClientEvent.PROP_EDIT_CLIENTSIDE, source, propId, prop);
    }
    public async editPropToAllClients(propId: string, prop: WorldPlacedProp) {
        TriggerClientEvent(ClientEvent.PROP_EDIT_CLIENTSIDE, -1, prop);
    }
}
