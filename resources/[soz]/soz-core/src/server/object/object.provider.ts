import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { uuidv4 } from '@public/core/utils';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { PropCollection, PropCollectionData, PropServerData, WorldPlacedProp } from '@public/shared/object';
import { Err } from '@public/shared/result';
import { RpcServerEvent } from '@public/shared/rpc';

import { PrismaService } from '../database/prisma.service';
import { Notifier } from '../notifier';

@Provider()
export class ObjectProvider {
    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(Notifier)
    private notifier: Notifier;

    private objects: Record<string, WorldPlacedProp> = {}; // unique_ID -> WorldPlacedProp
    private collections: Record<string, string[]> = {}; // Collection -> unique_ID[]

    @Once(OnceStep.DatabaseConnected)
    public async loadObjectsOnStart() {
        const placedPropsDB = await this.prismaService.placed_prop.findMany();
        for (const placedProp of placedPropsDB) {
            if (placedProp.collection) {
                if (!this.collections[placedProp.collection]) {
                    this.collections[placedProp.collection] = [];
                }
                this.collections[placedProp.collection].push(placedProp.unique_id);
            }
            this.objects[placedProp.unique_id] = {
                unique_id: placedProp.unique_id,
                model: placedProp.model,
                collection: placedProp.collection,
                position: JSON.parse(placedProp.position),
                matrix: (placedProp.matrix ? JSON.parse(placedProp.matrix) : null) as Float32Array | null,
                loaded: false,
            };
        }
    }
    @Rpc(RpcServerEvent.PROP_REQUEST_CREATE_COLLECTION)
    public async createCollection(source: number, collection: string): Promise<PropCollectionData[]> {
        if (this.collections[collection]) {
            this.notifier.notify(source, `La collection ${collection} existe déjà`, 'error');
        } else {
            this.collections[collection] = [];
            this.notifier.notify(source, `La collection ${collection} a été créée`, 'success');
        }
        return this.getCollectionData();
    }

    @Rpc(RpcServerEvent.PROP_REQUEST_DELETE_COLLECTION)
    public async deleteCollection(source: number, collectionName: string): Promise<PropCollectionData[]> {
        if (!this.collections[collectionName]) {
            this.notifier.notify(source, `La collection ${collectionName} n'existe pas`, 'error');
        } else {
            console.log(`I am trying to delete the collection ${collectionName}`);
            console.log(this.collections[collectionName]);
            await this.deleteProps(source, this.collections[collectionName]); // Need to delete props of this collection!
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
        const id = uuidv4();
        await this.prismaService.placed_prop.create({
            data: {
                unique_id: id,
                model: prop.model,
                collection: prop.collection,
                position: JSON.stringify(prop.position),
                matrix: prop.matrix ? JSON.stringify(prop.matrix) : null,
            },
        });
        const newProp: WorldPlacedProp = {
            ...prop,
            unique_id: id,
        };

        this.objects[id] = newProp;
        if (newProp.collection) {
            this.collections[newProp.collection].push(newProp.unique_id);
        }
        console.log(`collection ${newProp.collection}`);
        console.log(this.collections[newProp.collection]);
        return await this.getCollection(source, newProp.collection);
    }

    // Need to unload before deleting!
    @OnEvent(ServerEvent.PROP_REQUEST_DELETE_PROPS)
    public async deleteProps(source: number, propIds: string[]) {
        await this.unloadProps(source, propIds);
        for (const propId of propIds) {
            if (!this.objects[propId]) {
                this.notifier.notify(source, `Impossible de supprimer l'objet ${propId} car il n'existe pas.`, 'error');
                continue;
            }
            await this.prismaService.placed_prop.delete({
                where: {
                    unique_id: propId,
                },
            });
            const collection = this.objects[propId].collection;
            if (collection && this.collections[collection]) {
                this.collections[collection] = this.collections[collection].filter(id => id !== propId);
            }
            delete this.objects[propId];
        }
        this.notifier.notify(source, `Les props ont été supprimés`, 'success');
    }

    @OnEvent(ServerEvent.PROP_REQUEST_EDIT_PROP)
    public async editProp(source: number, prop: WorldPlacedProp) {
        if (!this.objects[prop.unique_id]) {
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
            },
        });
        // We expect the collection to remain the same
        this.objects[prop.unique_id] = prop;

