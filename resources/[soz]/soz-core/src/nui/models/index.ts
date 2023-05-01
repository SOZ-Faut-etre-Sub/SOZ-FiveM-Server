import { Models } from '@rematch/core';

import { hud } from './hud';
import { item } from './item';
import { outside } from './outside';
import { player } from './player';
import { taxi } from './taxi';
import { vehicle } from './vehicle';

export interface RootModel extends Models<RootModel> {
    hud: typeof hud;
    player: typeof player;
    item: typeof item;
    taxi: typeof taxi;
    outside: typeof outside;
    vehicle: typeof vehicle;
}

export const models: RootModel = {
    hud,
    player,
    item,
    taxi,
    outside,
    vehicle,
};
