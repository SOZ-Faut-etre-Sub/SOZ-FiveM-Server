import { Models } from '@rematch/core';

import { hud } from './hud';
import { item } from './item';
import { outside } from './outside';
import { player, playerStats } from './player';
import { taxi } from './taxi';
import { vehicle, vehicleSpeed } from './vehicle';

export interface RootModel extends Models<RootModel> {
    hud: typeof hud;
    player: typeof player;
    playerStats: typeof playerStats;
    item: typeof item;
    taxi: typeof taxi;
    outside: typeof outside;
    vehicle: typeof vehicle;
    vehicleSpeed: typeof vehicleSpeed;
}

export const models: RootModel = {
    hud,
    player,
    playerStats,
    item,
    taxi,
    outside,
    vehicle,
    vehicleSpeed,
};
