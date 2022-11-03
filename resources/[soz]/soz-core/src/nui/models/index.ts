import { Models } from '@rematch/core';

import { player } from './player';

export interface RootModel extends Models<RootModel> {
    player: typeof player;
}

export const models: RootModel = {
    player,
};
