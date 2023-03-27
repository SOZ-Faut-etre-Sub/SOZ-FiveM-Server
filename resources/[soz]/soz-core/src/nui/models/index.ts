import { Models } from '@rematch/core';

import { item } from './item';
import { player } from './player';

export interface RootModel extends Models<RootModel> {
    player: typeof player;
    item: typeof item;
}

export const models: RootModel = {
    player,
    item,
};
