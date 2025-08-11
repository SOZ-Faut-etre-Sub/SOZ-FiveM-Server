import {ZombieModels} from '@public/client/story/zombie.provider';
import {Rpc} from '@public/core/decorators/rpc';
import {ServerEvent} from '@public/shared/event/server';
import {Feature} from '@public/shared/features';

import {Command} from '../../core/decorators/command';
import {On, Once, OnceStep} from '../../core/decorators/event';
import {Inject} from '../../core/decorators/injectable';
import {Provider} from '../../core/decorators/provider';
import {uuidv4} from '../../core/utils';
import {ClientEvent} from '../../shared/event/client';
import {joaat} from '../../shared/joaat';
import {Point3D, Vector3, Vector4} from '../../shared/polyzone/vector';
import {getRandomItem} from '../../shared/random';
import {RpcServerEvent} from '../../shared/rpc';
import {WhatIf2DefaultItems, WhatIf2HammerZoneConfig, WhatIf2RespawnPoints, WhatIfSafeZones,} from '../../shared/whatif';
import {PrismaService} from '../database/prisma.service';
import {FeatureProvider} from '../feature/feature.provider';
import {InventoryFactory} from '../inventory/inventory.factory';
import {ItemService} from '../item/item.service';
import {Notifier} from '../notifier';
import {ObjectProvider} from '../object/object.provider';
import {PlayerPositionProvider} from '../player/player.position.provider';
import {PlayerService} from '../player/player.service';
import {ProgressService} from '../player/progress.service';

const Animals = [
    joaat('A_C_Boar'),
    joaat('A_C_Boar_02'),
    joaat('A_C_Cat_01'),
    joaat('A_C_Chickenhawk'),
    joaat('A_C_Chimp'),
    joaat('A_C_Chimp_02'),
    joaat('A_C_Chop'),
    joaat('A_C_Chop_02'),
    joaat('A_C_cormorant'),
    joaat('A_C_Cow'),
    joaat('A_C_Coyote'),
    joaat('A_C_Coyote_02'),
    joaat('A_C_Crow'),
    joaat('A_C_Deer'),
    joaat('A_C_Deer_02'),
    joaat('A_C_Dolphin'),
    joaat('A_C_Fish'),
    joaat('A_C_Hen'),
    joaat('A_C_HumpBack'),
    joaat('A_C_Husky'),
    joaat('A_C_KillerWhale'),
    joaat('A_C_MtLion'),
    joaat('A_C_MtLion_02'),
    joaat('A_C_Panther'),
    joaat('A_C_Pig'),
    joaat('A_C_Pigeon'),
    joaat('A_C_Poodle'),
    joaat('A_C_Pug'),
    joaat('A_C_Pug_02'),
    joaat('A_C_Rabbit_01'),
    joaat('A_C_Rabbit_02'),
    joaat('A_C_Rat'),
    joaat('A_C_Retriever'),
    joaat('A_C_Rhesus'),
    joaat('A_C_Rottweiler'),
    joaat('A_C_Seagull'),
    joaat('A_C_SharkHammer'),
    joaat('A_C_SharkTiger'),
    joaat('A_C_shepherd'),
    joaat('A_C_Stingray'),
    joaat('A_C_Westy'),
];

@Provider()
export class WhatIfProvider {
    @Inject(FeatureProvider)
    private readonly featureProvider: FeatureProvider;

    @Inject(ItemService)
    private readonly itemService: ItemService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(PlayerPositionProvider)
    private playerPositionProvider: PlayerPositionProvider;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Once()
    init() {
        this.itemService.setItemUseCallback('zombie_serum', this.useZombieSerum.bind(this));
        this.itemService.setItemUseCallback('whatif_hammer', this.useHammer.bind(this));

        Object.entries(WhatIf2RespawnPoints).forEach(([key, positions]) => {
            positions.forEach((value, index) => {
                this.playerPositionProvider.registerZone(`UHU_WHAT_IF_REPAWN_${key}_${index}`, value);
            });
        });
    }

    @Once(OnceStep.RepositoriesLoaded)
    public async onRepoLoaded() {
        const data = await this.prismaService.whatif_props.findMany();
        for (const propDB of data) {
            this.objectProvider.createObject({
                id: propDB.id,
                model: GetHashKey(propDB.model),
                position: JSON.parse(propDB.position),
                matrix: JSON.parse(propDB.matrix),
                noCollision: propDB.noCollision,
                placeOnGround: true,
            });
        }
    }

