import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { uuidv4 } from '@public/core/utils';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { PropCollectionData, WorldPlacedProp } from '@public/shared/object';
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

    @Once(OnceStep.RepositoriesLoaded)
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
                matrix: placedProp.matrix ? JSON.parse(placedProp.matrix) : null,
                loaded: false,
            };
        }
    }
    @OnEvent(ServerEvent.PROP_REQUEST_CREATE_COLLECTION)
    public async createCollection(source: number, collection: string) {
        if (this.collections[collection]) {
            this.notifier.notify(source, `La collection ${collection} existe déjà`, 'error');
            return;
        }
        this.collections[collection] = [];
        this.notifier.notify(source, `La collection ${collection} a été créée`, 'success');
    }

    @OnEvent(ServerEvent.PROP_REQUEST_DELETE_COLLECTION)
    public async deleteCollection(source: number, collection: string) {
        if (!this.objects[collection]) {
            this.notifier.notify(source, `La collection ${collection} n'existe pas`, 'error');
            return;
        }
        await this.deleteProps(source, this.collections[collection]); // Need to delete props of this collection!
        delete this.collections[collection];
        this.notifier.notify(source, `La collection ${collection} a été supprimée`, 'success');
    }

    @OnEvent(ServerEvent.PROP_REQUEST_CREATE_PROPS)
    public async createProps(source: number, props: WorldPlacedProp[]) {
        for (const prop of props) {
            if (prop.collection && !this.collections[prop.collection]) {
                this.notifier.notify(
                    source,
                    `Impossible de créer le prop ${prop.unique_id} car sa collection ${prop.collection} n'existe pas`,
                    'error'
                );
                continue;
            }
            const unique_id = uuidv4();
            await this.prismaService.placed_prop.create({
                data: {
                    unique_id: unique_id,
                    model: prop.model,
                    collection: prop.collection,
                    position: JSON.stringify(prop.position),
                    matrix: prop.matrix ? JSON.stringify(prop.matrix) : null,
                },
            });

            this.objects[unique_id] = prop;
            if (prop.collection) {
                this.collections[prop.collection].push(prop.unique_id);
            }
        }
        this.notifier.notify(source, `Les props ont été créés`, 'success');
    }

    // Need to unload before deleting!
    @OnEvent(ServerEvent.PROP_REQUEST_DELETE_PROPS)
    public async deleteProps(source: number, propIds: string[]) {
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
            delete this.objects[propId];
            const collection = this.objects[propId].collection;
            if (collection && this.collections[collection]) {
                this.collections[collection] = this.collections[collection].filter(id => id !== propId);
            }
        }
        await this.unloadProps(source, propIds);
        this.notifier.notify(source, `Les props ont été supprimés`, 'success');
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
            if (prop.loaded) {
                this.notifier.notify(source, `L'objet ${propId} est déjà chargé.`, 'info');
                continue;
            }
            propsToLoad.push(prop);
        }

        await this.createPropsToAllClients(propsToLoad);
    }

    @OnEvent(ServerEvent.PROP_REQUEST_LOAD_COLLECTION)
    public async loadCollection(source: number, collection: string) {
        if (!this.collections[collection]) {
            this.notifier.notify(
                source,
                `Impossible de charger la collection ${collection} car elle n'existe pas.`,
                'error'
            );
            return;
        }
        await this.loadProps(source, this.collections[collection]);
    }

    @OnEvent(ServerEvent.PROP_REQUEST_UNLOAD_PROPS)
    public async unloadProps(source: number, propIds: string[]) {
        const propIdsToUnload: string[] = [];

        for (const propId of propIds) {
            const prop = this.objects[propId];
            if (!prop) {
                this.notifier.notify(source, `Impossible de décharger l'objet ${propId} car il n'existe pas.`, 'error');
                continue;
            }
            if (!prop.loaded) {
                this.notifier.notify(source, `L'objet ${propId} est déjà déchargé.`, 'info');
                continue;
            }
            propIdsToUnload.push(propId);
        }

        await this.deletePropsToAllClients(propIdsToUnload);
    }

    @Rpc(RpcServerEvent.PROP_GET_COLLECTION_DATA)
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

    @Rpc(RpcServerEvent.PROP_GET_COLLECTION_CONTENT)
    public async getCollectionProps(source: number, collectionName: string): Promise<WorldPlacedProp[]> {
        const props: WorldPlacedProp[] = [];

        if (!this.collections[collectionName]) {
            this.notifier.notify(source, `La collection ${collectionName} n'existe pas.`, 'error');
            return null;
        }

        for (const propId of this.collections[collectionName]) {
            props.push(this.objects[propId]);
        }

        return props;
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
}
