import { Rpc } from '@public/core/decorators/rpc';
import { Feature } from '@public/shared/features';

import { Command } from '../../core/decorators/command';
import { On } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { joaat } from '../../shared/joaat';
import { Vector3 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { WhatIfSafeZone } from '../../shared/whatif';
import { FeatureProvider } from '../feature/feature.provider';

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

    private lockedZombie = new Set<string>();

    @Command('spawn-zombie', {
        description: 'Spawn des zombies',
        arguments: [{ name: 'count', help: 'amount of zombies to spawn' }],
        role: ['admin'],
    })
    public spawnZombie(source: number, count: number = 50) {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        const ped = GetPlayerPed(source);
        const playerCoords = GetEntityCoords(ped) as Vector3;

        for (let i = 0; i < count; i++) {
            CreatePed(0, zombieModel, playerCoords[0], playerCoords[1], playerCoords[2], 0, true, false);
        }
    }

    @Rpc(RpcServerEvent.WHAT_IF_ZOMBIE_IS_NOT_LOCKED)
    async isZombieNotLocked(source: number, id: string): Promise<boolean> {
        return !this.lockedZombie.has(id);
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
        if (WhatIfSafeZone.isPointInside(position)) {
            CancelEvent();
        }
    }
}
