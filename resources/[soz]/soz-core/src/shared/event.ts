export enum ServerEvent {
    ADMIN_RESET_SKIN = 'soz-core:server:admin:reset-skin',
    ADMIN_RESET_HALLOWEEN = 'soz-core:server:admin:reset-halloween',
    ADMIN_SET_AIO = 'soz-core:server:admin:set-aio',
    ADMIN_SET_METADATA = 'soz-core:server:admin:set-metadata',
    ADMIN_SET_STAMINA = 'soz-core:server:admin:set-stamina',
    ADMIN_SET_STRENGTH = 'soz-core:server:admin:set-strength',
    ADMIN_SET_STRESS_LEVEL = 'soz-core:server:admin:set-stress-level',
    ADMIN_SET_INJURIES_COUNT = 'soz-core:server:admin:set-injuries-count',
    ADMIN_SET_REPUTATION = 'soz-core:server:admin:set-reputation',
    ADMIN_RESET_CRIMI = 'soz-core:server:admin:reset-crimi',
    ADMIN_VEHICLE_SEE_CAR_PRICE = 'soz-core:server:admin:vehicle:see-car-price',
    ADMIN_VEHICLE_CHANGE_CAR_PRICE = 'soz-core:server:admin:vehicle:change-car-price',
    ADMIN_VEHICLE_SPAWN = 'soz-core:server:admin:vehicle:spawn',
    ADMIN_VEHICLE_DELETE = 'soz-core:server:admin:vehicle:delete',

    BASE_ENTERED_VEHICLE = 'baseevents:enteredVehicle',
    BASE_LEFT_VEHICLE = 'baseevents:leftVehicle',
    BASE_CHANGE_VEHICLE_SEAT = 'baseevents:changeVehicleSeat',

    BAUN_CRAFT = 'soz-core:server:job:baun:craft',
    BAUN_RESELL = 'soz-core:server:job:baun:resell',

    BENNYS_ESTIMATE_VEHICLE = 'soz-core:server:job:bennys:estimate-vehicle',
    BENNYS_SELL_VEHICLE = 'soz-core:server:job:bennys:sell-vehicle',
    BENNYS_SET_SPECIAL_VEHICLES = 'soz-core:server:bennys:set-special-vehicles',
    BENNYS_REPAIR_VEHICLE_ENGINE = 'soz-core:server:job:bennys:repair-vehicle-engine',
    BENNYS_REPAIR_VEHICLE_BODY = 'soz-core:server:job:bennys:repair-vehicle-body',
    BENNYS_REPAIR_VEHICLE_TANK = 'soz-core:server:job:bennys:repair-vehicle-tank',
    BENNYS_REPAIR_VEHICLE_WHEEL = 'soz-core:server:job:bennys:repair-vehicle-wheel',
    BENNYS_WASH_VEHICLE = 'soz-core:server:job:bennys:wash-vehicle',
    BENNYS_FLATBED_ATTACH_VEHICLE = 'soz-core:server:job:bennys:flatbed:attach-vehicle',
    BENNYS_FLATBED_DETACH_VEHICLE = 'soz-core:server:job:bennys:flatbed:detach-vehicle',
    BENNYS_FLATBED_ASK_DETACH_VEHICLE = 'soz-core:server:job:bennys:flatbed:ask-detach-vehicle',

    CRIMI_CONFIRM_REMOTE_WORKSHOP = 'soz-core:server:job:crimi:confirm-remote-workshop',

    DRIVING_SCHOOL_PLAYER_PAY = 'soz-core:server:driving-school:player-pay',
    DRIVING_SCHOOL_UPDATE_LICENSE = 'soz-core:server:driving-school:update-license',
    DRIVING_SCHOOL_UPDATE_VEHICLE_LIMIT = 'soz-core:server:driving-school:update-vehicle-limit',

    FIVEM_PLAYER_CONNECTING = 'playerConnecting',

    FOOD_CRAFT = 'soz-core:server:job:food:craft',
    FOOD_ORDER_MEALS = 'soz-core:server:job:food:order-meals',
    FOOD_RETRIEVE_ORDER = 'soz-core:server:job:food:retrieve-order',
    FOOD_RETRIEVE_STATE = 'soz-core:server:job:food:retrieve-state',
    FOOD_EASTER_HARVEST = 'soz-core:server:job:food:easter-harvest',

    FFS_CRAFT = 'soz-core:server:job:ffs:craft',
    FFS_HARVEST = 'soz-core:server:job:ffs:harvest',
    FFS_RESTOCK = 'soz-core:server:job:ffs:restock',
    FFS_TRANSFORM = 'soz-core:server:job:ffs:transform',

    STONK_RESELL = 'soz-core:server:job:stonk:resell',
    STONK_COLLECT = 'soz-core:server:job:stonk:collect',
    STONK_FILL_IN = 'soz-core:server:job:stonk:fill-in',
    STONK_DELIVERY_TAKE = 'soz-core:server:job:stonk:delivery-take',
    STONK_DELIVERY_END = 'soz-core:server:job:stonk:delivery-end',

    JOBS_PLACE_PROPS = 'job:server:placeProps',

    LSMC_BLOOD_FILL_FLASK = 'soz-core:server:job:lsmc:blood-fill-flask',
    LSMC_BLOOD_ANALYZE = 'soz-core:server:job:lsmc:blood-analyze',
    LSMC_BUY_ITEM = 'soz-core:server:job:lsmc:buy-item',
    LSMC_HEAL = 'soz-core:server:job:lsmc:heal',
    LSMC_NPC_HEAL = 'soz-core:server:job:lsmc:npc-heal',
    LSMC_PEE_ANALYZE = 'soz-core:server:job:lsmc:pee-analyze',
    LSMC_HEALTH_CHECK = 'soz-core:server:job:lsmc:health-check',
    LSMC_SET_HEALTH_BOOK = 'soz-core:server:job:lsmc:set-health-book',
    LSMC_TOOGLE_ITT = 'soz-core:server:job:lsmc:toggle-itt',
    LSMC_SET_HAZMAT = 'soz-core:server:job:lsmc:set-hazmat',
    LSMC_SET_CURRENT_ORGAN = 'soz-core:server:job:lsmc:set-organ',

    MISSIVE_CREATE_ITEM = 'soz-core:server:missive:create-item',
    MISSIVE_DELETE_ITEM = 'soz-core:server:missive:delete-item',
    MISSIVE_COMPLETE = 'soz-core:server:missive:complete',

    MONITOR_ADD_EVENT = 'soz-core:server:monitor:add-event',
    MONITOR_LOG = 'soz-core:server:monitor:log',

    LSMC_SET_PATIENT_OUTFIT = 'soz-core:server:job:lsmc:set-patient-outfit',

    OIL_REFILL_ESSENCE_STATION = 'soz-core:server:oil:refill-essence-station',
    OIL_REFILL_KEROSENE_STATION = 'soz-core:server:oil:refill-kerosene-station',
    OIL_SET_STATION_PRICE = 'soz-core:server:oil:set-station-price',
    OIL_DECREMENT_STATION = 'soz-core:server:oil:decrement',

    PLAYER_INCREASE_STRESS = 'soz-core:server:player:increase-stress',
    PLAYER_INCREASE_STRENGTH = 'soz-core:server:player:increase-strength',
    PLAYER_SET_CURRENT_DISEASE = 'soz-core:server:server:set-current-disease',
    PLAYER_INCREASE_RUN_TIME = 'soz-core:server:player:health:increase-run-time',
    PLAYER_DO_YOGA = 'soz-core:server:player:do-yoga',
    PLAYER_SET_CURRENT_WALKSTYLE = 'soz-core:server:player:set-current-walkstyle',
    PLAYER_UPDATE_HAT_VEHICLE = 'soz-core:server:player:update-hat-vehicle',
    PLAYER_UPDATE_STATE = 'soz-core:server:player:update-state',

    PLAYER_NUTRITION_LOOP = 'soz-core:server:player:nutrition:loop',
    PLAYER_NUTRITION_CHECK = 'soz-core:server:player:nutrition:check',
    PLAYER_HEALTH_SET_EXERCISE_COMPLETED = 'soz-core:server:player:health:set-exercise-completed',
    PLAYER_HEALTH_GYM_SUBSCRIBE = 'soz-core:server:player:health:gym-subscribe',

    PLAYER_APPEARANCE_SET_JOB_OUTFIT = 'soz-core:server:appearance:set-job-outfit',
    PLAYER_APPEARANCE_REMOVE_JOB_OUTFIT = 'soz-core:server:appearance:remove-job-outfit',
    PLAYER_APPEARANCE_SET_TEMP_OUTFIT = 'soz-core:server:appearance:set-temp-outfit',
    PLAYER_APPEARANCE_REMOVE_TEMP_OUTFIT = 'soz-core:server:appearance:remove-temp-outfit',

    PLAYER_ZIP = 'soz-core:server:player:zip',
    PLAYER_UNZIP = 'soz-core:server:player:unzip',

    PROGRESS_FINISH = 'soz-core:server:progress:finish',

    STORAGE_REMOVE_ITEM = 'soz-core:server:storage:remove-item',
    SHOP_BOSS_BUY = 'soz-core:server:shop:boss:buy',
    SHOP_EASTER_BUY = 'soz-core:server:shop:easter:buy',
    SHOP_VALIDATE_CART = 'soz-core:server:shop:validate-cart',

    UPW_CREATE_CHARGER = 'soz-core:server:job:upw:create-charger',
    UPW_REFILL_STATION = 'soz-core:server:job:upw:refill-station',
    UPW_CHANGE_BATTERY = 'soz-core:server:job:upw:change-battery',
    UPW_SET_CHARGER_PRICE = 'soz-core:server:job:upw:set-charger-price',
    SHOP_BUY = 'soz-core:server:shop:buy',
    SHOP_TATTOO_RESET = 'soz-core:server:shop:tattoo-reset',
    ZKEA_CHECK_STOCK = 'soz-core:client:shop:zkea:check-stock', // Todo

    AFK_KICK = 'soz-core:server:afk:kick',

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
    ADMIN_CREATE_CHARACTER = 'soz-core:server:admin:create-character',
    ADMIN_SWITCH_CHARACTER = 'soz-core:server:admin:switch-character',

    BANKING_TRANSFER_MONEY = 'banking:server:TransferMoney',
    CHARACTER_SET_JOB_CLOTHES = 'soz-character:server:SetPlayerJobClothes',
    QBCORE_CALL_COMMAND = 'QBCore:CallCommand',
    QBCORE_TOGGLE_DUTY = 'QBCore:ToggleDuty',
    QBCORE_SET_DUTY = 'QBCore:Server:SetDuty',
    QBCORE_SET_METADATA = 'QBCore:Server:SetMetaData',

    LSMC_CLEAR_DISEASE = 'lsmc:maladie:ClearDisease',
    LSMC_SET_CURRENT_DISEASE = 'lsmc:maladie:server:SetCurrentDisease',
    LSMC_REVIVE = 'soz-core:lsmc:server:revive',
    LSMC_REVIVE2 = 'soz-core:lsmc:server:revive2',
    LSMC_FREE_BED = 'soz-core:lsmc:server:free-bed',
    LSMC_ON_DEATH = 'soz-core:lsmc:server:on-death',
    LSMC_ON_DEATH2 = 'soz-core:lsmc:server:on-death2',
    LSMC_SET_DEATH_REASON = 'soz-core:lsmc:server:set-death-reason',
    LSMC_GIVE_BLOOD = 'soz-core:lsmc:server:give-blood',
    LSMC_TELEPORTATION = 'soz-core:lsmc:server:teleportation',

    METRICS_UPDATE = 'soz-core:server:metrics:update',

    REPOSITORY_REFRESH_DATA = 'soz-core:server:repository:refresh-data',

    TAXI_NPC_PAY = 'soz-core:server:taxi:npc-pay',

    TWITCH_ADD_FLASH_NEWS = 'soz-core:server:twitch:add-flash-news',

    VEHICLE_USE_REPAIR_KIT = 'soz-core:server:vehicle:use-repair-kit',
    VEHICLE_USE_CLEANING_KIT = 'soz-core:server:vehicle:use-cleaning-kit',
    VEHICLE_USE_WHEEL_KIT = 'soz-core:server:vehicle:use-wheel-kit',
    VEHICLE_FORCE_OPEN = 'soz-core:server:vehicle:force-open',
    VEHICLE_SET_CLOSEST = 'soz-core:server:vehicle:set-closest',
    VEHICLE_DELETED = 'soz-core:server:vehicle:deleted',
    VEHICLE_GARAGE_STORE = 'soz-core:server:vehicle:garage:store',
    VEHICLE_GARAGE_RETRIEVE = 'soz-core:server:vehicle:garage:retrieve',
    VEHICLE_GARAGE_RENAME = 'soz-core:server:vehicle:garage:rename',
    VEHICLE_SET_DEAD = 'soz-core:server:vehicle:set-dead',
    VEHICLE_WASH = 'soz-core:server:vehicle:wash',
    VEHICLE_FUEL_START = 'soz-core:server:vehicle:fuel:start',
    VEHICLE_CHARGE_START = 'soz-core:server:vehicle:charge:start',
    VEHICLE_OPEN_KEYS = 'soz-core:server:vehicle:open-keys',
    VEHICLE_GIVE_KEY = 'soz-core:server:vehicle:give-key',
    VEHICLE_ROUTE_EJECTION = 'soz-core:server:vehicle:route-ejection',
    VEHICLE_TAKE_OWNER = 'soz-core:server:vehicle:take-owner',
    VEHICLE_SET_TRUNK_STATE = 'soz-core:server:vehicle:set-trunk-state',
    VEHICLE_UPDATE_STATE = 'soz-core:server:vehicle:update-state',
    VEHICLE_UPDATE_CONDITION = 'soz-core:server:vehicle:update-condition',
    VEHICLE_UPDATE_CONDITION_FROM_OWNER = 'soz-core:server:vehicle:update-condition-from-owner',
    VEHICLE_UPDATE_MILEAGE = 'soz-core:server:vehicle:update-mileage',
    VEHICLE_SET_OPEN = 'soz-core:server:vehicle:set-open',

    VOIP_IS_MUTED = 'voip:server:player:isMuted',
    VOIP_MUTE = 'voip:server:player:mute',
    VOIP_SET_MEGAPHONE = 'soz-core:server:voip:set-megaphone',
    VOIP_RADIO_VEHICLE_ENABLE = 'soz-core:server:voip:radio-vehicle-enable',
    VOIP_RADIO_VEHICLE_UPDATE = 'soz-core:server:voip:radio-vehicle-update',

    HALLOWEEN2022_HUNT = 'halloween2022:server:hunt',
    LSMC_HALLOWEEN_LOOT_PLAYER = 'lsmc:halloween:lootPlayer',
    VEHICLE_FREE_JOB_SPAWN = 'soz-core:server:vehicle:free-job-spawn',

    INVENTORY_USE_ITEM = 'inventory:server:UseItemSlot',
    INVENTORY_SET_ITEM_SHORTCUT = 'soz-core:server:inventory:set-item-usage',

    WEAPON_SHOOTING = 'soz-core:server:weapon:shooting',

    VANDALISM_END = 'soz-core:server:vandalism:end',

    MDR_SHOW_TICKET = 'soz-core:server:mdr:show-ticket',
    MDR_MONEY_CLEANING = 'soz-core:server:mdr:money-cleaning',

    RACKET = 'soz-core:server:racket',
    RACKET_RELEASE_PED = 'soz-core:server:racket:release-ped',
    RACKET_START_PHASE = 'soz-core:server:racket:start-phase',

    HEIST_ADD_ITEM = 'soz-core:server:heist:add-item',
    HEIST_JEWELRY_UNLOCK = 'soz-core:server:heist:unlock',
    HEIST_JEWELRY_ALARM_STOP = 'soz-core:server:heist:alarm-stop',
    HEIST_JEWELRY_START_ROBBERY = 'soz-core:server:heist:start-robbery',
    HEIST_PLAY_ANIM = 'soz-core:server:heist:play-anim',
    HEIST_PLAY_ANIM_INIT = 'soz-core:server:heist:init',
    HEIST_RETRIEVE_ITEM = 'soz-core:server:heist:retrieve',
    HEIST_RETRIEVE_JEWEL = 'soz-core:server:heist:jewelry-retrieve-jewel',
    HEIST_JEWELRY_STOP_ROBBERY = 'soz-core:server:heist:jewelry-stop-robbery',

    SOUND_GLOBAL_INIT = 'soz-core:server:sound:init',

    PLAYER_SHOW_IDENTITY = 'soz-core:server:player:show-identity',
    POLICE_TAKE_DOWN = 'soz-core:server:takedown',

    HELICO_ADD_LIGHT = 'soz-core:server:police:add-light',
    HELICO_REMOVE_LIGHT = 'soz-core:server:police:del-light',
    HELICO_UPDATE_LIGHT = 'soz-core:server:police:update-light',

    HUB_TELEPORT_ENTER = 'soz-core:server:hub:teleport:enter',
    HUB_TELEPORT_EXIT = 'soz-core:server:hub:teleport:exit',
    HUB_WASH = 'soz-core:server:hub:wash',
    HUB_SHOP_BUY = 'soz-core:server:hub:shop-buy',
    HUB_EXIT = 'soz-core:server:hub:exit',
    HUB_RESELL = 'soz-core:server:hub:resell',
    HUB_SHOP_RESELL = 'soz-core:server:hub:shop-resell',

    CRIMI_HOOD = 'soz-core:server:crimi:hood',
    CRIMI_UNHOOD = 'soz-core:server:crimi:unhood',
    CRIMI_SMOKE_STRESS = 'soz-core:server:crimi:smoke-stress',
    CRIMI_BLOCK_DATE = 'soz-core:server:crimi:block-date',

    TALENT_TREE_DISABLE_CRIMI = 'soz-core:server:talent:disable-crimi',

    CRAFTING_TRAINING = 'soz-core:crafting:craft-training',
}

