export enum ServerEvent {
    ADMIN_RESET_SKIN = 'soz-core:server:admin:reset-skin',
    ADMIN_SET_AIO = 'soz-core:server:admin:set-aio',
    ADMIN_SET_METADATA = 'soz-core:server:admin:set-metadata',
    ADMIN_SET_STAMINA = 'soz-core:server:admin:set-stamina',
    ADMIN_SET_STRENGTH = 'soz-core:server:admin:set-strength',
    ADMIN_SET_STRESS_LEVEL = 'soz-core:server:admin:set-stress-level',
    ADMIN_VEHICLE_SEE_CAR_PRICE = 'soz-core:server:admin:vehicle:see-car-price',
    ADMIN_VEHICLE_CHANGE_CAR_PRICE = 'soz-core:server:admin:vehicle:change-car-price',

    BAUN_CRAFT = 'soz-core:server:job:baun:craft',
    BAUN_RESELL = 'soz-core:server:job:baun:resell',

    BENNYS_ESTIMATE_VEHICLE = 'soz-core:server:job:bennys:estimate-vehicle',
    BENNYS_SELL_VEHICLE = 'soz-core:server:job:bennys:sell-vehicle',
    BENNYS_SET_SPECIAL_VEHICLES = 'soz-core:server:bennys:set-special-vehicles',

    FOOD_CRAFT = 'soz-core:server:job:food:craft',
    FOOD_ORDER_MEALS = 'soz-core:server:job:food:order-meals',
    FOOD_RETRIEVE_ORDER = 'soz-core:server:job:food:retrieve-order',
    FOOD_RETRIEVE_STATE = 'soz-core:server:job:food:retrieve-state',

    FFS_CRAFT = 'soz-core:server:job:ffs:craft',
    FFS_HARVEST = 'soz-core:server:job:ffs:harvest',
    FFS_RESTOCK = 'soz-core:server:job:ffs:restock',
    FFS_TRANSFORM = 'soz-core:server:job:ffs:transform',

    JOBS_USE_WORK_CLOTHES = 'soz-core:server:job:use-work-clothes',

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

    STORAGE_REMOVE_ITEM = 'soz-core:server:storage:remove-item',

    // not core
    ADMIN_ADD_VEHICLE = 'admin:vehicle:addVehicle',
    ADMIN_CHANGE_PLAYER = 'admin:server:ChangePlayer',
    ADMIN_GIVE_LICENCE = 'admin:gamemaster:giveLicence',
    ADMIN_GIVE_MONEY = 'admin:gamemaster:giveMoney',
    ADMIN_GOD_MODE = 'admin:gamemaster:godmode',
    ADMIN_TELEPORT_TO_PLAYER = 'admin:server:goto',
    ADMIN_TELEPORT_PLAYER_TO_ME = 'admin:server:bring',
    ADMIN_FREEZE = 'admin:server:freeze',
    ADMIN_KILL = 'admin:server:kill',
    ADMIN_REVIVE = 'admin:server:revive',
    ADMIN_SET_JOB = 'admin:jobs:setjob',
    ADMIN_SPECTATE = 'admin:server:spectate',
    ADMIN_UNCUFF = 'admin:gamemaster:unCuff',
    ADMIN_UNFREEZE = 'admin:server:unfreeze',

    BANKING_TRANSFER_MONEY = 'banking:server:TransferMoney',
    CHARACTER_SET_JOB_CLOTHES = 'soz-character:server:SetPlayerJobClothes',
    QBCORE_CALL_COMMAND = 'QBCore:CallCommand',
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
    CHARACTER_REQUEST_CHARACTER_WIZARD = 'soz-character:client:RequestCharacterWizard',

    CORE_CLOSE_MENU = 'soz-core:client:menu:close',

    FFS_ENTER_CLOTHING_SHOP = 'soz-core:client:job:ffs:enter-clothing-shop',
    FFS_EXIT_CLOTHING_SHOP = 'soz-core:client:job:ffs:exit-clothing-shop',

    FOOD_UPDATE_ORDER = 'soz-core:client:food:update-order',

    IDENTITY_HIDE = 'soz-identity:client:hide',
    ITEM_USE = 'soz-core:client:item:use',

