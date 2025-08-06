import { Feature } from '@public/shared/features';

import { Command } from '../../core/decorators/command';
import { On } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { joaat } from '../../shared/joaat';
import { Vector3 } from '../../shared/polyzone/vector';
import { WhatIfSafeZone } from '../../shared/whatif';
import { FeatureProvider } from '../feature/feature.provider';

const zombieModel = joaat('u_m_y_zombie_01');

@Provider()
export class WhatIfProvider {
    @Inject(FeatureProvider)
    private readonly featureProvider: FeatureProvider;

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

    @On('entityCreating', false)
    public onEntityCreating(handle: number) {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        if (GetEntityType(handle) !== 1) {
            CancelEvent();
        }

        const position = GetEntityCoords(handle, false) as Vector3;

        if (WhatIfSafeZone.isPointInside(position)) {
            CancelEvent();
        }
    }
}
