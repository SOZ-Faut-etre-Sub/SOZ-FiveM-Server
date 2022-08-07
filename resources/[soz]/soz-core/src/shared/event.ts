export enum ServerEvent {
    LSMC_BLOOD_FILL_FLASK = 'soz-core:server:job:lsmc:blood-fill-flask',
    LSMC_BLOOD_ANALYZE = 'soz-core:server:job:lsmc:blood-analyze',
    LSMC_PEE_ANALYZE = 'soz-core:server:job:lsmc:pee-analyze',

    PLAYER_NUTRITION_LOOP = 'soz-core:server:player:nutrition:loop',
    PLAYER_NUTRITION_CHECK = 'soz-core:server:player:nutrition:check',

    PROGRESS_FINISH = 'soz-core:server:progress:finish',
}

export enum ClientEvent {
    PROGRESS_START = 'soz-core:client:progress:start',
}