    JOBS_FFS_OPEN_SOCIETY_MENU = 'soz-jobs:client:ffs:OpenSocietyMenu',
    JOBS_BAUN_OPEN_SOCIETY_MENU = 'soz-jobs:client:baun:OpenSocietyMenu',
    JOBS_FOOD_OPEN_SOCIETY_MENU = 'jobs:client:food:OpenSocietyMenu',
    JOBS_TRY_OPEN_CLOAKROOM = 'soz-jobs:client:try-open-cloakroom',

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
    AdminGetVehicles = 'soz-core:client:admin:get-vehicles',
    AdminGiveLicence = 'soz-core:client:admin:give-licence',
    AdminGiveMoney = 'soz-core:client:admin:give-money',
    AdminGiveMarkedMoney = 'soz-core:client:admin:give-marked-money',
    AdminMenuPlayerHandleDiseaseOption = 'soz-core:client:admin:handle-disease-option',
    AdminMenuPlayerHandleEffectsOption = 'soz-core:client:admin:handle-effects-option',
    AdminMenuPlayerHandleHealthOption = 'soz-core:client:admin:handle-health-option',
    AdminMenuPlayerHandleMovementOption = 'soz-core:client:admin:handle-movement-option',
    AdminMenuPlayerHandleResetSkin = 'soz-core:client:admin:handle-reset-skin',
    AdminMenuPlayerHandleSearchPlayer = 'soz-core:client:admin:handle-search-player',
    AdminMenuPlayerHandleSetAttribute = 'soz-core:client:admin:handle-set-attribute',
    AdminMenuPlayerHandleTeleportOption = 'soz-core:client:admin:handle-teleport-option',
    AdminMenuPlayerHandleVocalOption = 'soz-core:client:admin:handle-vocal-option',
    AdminResetHealthData = 'soz-core:client:admin:reset-health-data',
    AdminSetGodMode = 'soz-core:client:admin:set-god-mode',
    AdminSetJob = 'soz-core:client:admin:set-job',
    AdminMenuPlayerSpectate = 'soz-core:client:admin:spectate',
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
    AdminMenuGameMasterUncuff = 'soz-core:client:admin:game-master:uncuff',
    AdminMenuVehicleSpawn = 'soz-core:client:admin:vehicle:spawn',
    AdminMenuVehicleSeeCarPrice = 'soz-core:client:admin:vehicle:see-car-price',
    AdminMenuVehicleChangeCarPrice = 'soz-core:client:admin:vehicle:change-car-price',
    AdminMenuVehicleRepair = 'soz-core:client:admin:vehicle:repair',
    AdminMenuVehicleClean = 'soz-core:client:admin:vehicle:clean',
    AdminMenuVehicleRefill = 'soz-core:client:admin:vehicle:refill',
    AdminMenuVehicleSave = 'soz-core:client:admin:vehicle:save',
    AdminMenuVehicleSetFBIConfig = 'soz-core:client:admin:vehicle:set-fbi-config',
    AdminMenuVehicleDelete = 'soz-core:client:admin:vehicle:delete',
    AdminMenuSkinChangeAppearance = 'soz-core:client:admin:skin:change-appearance',
    AdminMenuSkinChangeComponent = 'soz-core:client:admin:skin:change-component',
    AdminMenuSkinChangeProp = 'soz-core:client:admin:skin:change-prop',
    AdminMenuSkinCopy = 'soz-core:client:admin:skin:copy',
    AdminMenuSkinLookAtDrawable = 'soz-core:client:admin:skin:look-at-drawable',
    AdminMenuSkinSave = 'soz-core:client:admin:skin:save',

    BaunDisplayBlip = 'soz-core:client:job:baun:display-blip',

    BennysCancelOrder = 'soz-core:client:job:bennys:cancel-order',
    BennysOrder = 'soz-core:client:job:bennys:order',
    BennysGetOrders = 'soz-core:client:job:bennys:get-orders',

    FfsDisplayBlip = 'soz-core:client:job:ffs:display-blip',
    FoodDisplayBlip = 'soz-core:client:job:food:display-blip',
    PlayerSetHealthBookField = 'soz-core:client:player:health-book:set',
    InputSet = 'soz-core:client:input:set',
    InputCancel = 'soz-core:client:input:cancel',
    MenuClosed = 'menu_closed',
    SetFocusInput = 'soz-core:nui:set-focus-input',
    SetWardrobeOutfit = 'soz-core:nui:set-wardrobe-outfit',
}