    private async useZombieSerum(source: number) {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        const { completed } = await this.progressService.progress(source, 'serum', '', 3000, {
            name: 'base',
            dictionary: 'amb@prop_human_bum_bin@base',
            flags: 1,
        });

        if (!completed) {
            return;
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (inventory.remove('zombie_serum', 1, false)) {
            TriggerClientEvent(ClientEvent.WHAT_IF_USE_ZOMBIE_SERUM, source);
        } else {
            this.notifier.notify(source, "Vous n'avez plus de sérum...");
        }
    }

    private async useHammer(source: number) {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        TriggerClientEvent(ClientEvent.WHAT_IF_OPEN_HAMMER, source);
    }

    @Command('spawn-zombie', {
        description: 'Spawn des zombies',
        arguments: [{ name: 'count', help: 'amount of zombies to spawn' }],
        role: ['admin'],
    })
    public spawnZombie(source: number, count: number = 10) {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        const ped = GetPlayerPed(source);
        const playerCoords = GetEntityCoords(ped) as Vector3;

        for (let i = 0; i < count; i++) {
            const zombieModel = getRandomItem(ZombieModels);
            CreatePed(0, zombieModel, playerCoords[0], playerCoords[1], playerCoords[2], 0, true, false);
        }
    }

    @On(ServerEvent.WHAT_IF_GIVE_DEFAULT_ITEMS)
    async giveDefaultItems(source: number) {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        if (!inventory) return;

        inventory.clear();

        WhatIf2DefaultItems.forEach((item) => {
            inventory.add(item.name, item.quantity);
        });
    }

    @Rpc(RpcServerEvent.WHAT_IF_PLAYER_GET_CITIZEN_ID)
    async getCitizenId(source: number, target: number): Promise<string> {
        const player = this.playerService.getPlayer(target);
        if (!player) {
            return '';
        }

        return player.citizenid;
    }

    @Rpc(RpcServerEvent.WHAT_IF_GET_HAMMER_PROPS)
    async getHammerProps(source: number): Promise<{ id: string; model: string }[]> {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return [];
        }

        const player = this.playerService.getPlayer(source);
        if (!player) {
            return [];
        }

        const props = await this.prismaService.whatif_props.findMany({
            where: {
                citizenid: player.citizenid,
            },
        });

        return props.map((prop) => ({ id: prop.id, model: prop.model }));
    }

    @Rpc(RpcServerEvent.WHAT_IF_HAMMER_CREATE)
    public async propCreate(source: number, model: string, position: Vector4, matrix: number[], noCollision: boolean) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        if (Object.values(WhatIfSafeZones).some((zone) => zone.isPointInside(position.slice(0, 3) as Point3D))) {
            this.notifier.error(source, `Vous ne pouvez pas poser un objet ici.`);
            return;
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        if (!inventory) return;

        if (!inventory.remove(WhatIf2HammerZoneConfig.item, WhatIf2HammerZoneConfig.price)) {
            this.notifier.error(source, `Vous n'avez plus assez de ressources.`);
            return;
        }

        const id = WhatIf2HammerZoneConfig.prefix + uuidv4();

        await this.prismaService.whatif_props.create({
            data: {
                id,
                citizenid: player.citizenid,
                position: JSON.stringify(position),
                model,
                noCollision,
                matrix: JSON.stringify(matrix),
            },
        });

        this.objectProvider.createObject({
            id,
            model: GetHashKey(model),
            position: position,
        });

        this.notifier.notify(source, `Vous avez posé un objet.`, 'success');
    }

    @Rpc(RpcServerEvent.WHAT_IF_HAMMER_UPDATE)
    public async propUpdate(source: number, id: string, position: Vector4, matrix: number[], noCollision: boolean) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const existing = await this.prismaService.whatif_props.findFirst({ where: { id } });
        if (!existing) {
            return;
        }

        await this.prismaService.whatif_props.update({
            where: { id },
            data: {
                position: JSON.stringify(position),
                model: existing.model,
                noCollision: noCollision,
                matrix: JSON.stringify(matrix),
            },
        });

        this.objectProvider.updateObject({
            id,
            model: GetHashKey(existing.model),
            position,
            matrix,
            noCollision,
        });

        this.notifier.notify(source, `Vous avez déplacé un objet.`, 'success');
    }

    @Rpc(RpcServerEvent.WHAT_IF_HAMMER_DELETE)
    public async propDelete(source: number, id: string) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        await this.prismaService.whatif_props.delete({ where: { id } });

        this.objectProvider.deleteObject(id);

        this.notifier.notify(source, `Vous avez supprimé un objet.`, 'success');
    }

    @On('entityCreating', false)
    public onEntityCreating(handle: number) {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        const model = GetEntityModel(handle);

        if (
            (GetEntityType(handle) === 2 && GetVehicleType(handle) !== 'bike') ||
            GetEntityType(handle) === 3 ||
            Animals.includes(model)
        ) {
            CancelEvent();
        }

        const position = GetEntityCoords(handle, false) as Vector3;
        if (Object.values(WhatIfSafeZones).some((zone) => zone.isPointInside(position))) {
            CancelEvent();
        }
    }
}
