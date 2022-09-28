export enum ServerEvent {
    ADMIN_CHANGE_PLAYER = 'soz-core:server:admin:change-player',
    ADMIN_VEHICLE_SEE_CAR_PRICE = 'soz-core:server:admin:vehicle:see-car-price',
    ADMIN_VEHICLE_CHANGE_CAR_PRICE = 'soz-core:server:admin:vehicle:change-car-price',

    BAUN_CRAFT = 'soz-core:server:job:baun:craft',
    BAUN_RESELL = 'soz-core:server:job:baun:resell',

    FOOD_CRAFT = 'soz-core:server:job:food:craft',
    FOOD_ORDER_MEALS = 'soz-core:server:job:food:order-meals',
    FOOD_RETRIEVE_ORDER = 'soz-core:server:job:food:retrieve-order',
    FOOD_RETRIEVE_STATE = 'soz-core:server:job:food:retrieve-state',

    FFS_CRAFT = 'soz-core:server:job:ffs:craft',
    FFS_HARVEST = 'soz-core:server:job:ffs:harvest',
    FFS_RESTOCK = 'soz-core:server:job:ffs:restock',
    FFS_TRANSFORM = 'soz-core:server:job:ffs:transform',

    LSMC_BLOOD_FILL_FLASK = 'soz-core:server:job:lsmc:blood-fill-flask',
    LSMC_BLOOD_ANALYZE = 'soz-core:server:job:lsmc:blood-analyze',
    LSMC_BUY_ITEM = 'soz-core:server:job:lsmc:buy-item',
    LSMC_HEAL = 'soz-core:server:job:lsmc:heal',
    LSMC_PEE_ANALYZE = 'soz-core:server:job:lsmc:pee-analyze',
    LSMC_HEALTH_CHECK = 'soz-core:server:job:lsmc:health-check',
    LSMC_SET_HEALTH_BOOK = 'soz-core:server:job:lsmc:set-health-book',

    PLAYER_INCREASE_STRESS = 'soz-core:server:player:increase-stress',
    PLAYER_INCREASE_STAMINA = 'soz-core:server:player:increase-stamina',
    PLAYER_INCREASE_STRENGTH = 'soz-core:server:player:increase-strength',
    PLAYER_SET_CURRENT_DISEASE = 'soz-core:server:server:set-current-disease',
    PLAYER_INCREASE_RUN_TIME = 'soz-core:server:player:health:increase-run-time',
    PLAYER_DO_YOGA = 'soz-core:server:player:do-yoga',

    PLAYER_NUTRITION_LOOP = 'soz-core:server:player:nutrition:loop',
    PLAYER_NUTRITION_CHECK = 'soz-core:server:player:nutrition:check',
    PLAYER_SHOW_HEALTH_BOOK = 'soz-core:server:player:health:request-health-book',
    PLAYER_HEALTH_SET_EXERCISE_COMPLETED = 'soz-core:server:player:health:set-exercise-completed',
    PLAYER_HEALTH_GYM_SUBSCRIBE = 'soz-core:server:player:health:gym-subscribe',

    PLAYER_APPEARANCE_SET_JOB_OUTFIT = 'soz-core:server:appearance:set-job-outfit',
    PLAYER_APPEARANCE_REMOVE_JOB_OUTFIT = 'soz-core:server:appearance:remove-job-outfit',
    PLAYER_APPEARANCE_SET_TEMP_OUTFIT = 'soz-core:server:appearance:set-temp-outfit',
    PLAYER_APPEARANCE_REMOVE_TEMP_OUTFIT = 'soz-core:server:appearance:remove-temp-outfit',

    PROGRESS_FINISH = 'soz-core:server:progress:finish',

    ZEVENT_GET_POPCORN = 'soz-core:server:zevent:get-popcorn',

    // not core
    ADMIN_GIVE_LICENCE = 'admin:gamemaster:giveLicence',
    ADMIN_GIVE_MONEY = 'admin:gamemaster:giveMoney',
    ADMIN_GOD_MODE = 'admin:gamemaster:godmode',
    ADMIN_FREEZE = 'admin:server:freeze',
    ADMIN_KILL = 'admin:server:kill',
    ADMIN_REVIVE = 'admin:server:revive',
    ADMIN_SET_JOB = 'admin:jobs:setjob',
    ADMIN_SPECTATE = 'admin:server:spectate',
    ADMIN_UNFREEZE = 'admin:server:unfreeze',

    BANKING_TRANSFER_MONEY = 'banking:server:TransferMoney',
    CHARACTER_SET_JOB_CLOTHES = 'soz-character:server:SetPlayerJobClothes',
    CHARACTER_SET_TEMPORARY_CLOTH = 'soz-character:server:ApplyTemporaryClothSet',
    QBCORE_TOGGLE_DUTY = 'QBCore:ToggleDuty',
    QBCORE_SET_METADATA = 'QBCore:Server:SetMetaData',

    IDENTITY_HIDE_AROUND = 'soz-identity:server:hide-around',

    LSMC_CLEAR_DISEASE = 'lsmc:maladie:ClearDisease',
    LSMC_SET_CURRENT_DISEASE = 'lsmc:maladie:server:SetCurrentDisease',
    LSMC_REVIVE = 'lsmc:server:revive',

    VOIP_IS_MUTED = 'voip:server:player:isMuted',
    VOIP_MUTE = 'voip:server:player:mute',
}