export enum ClientEvent {
    ADMIN_OPEN_MENU = 'soz-core:client:admin:openMenu',
    ADMIN_SHOW_GPS = 'soz-core:client:admin:show-gps',
    ANIMATION_SURRENDER = 'soz-core:client:animation:surrender',
    ANIMATION_GIVE = 'animation:client:give',

    BASE_ENTERED_VEHICLE = 'baseevents:enteredVehicle',
    BASE_LEFT_VEHICLE = 'baseevents:leftVehicle',
    BASE_CHANGE_VEHICLE_SEAT = 'baseevents:changedVehicleSeat',

    BENNYS_OPEN_CLOAKROOM = 'soz-core:client:job:bennys:open-cloakroom',
    BENNYS_FLATBED_DETACH_VEHICLE = 'soz-core:client:job:bennys:flatbed:detach-vehicle',

    CHARACTER_REQUEST_CHARACTER_WIZARD = 'soz-character:client:RequestCharacterWizard',

    PHONE_APP_NEWS_CREATE_BROADCAST = 'phone:app:news:createNewsBroadcast',
    CORE_CLOSE_MENU = 'soz-core:client:menu:close',

    ADMIN_NOCLIP_ENABLED = 'soz-core:client:admin:noclip:enabled',
    ADMIN_NOCLIP_DISABLED = 'soz-core:client:admin:noclip:disabled',