        await this.editPropToAllClients(prop.unique_id, prop);

        this.notifier.notify(source, `L'objet ${prop.unique_id} a été modifié`, 'success');
    }

    @Rpc(RpcServerEvent.PROP_REQUEST_TOGGLE_LOAD_COLLECTION)
    public async toggleLoadCollection(source: number, collection: string, value: boolean) {
        if (!this.collections[collection]) {
            this.notifier.notify(
                source,
                `Impossible de charger ou décharger la collection ${collection} car elle n'existe pas.`,
                'error'
            );
            return;
        }
        if (value) {
            await this.loadProps(source, this.collections[collection]);
        } else {
            await this.unloadProps(source, this.collections[collection]);
        }
        return await this.getCollection(source, collection);
    }

    @OnEvent(ServerEvent.PROP_REQUEST_LOAD_PROPS)
    public async loadProps(source: number, propIds: string[]) {
        const propsToLoad: WorldPlacedProp[] = [];

        for (const propId of propIds) {
            const prop = this.objects[propId];
            if (!prop) {
                this.notifier.notify(source, `Impossible de charger l'objet ${propId} car il n'existe pas.`, 'error');
                continue;
            }
            propsToLoad.push(prop);
            this.objects[propId].loaded = true;
        }

        await this.createPropsToAllClients(propsToLoad);
    }

    @Rpc(RpcServerEvent.PROP_REQUEST_UNLOAD_PROPS)
    public async unloadProps(source: number, propIds: string[]) {
        const propIdsToUnload: string[] = [];

        for (const propId of propIds) {
            const prop = this.objects[propId];
            if (!prop) {
                this.notifier.notify(source, `Impossible de décharger l'objet ${propId} car il n'existe pas.`, 'error');
                continue;
            }
            propIdsToUnload.push(propId);
            this.objects[propId].loaded = false;
        }

        await this.deletePropsToAllClients(propIdsToUnload);
    }

    @Rpc(RpcServerEvent.PROP_GET_COLLECTIONS_DATA)
    public async getCollectionData(): Promise<PropCollectionData[]> {
        const collectionDatas: PropCollectionData[] = [];

        for (const collection in this.collections) {
            collectionDatas.push({
                name: collection,
                size: this.collections[collection].length,
                loaded_size: this.collections[collection].filter(id => this.objects[id].loaded).length,
            });
        }

        return collectionDatas;
    }

    @Rpc(RpcServerEvent.PROP_GET_PROP_COLLECTION)
    public async getCollection(source: number, collectionName: string): Promise<PropCollection> {
        const props: WorldPlacedProp[] = [];
        const collection = this.collections[collectionName];

        if (!collection) {
            this.notifier.notify(source, `La collection ${collectionName} n'existe pas.`, 'error');
            return null;
        }

        for (const propId of this.collections[collectionName]) {
            props.push(this.objects[propId]);
        }

        const propCollection: PropCollection = {
            name: collectionName,
            size: collection.length,
            loaded_size: collection.filter(id => this.objects[id].loaded).length,
            props: props,
        };

        return propCollection;
    }

    @Rpc(RpcServerEvent.PROP_GET_SERVER_DATA)
    public async getPropServerData(): Promise<PropServerData> {
        return {
            total: Object.keys(this.objects).length,
            loaded: Object.keys(this.objects).filter(id => this.objects[id].loaded).length,
        };
    }

    @Rpc(RpcServerEvent.PROP_GET_LOADED_PROPS)
    public async getLoadedProps(): Promise<WorldPlacedProp[]> {
        return Object.values(this.objects).filter(prop => prop.loaded);
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
        TriggerClientEvent(ClientEvent.PROP_EDIT_CLIENTSIDE, -1, propId, prop);
    }
}
