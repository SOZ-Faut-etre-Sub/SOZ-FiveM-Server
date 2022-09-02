export enum ServerEvent {
    ADMIN_VEHICLE_SEE_CAR_PRICE = 'soz-core:server:admin:vehicle:see-car-price',
    ADMIN_VEHICLE_CHANGE_CAR_PRICE = 'soz-core:server:admin:vehicle:change-car-price',

    FOOD_ORDER_MEALS = 'soz-core:server:job:food:order-meals',
    FOOD_RETRIEVE_ORDER = 'soz-core:server:job:food:retrieve-order',
    FOOD_RETRIEVE_STATE = 'soz-core:server:job:food:retrieve-state',

    LSMC_BLOOD_FILL_FLASK = 'soz-core:server:job:lsmc:blood-fill-flask',
    LSMC_BLOOD_ANALYZE = 'soz-core:server:job:lsmc:blood-analyze',
    LSMC_PEE_ANALYZE = 'soz-core:server:job:lsmc:pee-analyze',
    LSMC_HEALTH_CHECK = 'soz-core:server:job:lsmc:health-check',
    LSMC_SET_CURRENT_DISEASE = 'lsmc:maladie:server:SetCurrentDisease',

    PLAYER_INCREASE_STRESS = 'soz-core:server:player:increase-stress',
    PLAYER_INCREASE_STAMINA = 'soz-core:server:player:increase-stamina',
    PLAYER_INCREASE_STRENGTH = 'soz-core:server:player:increase-strength',

    PLAYER_NUTRITION_LOOP = 'soz-core:server:player:nutrition:loop',
    PLAYER_NUTRITION_CHECK = 'soz-core:server:player:nutrition:check',

    PROGRESS_FINISH = 'soz-core:server:progress:finish',
}

export enum ClientEvent {
    FOOD_UPDATE_ORDER = 'soz-core:client:food:update-order',

    PROGRESS_START = 'soz-core:client:progress:start',

    LSMC_DISEASE_APPLY_CURRENT_EFFECT = 'lsmc:maladie:client:ApplyCurrentDiseaseEffect',
    LSMC_DISEASE_APPLY_CONDITIONS = 'lsmc:maladie:client:ApplyConditions',

    CORE_CLOSE_MENU = 'soz-core:client:menu:close',

    // Temp event which sould be internally used by a service when only soz core
    PLAYER_HEALTH_DO_PUSH_UP = 'soz-core:client:player:health:push-up',
    PLAYER_HEALTH_DO_SIT_UP = 'soz-core:client:player:health:sit-up',
}

export enum GameEvent {
    CEventNetworkPedDamage = 'CEventNetworkPedDamage',
    CEventVehicleCollision = 'CEventVehicleCollision',
    CEventExplosionHeard = 'CEventExplosionHeard',
    CEventGunShot = 'CEventGunShot',
}

export enum NuiEvent {
    SetPlayerFiber = 'soz-core:client:player:fiber:set',
}
