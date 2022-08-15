export enum ServerEvent {
    ADMIN_VEHICLE_SEE_CAR_PRICE = 'soz-core:server:admin:vehicle:see-car-price',
    ADMIN_VEHICLE_CHANGE_CAR_PRICE = 'soz-core:server:admin:vehicle:change-car-price',

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
    PROGRESS_START = 'soz-core:client:progress:start',

    DRAW_NOTIFICATION = 'hud:client:DrawNotification',

    LSMC_DISEASE_APPLY_CURRENT_EFFECT = 'lsmc:maladie:client:ApplyCurrentDiseaseEffect',
    LSMC_DISEASE_APPLY_CONDITIONS = 'lsmc:maladie:client:ApplyConditions',
}

export enum GameEvent {
    CEventNetworkPedDamage = 'CEventNetworkPedDamage',
    CEventVehicleCollision = 'CEventVehicleCollision',
    CEventExplosionHeard = 'CEventExplosionHeard',
    CEventGunShot = 'CEventGunShot',
}