export enum ClientEvent {
    CORE_CLOSE_MENU = 'soz-core:client:menu:close',

    FFS_ENTER_CLOTHING_SHOP = 'soz-core:client:job:ffs:enter-clothing-shop',
    FFS_EXIT_CLOTHING_SHOP = 'soz-core:client:job:ffs:exit-clothing-shop',

    FOOD_UPDATE_ORDER = 'soz-core:client:food:update-order',

    IDENTITY_HIDE = 'soz-identity:client:hide',
    ITEM_USE = 'soz-core:client:item:use',

    JOBS_FFS_OPEN_SOCIETY_MENU = 'soz-jobs:client:ffs:OpenSocietyMenu',
    JOBS_BAUN_OPEN_SOCIETY_MENU = 'soz-jobs:client:baun:OpenSocietyMenu',
    JOBS_FOOD_OPEN_SOCIETY_MENU = 'jobs:client:food:OpenSocietyMenu',

    LSMC_DISEASE_APPLY_CURRENT_EFFECT = 'lsmc:maladie:client:ApplyCurrentDiseaseEffect',
    LSMC_DISEASE_APPLY_CONDITIONS = 'lsmc:maladie:client:ApplyConditions',

    // Temp event which should be internally used by a service when only soz core
    CHARACTER_SET_TEMPORARY_CLOTH = 'soz-character:Client:ApplyTemporaryClothSet',

    PLAYER_HEALTH_DO_PUSH_UP = 'soz-core:client:player:health:push-up',
    PLAYER_HEALTH_DO_YOGA = 'soz-core:client:player:health:yoga',
    PLAYER_HEALTH_DO_SIT_UP = 'soz-core:client:player:health:sit-up',
    PLAYER_HEALTH_DO_FREE_WEIGHT = 'soz-core:client:player:health:free-weight',
    PLAYER_REQUEST_HEALTH_BOOK = 'soz-core:client:player:health:request-health-book',
    PLAYER_UPDATE = 'soz-core:client:player:update',

    PROGRESS_START = 'soz-core:client:progress:start',

    ZEVENT_TOGGLE_TSHIRT = 'soz-core:client:zevent:toggle-tshirt',
}

export enum GameEvent {
    CEventNetworkPedDamage = 'CEventNetworkPedDamage',
    CEventVehicleCollision = 'CEventVehicleCollision',
    CEventExplosionHeard = 'CEventExplosionHeard',
    CEventGunShot = 'CEventGunShot',
}

export enum NuiEvent {
    AdminAutoPilot = 'soz-core:client:admin:autopilot',
    AdminChangePlayer = 'soz-core:client:admin:change-player',
    AdminCopyCoords = 'soz-core:client:admin:copy-coords',
    AdminGetJobs = 'soz-core:client:admin:get-jobs',
    AdminGetPlayers = 'soz-core:client:admin:get-players',
    AdminGiveLicence = 'soz-core:client:admin:give-licence',
    AdminGiveMoney = 'soz-core:client:admin:give-money',
    AdminGiveMarkedMoney = 'soz-core:client:admin:give-marked-money',
    AdminHandleHealthOption = 'soz-core:client:admin:handle-health-option',
    AdminHandleMovementOption = 'soz-core:client:admin:handle-movement-option',
    AdminHandleVocalOption = 'soz-core:client:admin:handle-vocal-option',
    AdminResetHealthData = 'soz-core:client:admin:reset-health-data',
    AdminSetGodMode = 'soz-core:client:admin:set-god-mode',
    AdminSetInvincible = 'soz-core:client:admin:set-invincible',
    AdminSetJob = 'soz-core:client:admin:set-job',
    AdminSpectate = 'soz-core:client:admin:spectate',
    AdminSetVisible = 'soz-core:client:admin:set-visible',
    AdminTeleportToWaypoint = 'soz-core:client:admin:teleport-to-waypoint',
    AdminToggleDisplayOwners = 'soz-core:client:admin:toggle-display-owners',
    AdminToggleDisplayPlayerNames = 'soz-core:client:admin:toggle-display-player-names',
    AdminToggleDisplayPlayersOnMap = 'soz-core:client:admin:toggle-display-players-on-map',
    AdminToggleDuty = 'soz-core:client:admin:set-job-duty',
    AdminToggleMoneyCase = 'soz-core:client:admin:toggle-disable-money-case',
    AdminToggleNoClip = 'soz-core:client:admin:toggle-noclip',
    AdminToggleShowCoordinates = 'soz-core:client:admin:toggle-show-coordinates',
    AdminUpdateState = 'soz-core:client:admin:update-state',

    BaunDisplayBlip = 'soz-core:client:job:baun:display-blip',
    FfsDisplayBlip = 'soz-core:client:job:ffs:display-blip',
    FoodDisplayBlip = 'soz-core:client:job:food:display-blip',
    PlayerSetHealthBookField = 'soz-core:client:player:health-book:set',
    InputSet = 'soz-core:client:input:set',
    InputCancel = 'soz-core:client:input:cancel',
    MenuClosed = 'menu_closed',
    SetFocusInput = 'soz-core:nui:set-focus-input',
    SetWardrobeOutfit = 'soz-core:nui:set-wardrobe-outfit',
}
