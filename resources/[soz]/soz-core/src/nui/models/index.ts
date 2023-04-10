import { Models } from '@rematch/core';

import { item } from './item';
import { player } from './player';
import { taxi } from './taxi';

export interface RootModel extends Models<RootModel> {
    player: typeof player;
    item: typeof item;
    taxi: typeof taxi;
}

export const models: RootModel = {
    player,
    item,
    taxi,
};