    AUDIO_PLAY = 'soz-core:client:audio:play',
    AUDIO_STOP = 'soz-core:client:audio:stop',
    CRIMI_USE_CLOAKROOM = 'soz-core:client:crimi:use-cloakroom',
    CRIMI_REMOVE_CLOTH = 'soz-core:client:crimi:remove-cloth',
    CRIMI_ASK_REMOTE_WORKSHOP = 'soz-core:client:crimi:ask-remote-workshop',
    CRIMI_ADD_REMOTE_WORKSHOP = 'soz-core:client:crimi:add-remote-workshop',
    CRIMI_REMOVE_REMOTE_WORKSHOP = 'soz-core:client:crimi:remove-remote-workshop',
    CRIMI_SET_TEMP_ADDITIONAL_WEIGHT = 'soz-core:client:crimi:set-temp-additional-weight',
    CRIMI_SET_TEMP_UNLIMITED_SPRINT = 'soz-core:client:crimi:set-temp-unlimited-sprint',
    CRIMI_USE_INJECTOR = 'soz-core:client:crimi:use-injector',
    CRIMI_HEAL_OVER_TIME = 'soz-core:client:crimi:heal-over-time',

    DRIVING_SCHOOL_START_EXAM = 'soz-core:client:driving-school:start-exam',
    DRIVING_SCHOOL_SETUP_EXAM = 'soz-core:client:driving-school:spawn-veh',

