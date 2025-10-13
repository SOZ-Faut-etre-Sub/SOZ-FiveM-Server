import { drugLocation } from '@private/nui/drug/DrugLocation';
import { features } from '@public/nui/models/features';
import { repository } from '@public/nui/models/repository';
import { Models } from '@rematch/core';

import { api } from './api';
import { hud } from './hud';
import { item } from './item';
import { outside } from './outside';
import { petStats } from './pet';
import { player, playerClothingInventory, playerInventory, playerPosition, playerStats } from './player';
import { taxi } from './taxi';
import { vehicle, vehicleSpeed } from './vehicle';

export interface RootModel extends Models<RootModel> {
    hud: typeof hud;
    player: typeof player;
    playerPosition: typeof playerPosition;
    playerStats: typeof playerStats;
    playerInventory: typeof playerInventory;
    playerClothingInventory: typeof playerClothingInventory;
    item: typeof item;
    taxi: typeof taxi;
    outside: typeof outside;
    vehicle: typeof vehicle;
    vehicleSpeed: typeof vehicleSpeed;
    drugLocation: typeof drugLocation;
    api: typeof api;
    repository: typeof repository;
    features: typeof features;
    petStats: typeof petStats;
}

export const models: RootModel = {
    hud,
    player,
    playerPosition,
    playerStats,
    playerInventory,
    playerClothingInventory,
    item,
    taxi,
    outside,
    vehicle,
    vehicleSpeed,
    drugLocation,
    api,
    repository,
    features,
    petStats,
};
