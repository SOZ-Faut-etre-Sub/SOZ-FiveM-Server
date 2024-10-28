import { drugLocation } from '@private/nui/drug/DrugLocation';
import { features } from '@public/nui/models/features';
import { repository } from '@public/nui/models/repository';
import { Models } from '@rematch/core';

import { api } from './api';
import { hud } from './hud';
import { item } from './item';
import { outside } from './outside';
import { player, playerPosition, playerStats } from './player';
import { taxi } from './taxi';
import { vehicle, vehicleSpeed } from './vehicle';

export interface RootModel extends Models<RootModel> {
    hud: typeof hud;
    player: typeof player;
    playerPosition: typeof playerPosition;
    playerStats: typeof playerStats;
    item: typeof item;
    taxi: typeof taxi;
    outside: typeof outside;
    vehicle: typeof vehicle;
    vehicleSpeed: typeof vehicleSpeed;
    drugLocation: typeof drugLocation;
    api: typeof api;
    repository: typeof repository;
    features: typeof features;
}

export const models: RootModel = {
    hud,
    player,
    playerPosition,
    playerStats,
    item,
    taxi,
    outside,
    vehicle,
    vehicleSpeed,
    drugLocation,
    api,
    repository,
    features,
};