    FFS_ENTER_CLOTHING_SHOP = 'soz-core:client:job:ffs:enter-clothing-shop',
    FFS_EXIT_CLOTHING_SHOP = 'soz-core:client:job:ffs:exit-clothing-shop',

    FOOD_UPDATE_ORDER = 'soz-core:client:food:update-order',

    HOUSING_OPEN_UPGRADES_MENU = 'soz-core:client:housing:open-upgrades-menu',

    ITEM_USE = 'soz-core:client:item:use',
    ITEM_UMBRELLA_TOGGLE = 'soz-core:client:item:umbrella:toggle',

    HELICO_UPDATE_LIGHT = 'soz-core:client:police:update-light',

    JOBS_FFS_OPEN_SOCIETY_MENU = 'soz-jobs:client:ffs:OpenSocietyMenu',
    JOBS_BAUN_OPEN_SOCIETY_MENU = 'soz-jobs:client:baun:OpenSocietyMenu',
    JOBS_FOOD_OPEN_SOCIETY_MENU = 'jobs:client:food:OpenSocietyMenu',
    JOBS_STONK_OPEN_SOCIETY_MENU = 'stonk:client:OpenSocietyMenu',
    JOBS_MDR_OPEN_SOCIETY_MENU = 'soz-jobs:client:mdr:OpenSocietyMenu',
    JOBS_TAXI_OPEN_SOCIETY_MENU = 'soz-jobs:client:taxi:OpenSocietyMenu',
    JOBS_LSMC_OPEN_SOCIETY_MENU = 'soz-jobs:client:lsmc:OpenSocietyMenu',

