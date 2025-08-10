import { Rpc } from '@public/core/decorators/rpc';
import { ServerEvent } from '@public/shared/event/server';
import { Feature } from '@public/shared/features';

import { Command } from '../../core/decorators/command';
import { On, Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event/client';
import { joaat } from '../../shared/joaat';
import { Vector3 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { WhatIf2DefaultItems, WhatIf2RespawnPoints, WhatIfSafeZones } from '../../shared/whatif';
import { FeatureProvider } from '../feature/feature.provider';
import { InventoryFactory } from '../inventory/inventory.factory';
import { ItemService } from '../item/item.service';
import { Notifier } from '../notifier';
import { PlayerPositionProvider } from '../player/player.position.provider';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../player/progress.service';

const zombieModel = joaat('u_m_y_zombie_01');

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

    @Once()
    init() {
        this.itemService.setItemUseCallback('zombie_serum', this.useZombieSerum.bind(this));

        Object.entries(WhatIf2RespawnPoints).forEach(([key, positions]) => {
            positions.forEach((value, index) => {
                this.playerPositionProvider.registerZone(`UHU_WHAT_IF_REPAWN_${key}_${index}`, value);
            });
        });
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

        WhatIf2DefaultItems.forEach(item => {
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

    @On('entityCreating', false)
    public onEntityCreating(handle: number) {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        const model = GetEntityModel(handle);

        if (GetEntityType(handle) !== 1 || Animals.includes(model)) {
            CancelEvent();
        }

        const position = GetEntityCoords(handle, false) as Vector3;
        if (Object.values(WhatIfSafeZones).some(zone => zone.isPointInside(position))) {
            CancelEvent();
        }
    }
}