    JOBS_CHECK_CLOAKROOM_STORAGE = 'soz-jobs:client:check-cloakroom-storage',
    JOB_OPEN_MENU = 'soz-core:client:job:open-menu',
    JOB_DUTY_CHANGE = 'QBCore:Client:SetDuty',
    JOB_OPEN_CLOAKROOM = 'soz-core:client:job::OpenCloakroomMenu',

    LSMC_DISEASE_APPLY_CURRENT_EFFECT = 'lsmc:maladie:client:ApplyCurrentDiseaseEffect',
    LSMC_HALLOWEEN_HORRIFIC_LOLLIPOP = 'lsmc:halloween:client:horror-lollipop',
    LSMC_REVIVE = 'soz-core:lsmc:client:revive',
    LSMC_CALL = 'soz-core:lsmc:client:call',
    LSMC_APPLY_PATIENT_CLOTHING = 'soz-core:client:lsmc:applyPatientClothing',
    LSMC_REMOVE_PATIENT_CLOTHING = 'soz-core:client:lsmc:removePatientClothing',
    LSMC_APPLY_OUTFIT = 'soz-core:client:lsmc:ApplyDutyClothing',
    LSMC_TELEPORTATION = 'soz-core:lsmc:client:teleportation',
    LSMC_HEAL = 'soz-core:lsmc:client:heal',

    MISSIVE_SHOW_ITEM = 'soz-core:client:missive:show-item',
    MONITOR_START_TRACING = 'soz-core:client:monitor:start-tracing',

    NEWS_DRAW = 'soz-core:client:news:draw',
    NOTIFICATION_DRAW = 'soz-core:client:notification:draw',
    NOTIFICATION_DRAW_ADVANCED = 'soz-core:client:notification:draw-advanced',
    NUI_SHOW_PANEL = 'soz-core:client:nui:show-panel',

    NUI_HIDE_PANEL = 'soz-core:client:nui:hide-panel',

    OBJECT_CREATE = 'soz-core:client:object:create',
    OBJECT_DELETE = 'soz-core:client:object:delete',

    OIL_REFILL_ESSENCE_STATION = 'soz-core:client:oil:refill-essence-station',
    OIL_REFILL_KEROSENE_STATION = 'soz-core:client:oil:refill-kerosene-station',
    OIL_UPDATE_STATION_PRICE = 'soz-core:client:oil:update-station-price',

    STONK_DELIVER_LOCATION = 'stonk:client:DeliverLocation',
    STONK_APPLY_OUTFIT = 'soz-core:client:stonk:ApplyDutyClothing',

    SHOP_OPEN_MENU = 'soz-core:client:shops:open-menu',
    SHOP_UPDATE_STOCKS = 'soz-core:client:update-stocks',

    // Temp event which should be internally used by a service when only soz core
    CHARACTER_SET_TEMPORARY_CLOTH = 'soz-character:Client:ApplyTemporaryClothSet',

    PLAYER_DISABLE_SPRINT = 'soz-core:client:player:disable-sprint',
    PLAYER_FORCE_ALCOHOL_EFFECT = 'soz-core:client:player:force-alcohol-effect',
    PLAYER_FORCE_DRUG_EFFECT = 'soz-core:client:player:force-drug-effect',
    PLAYER_HEALTH_DO_PUSH_UP = 'soz-core:client:player:health:push-up',
    PLAYER_HEALTH_DO_YOGA = 'soz-core:client:player:health:yoga',
    PLAYER_HEALTH_DO_SIT_UP = 'soz-core:client:player:health:sit-up',
    PLAYER_HEALTH_DO_FREE_WEIGHT = 'soz-core:client:player:health:free-weight',
    PLAYER_UPDATE = 'soz-core:client:player:update',
    PLAYER_UPDATE_WALK_STYLE = 'soz-core:client:player:update-walk-style',
    PLAYER_SET_JOB_OUTFIT = 'soz-core:client:player:set-job-outfit',
    PLAYER_SET_UNLIMITED_SPRINT = 'soz-core:client:player:set-unlimited-sprint',
    PLAYER_SHOW_IDENTITY = 'soz-core:client:player:show-identity',
    PLAYER_UPDATE_CROSSHAIR = 'soz-core:client:player:update-crosshair',
    PLAYER_UPDATE_STATE = 'soz-core:client:player:update-state',
    PLAYER_UPDATE_LIST_STATE = 'soz-core:client:player:update-list-state',
    PLAYER_ON_DEATH = 'ems:client:onDeath',

    PROGRESS_START = 'soz-core:client:progress:start',
    PROGRESS_STOP = 'soz-core:client:progress:stop',

    REPOSITORY_SYNC_DATA = 'soz-core:client:repository:sync-data',

    STATE_UPDATE_GLOBAL = 'soz-core:client:state:update-global',
    STATE_UPDATE_TIME = 'soz-core:client:state:update-time',

    VEHICLE_CONDITION_REGISTER = 'soz-core:client:vehicle:condition:register',
    VEHICLE_CONDITION_UNREGISTER = 'soz-core:client:vehicle:condition:unregister',
    VEHICLE_CONDITION_APPLY = 'soz-core:client:vehicle:condition:apply',
    VEHICLE_CONDITION_SYNC = 'soz-core:client:vehicle:condition:sync',
    VEHICLE_CLOSE_TRUNK = 'soz-core:client:vehicle:close-trunk',
    VEHICLE_DEALERSHIP_AUCTION_UPDATE = 'soz-core:client:vehicle:dealership:auction:update',
    VEHICLE_DELETE = 'soz-core:client:vehicle:delete',
    VEHICLE_FUEL_START = 'soz-core:client:vehicle:fuel:start',
    VEHICLE_CHARGE_START = 'soz-core:client:vehicle:charge:start',
    VEHICLE_FUEL_STOP = 'soz-core:client:vehicle:fuel:stop',
    VEHICLE_CHARGE_STOP = 'soz-core:client:vehicle:charge:stop',
    VEHICLE_GET_CLOSEST = 'soz-core:client:vehicle:get-closest',
    VEHICLE_GARAGE_HOUSE_OPEN_MENU = 'soz-core:client:vehicle:garage:house:open-menu',
    VEHICLE_GARAGE_HOUSE_SHOW_PARKING = 'soz-core:client:vehicle:garage:house:show-parking',
    VEHICLE_ROUTE_EJECTION = 'soz-core:client:vehicle:route-ejection',
    VEHICLE_SET_TRUNK_STATE = 'soz-core:client:vehicle:set-trunk-state',
    VEHICLE_RADAR_FLASHED = 'soz-core:client:vehicle:radar:flashed',
    VEHICLE_RADAR_TRIGGER = 'soz-core:client:radar:trigger',
    VEHICLE_UPDATE_STATE = 'soz-core:client:vehicle:update-state',
    VEHICLE_DELETE_STATE = 'soz-core:client:vehicle:delete-state',
    VEHICLE_LOCKPICK = 'soz-core:client:vehicle:lockpick',
    VEHICLE_SET_OPEN_LIST = 'soz-core:client:vehicle:set-open-list',

    VOIP_UPDATE_MODE = 'soz-core:client:voip:update-mode',
    VOIP_SET_MEGAPHONE = 'soz-core:client:voip:set-megaphone',
    VOIP_ITEM_RADIO_TOGGLE = 'soz-core:client:voip:item-radio:toggle',
    VOIP_ITEM_MEGAPHONE_TOGGLE = 'soz-core:client:voip:item-megaphone:toggle',
    VOIP_ITEM_MICROPHONE_TOGGLE = 'soz-core:client:voip:item-microphone:toggle',
    VOIP_RADIO_VEHICLE_ENABLE = 'soz-core:client:voip:radio-vehicle-enable',
    VOIP_RADIO_VEHICLE_UPDATE = 'soz-core:client:voip:radio-vehicle-update',

    UPW_OPEN_CLOAKROOM = 'soz-core:client:job:upw:open-cloakroom',
    UPW_CREATE_CHARGER = 'soz-core:client:job:upw:create-charger',

    RADAR_TOGGLE_BLIP = 'soz-core:client:radar:toggle-blip',

    ZEVENT_TOGGLE_TSHIRT = 'soz-core:client:zevent:toggle-tshirt',

    WEAPON_USE_WEAPON = 'soz-core:client:weapon:use-weapon',
    WEAPON_USE_WEAPON_NAME = 'soz-core:client:weapon:use-weapon-name',
    WEAPON_USE_AMMO = 'soz-core:client:weapon:use-ammo',
    WEAPON_OPEN_GUNSMITH = 'soz-core:client:weapon:open-gunsmith',
    WEAPON_EXPLOSION = 'soz-core:client:weapon:explosion',

    MDR_USE_TICKET = 'soz-core:client:mdr:use-ticket',
    HEIST_GUARD = 'soz-core:client:heist:guard',
    HEIST_PLAY_ANIM = 'soz-core:client:heist:play-anim',

    INJURY_DEATH = 'soz-core:client:injury:death',

    TAKE_DOWN = 'soz-core:client:player:animation:takedown',
    TAKE_DOWN_TARGET = 'soz-core:client:player:animation:takedown-target',

    POLICE_OPEN_CLOAKROOM = 'soz-core:client:police:OpenCloakroomMenu',
    POLICE_APPLY_OUTFIT = 'soz-core:client:police:ApplyDutyClothing',
    POLICE_SET_PRISONER_CLOTHES = 'soz-core:client:police:SetPrisonerClothes',
    POLICE_SETUP_ARMOR = 'soz-core:client:police:setup-armor',
    POLICE_MOBILE_RADAR = 'soz-core:client:police:mobile-radar',
    POLICE_BREATHANALYZER_TARGET = 'soz-core:client:police:breathanalyzer-target',

    HELICO_ADD_LIGHT = 'soz-core:client:police:add-light',
    HELICO_REMOVE_LIGHT = 'soz-core:client:police:del-light',

    TALENT_TREE_DISABLE_CRIMI = 'soz-core:client:talent:disable-crimi',
    TALENT_NEW_CRIMI = 'soz-core:client:talent:new-crimi',

    PLAYER_TELEPORT = 'soz-core:client:player:teleport',

    HUB_ENTER = 'soz-core:client:hub:enter',
    HUB_REMOVE_STATUS = 'soz-core:client:hub:remove-status',

    CRIMI_HOOD = 'soz-core:server:crimi:hood',
    CRIMI_SMOKE = 'soz-core:server:crimi:smoke',

    EASTER_EAR_TOGGLE = 'soz-core:server:easter:toogle-ear',

    BINOCULARS_TOGGLE = 'items:binoculars:toggle',
    BINOCULARS_SET = 'items:binoculars:set',

    RACKET_START_PHASE = 'soz-core:client:racket:start-phase',

    // Not core
    LOCATION_ENTER = 'locations:zone:enter',
    LOCATION_EXIT = 'locations:zone:exit',
}

export enum GameEvent {
    CEventNetworkPedDamage = 'CEventNetworkPedDamage',
    CEventNetworkVehicleUndrivable = 'CEventNetworkVehicleUndrivable',
    CEventVehicleCollision = 'CEventVehicleCollision',
    CEventExplosionHeard = 'CEventExplosionHeard',
    CEventGunShot = 'CEventGunShot',
}

export enum NuiEvent {
    AdminAutoPilot = 'soz-core:client:admin:autopilot',
    AdminChangePlayer = 'soz-core:client:admin:change-player',
    AdminCopyCoords = 'soz-core:client:admin:copy-coords',
    AdminCreateZone = 'soz-core:client:admin:create-zone',
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
    AdminMenuPlayerHandleResetHalloween = 'soz-core:client:admin:handle-reset-halloween',
    AdminMenuPlayerHandleOpenGunSmith = 'soz-core:client:admin:handle-open-gunsmith',
    AdminMenuPlayerHandleInjuriesUpdate = 'soz-core:client:admin:handle-injuries-update',
    AdminMenuPlayerHandleSetReputation = 'soz-core:client:admin:set-reputation',
    AdminMenuPlayerHandleResetCrimi = 'soz-core:client:admin:reset-crimi',
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
    AdminToggleNoStall = 'soz-core:client:admin:set-no-stall',
    AdminToggleMoneyCase = 'soz-core:client:admin:toggle-disable-money-case',
    AdminToggleNoClip = 'soz-core:client:admin:toggle-noclip',
    AdminToggleShowCoordinates = 'soz-core:client:admin:toggle-show-coordinates',
    AdminToggleShowMileage = 'soz-core:client:admin:toggle-show-mileage',
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
    AdminMenuGameMasterCreateNewCharacter = 'soz-core:client:admin:game-master:create-new-character',
    AdminMenuGameMasterSwitchCharacter = 'soz-core:client:admin:game-master:switch-character',
    AdminSetAdminGPS = 'soz-core:client:admin:gps',
    BaunDisplayBlip = 'soz-core:client:job:baun:display-blip',
    CraftingDoCraft = 'soz-core:nui:crafting:do-craft',
    CraftingDoSalvage = 'soz-core:nui:crafting:do-salvage',
    CraftingCancel = 'soz-core:nui:crafting:cancel',
    StonkDisplayBlip = 'soz-core:client:job:stonk:display-blip',

    JobPlaceProps = 'soz-core:client:job:place-props',

    LsmcPharmacyBuyItem = 'soz-core:nui:job:lsmc:pharmacy:buy-item',

    BennysCancelOrder = 'soz-core:client:job:bennys:cancel-order',
    BennysOrder = 'soz-core:client:job:bennys:order',
    BennysGetOrders = 'soz-core:client:job:bennys:get-orders',
    BennysUpgradeVehicle = 'soz-core:nui:job:bennys:upgrade-vehicle',

    FfsDisplayBlip = 'soz-core:client:job:ffs:display-blip',
    FoodDisplayBlip = 'soz-core:client:job:food:display-blip',
    PlayerSetHealthBookField = 'soz-core:client:player:health-book:set',
    InputSet = 'soz-core:client:input:set',
    InputCancel = 'soz-core:client:input:cancel',

    Loaded = 'soz-core:nui:loaded',
    MenuClosed = 'menu_closed',
    JobBossShopBuyItem = 'soz-core:nui:job:boss-shop:buy-item',
    OilAskStationPrice = 'soz-core:nui:job:oil:ask-station-price',
    UpwDisplayBlips = 'soz-core:nui:job:upw:display-blips',

    PanelClosed = 'soz-core:nui:panel:closed',

    Ping = 'soz-core:nui:ping',

    PlayerGetMugshot = 'soz-core:nui:player:get-mugshot',
    PlayerMenuOpenKeys = 'soz-core:nui:player:menu:open-keys',
    PlayerMenuCardShow = 'soz-core:nui:player:menu:card-show',
    PlayerMenuCardSee = 'soz-core:nui:player:menu:card-see',
    PlayerMenuInvoicePay = 'soz-core:nui:player:menu:pay-invoice',
    PlayerMenuInvoiceDeny = 'soz-core:nui:player:menu:deny-invoice',
    PlayerMenuClothConfigUpdate = 'soz-core:nui:player:menu:cloth-config-update',
    PlayerMenuAnimationPlay = 'soz-core:nui:player:menu:animation-play',
    PlayerMenuAnimationSetWalk = 'soz-core:nui:player:menu:animation-set-walk',
    PlayerMenuAnimationSetMood = 'soz-core:nui:player:menu:animation-set-mood',
    PlayerMenuAnimationStop = 'soz-core:nui:player:menu:animation-stop',
    PlayerMenuAnimationFavorite = 'soz-core:nui:player:menu:animation-favorite',
    PlayerMenuAnimationFavoriteDelete = 'soz-core:nui:player:menu:animation-favorite-delete',
    PlayerMenuHudSetGlobal = 'soz-core:nui:player:menu:hud-set-global',
    PlayerMenuHudSetCinematicMode = 'soz-core:nui:player:menu:hud-set-cinematic-mode',
    PlayerMenuHudSetCinematicCameraActive = 'soz-core:nui:player:menu:hud-set-cinematic-camera-active',
    PlayerMenuHudSetScaledNui = 'soz-core:nui:player:menu:hud-set-scaled-nui',
    PlayerMenuJobGradeCreate = 'soz-core:nui:player:menu:job-grade-create',
    PlayerMenuJobGradeDelete = 'soz-core:nui:player:menu:job-grade-delete',
    PlayerMenuJobGradeSetDefault = 'soz-core:nui:player:menu:job-grade-set-default',
    PlayerMenuJobGradeUpdateSalary = 'soz-core:nui:player:menu:job-grade-update-salary',
    PlayerMenuJobGradeUpdateWeight = 'soz-core:nui:player:menu:job-grade-update-weight',
    PlayerMenuJobGradePermissionUpdate = 'soz-core:nui:player:menu:job-grade-permission-update',
    PlayerMenuVoipReset = 'soz-core:nui:player:menu:voip-reset',
    SetFocusInput = 'soz-core:nui:set-focus-input',
    SetWardrobeOutfit = 'soz-core:nui:set-wardrobe-outfit',

    BossShopBuy = 'soz-core:client:shop:boss:buy',

    SuperetteShopBuy = 'soz-core:client:shop:superette:buy',
    TattooShopResetTattos = 'soz-core:client:shop:tattoo:resetTattos',
    TattooShopBuy = 'soz-core:client:shop:tattoo:buy',
    TattoShopPreview = 'soz-core:client:shop:tattoo:preview',
    TattooShopSelectCategory = 'soz-core:client:shop:tattoo:select-category',
    ClothingShopPreview = 'soz-core:client:shop:clothing:preview',
    ClothingShopBuy = 'soz-core:client:shop:clothing:buy',
    ClothingShopBackspace = 'soz-core:client:shop:clothing:backspace',
    ClothShopToggleCamera = 'soz-core:client:shop:clothing:toggle-camera',
    JewelryShopPreview = 'soz-core:client:shop:jewelry:preview',
    JewelryShopBuy = 'soz-core:client:shop:jewelry:buy',
    JewelryShopBackspace = 'soz-core:client:shop:jewelry:backspace',
    JewelryShopToggleCamera = 'soz-core:client:shop:jewelry:toggle-camera',
    BarberShopPreview = 'soz-core:client:shop:barber:preview',
    BarberShopBuy = 'soz-core:client:shop:barber:buy',

    TriggerServerEvent = 'soz-core:nui:trigger-server-event',
    TriggerClientEvent = 'soz-core:nui:trigger-client-event',

    VehicleAuctionBid = 'soz-core:client:vehicle:auction:bid',

    VehicleCustomApply = 'soz-core:nui:vehicle:custom:apply',
    VehicleCustomConfirmModification = 'soz-core:nui:vehicle:custom:confirm-modification',

    VehicleDealershipShowVehicle = 'soz-core:client:vehicle:dealership:show-vehicle',
    VehicleDealershipBuyVehicle = 'soz-core:client:vehicle:dealership:buy-vehicle',

    VehicleSetEngine = 'soz-core:nui:vehicle:set-engine',
    VehicleSetSpeedLimit = 'soz-core:nui:vehicle:set-speed-limit',
    VehicleOpenLSCustom = 'soz-core:nui:vehicle:open-ls-custom',
    VehicleSetDoorOpen = 'soz-core:nui:vehicle:set-door-open',
    VehicleHandleRadio = 'soz-core:nui:vehicle:handle-radio',

    VehicleGarageTakeOut = 'soz-core:client:vehicle:garage:take-out',
    VehicleGarageSetName = 'soz-core:client:vehicle:garage:set-name',
    VehicleGarageStore = 'soz-core:client:vehicle:garage:store',
    VehicleGarageStoreTrailer = 'soz-core:client:vehicle:garage:store-trailer',
    VehicleGarageShowPlaces = 'soz-core:client:vehicle:garage:show-places',

    VoipCloseRadio = 'soz-core:nui:voip:close-radio',
    VoipEnableRadio = 'soz-core:nui:voip:enable-radio',
    VoipUpdateRadioChannel = 'soz-core:nui:voip:update-radio-channel',

    VoipCloseRadioVehicle = 'soz-core:nui:voip:close-radio-vehicle',
    VoipEnableRadioVehicle = 'soz-core:nui:voip:enable-radio-vehicle',
    VoipUpdateRadioVehicleChannel = 'soz-core:nui:voip:update-radio-vehicle-channel',

    UpwGetOrders = 'soz-core:client:job:upw:get-orders',
    UpwOrder = 'soz-core:client:job:upw:order',
    UpwGetCatalog = 'soz-core:client:job:upw:get-catalog',
    UpwCancelOrder = 'soz-core:client:job:upw:cancel-order',

    GunSmithRenameWeapon = 'soz-core:client:job:gunsmith:rename-weapon',
    GunSmithPreviewTint = 'soz-core:client:job:gunsmith:preview-tint',
    GunSmithPreviewAnimation = 'soz-core:client:job:gunsmith:preview-animation',
    GunSmithPreviewAttachment = 'soz-core:client:job:gunsmith:preview-attachment',
    GunSmithApplyConfiguration = 'soz-core:client:job:gunsmith:apply-configuration',

    DrivingSchoolUpdateVehicleLimit = 'soz-core:client:driving-school:update-vehicle-limit',
    DrivingSchoolCheckVehicleSlots = 'soz-core:client:driving-school:check-vehicle-slots',

    HousingUpgradeApartment = 'soz-core:client:housing:upgrade-apartment',

    ToggleRadar = 'soz-core:client:radar:toggle',
    RedCall = 'soz-core:client:police:red-call',

    IllegalShopBuyItem = 'soz-core:client:hubshop:buy',

    TalentTreeBuy = 'soz-core:client:talent-tree:buy',
    TalentTreeReset = 'soz-core:client:talent-tree:reset',
    TalentSetCriminalMode = 'soz-core:client:talent:set-criminal-mode',

    WardrobeElementSelect = 'soz-core:client:wardrobe:element-select',
    WardrobeCustomSave = 'soz-core:client:wardrobe:custom-save',

    EasterShopBuy = 'soz-core:client:eatershop:buy',

    TaxiSetMission = 'soz-core:client:taxi:set-mission',
    TaxiSetHorodateur = 'soz-core:client:taxi:set-horodateur',
    TaxiDisplayHorodateur = 'soz-core:client:taxi:display-horodateur',
}
