export enum ServerEvent {
    PHONE_APP_NEWS_CREATE_BROADCAST = 'phone:app:news:createNewsBroadcast',

    ADMIN_RESET_HALLOWEEN = 'soz-core:server:admin:reset-halloween',
    ADMIN_ADD_MONEY = 'soz-core:server:admin:add-money',
    ADMIN_ADD_LICENSE = 'soz-core:server:admin:add-license',
    ADMIN_SET_AIO = 'soz-core:server:admin:set-aio',
    ADMIN_SET_METADATA = 'soz-core:server:admin:set-metadata',
    ADMIN_SET_DISEASE = 'soz-core:server:admin:set-disease',
    ADMIN_SET_STAMINA = 'soz-core:server:admin:set-stamina',
    ADMIN_SET_STRENGTH = 'soz-core:server:admin:set-strength',
    ADMIN_SET_STRESS_LEVEL = 'soz-core:server:admin:set-stress-level',
    ADMIN_SET_INJURIES_COUNT = 'soz-core:server:admin:set-injuries-count',
    ADMIN_SET_REPUTATION = 'soz-core:server:admin:set-reputation',
    ADMIN_SET_DRUG_EFFECT = 'soz-core:server:admin:set-drug-effect',
    ADMIN_SET_ALCOHOL_EFFECT = 'soz-core:server:admin:set-drug-effect',
    ADMIN_SET_JOB = 'soz-core:server:admin:add-license',
    ADMIN_SET_CLOTHES = 'soz-core:server:admin:set-clothes',
    ADMIN_SET_GOD_MODE = 'soz-core:server:admin:set-god-mode',
    ADMIN_KILL_PLAYER = 'soz-core:server:admin:kill-player',
    ADMIN_RESET_EFFECT = 'soz-core:server:admin:reset-effect',
    ADMIN_FREEZE_PLAYER = 'soz-core:server:admin:freeze-player',
    ADMIN_UNFREEZE_PLAYER = 'soz-core:server:admin:unfreeze-player',
    ADMIN_SPECTATE_PLAYER = 'soz-core:server:admin:spectate-player',
    ADMIN_TELEPORT_TO_PLAYER = 'soz-core:server:admin:teleport-to-player',
    ADMIN_TELEPORT_PLAYER_TO_ME = 'soz-core:server:admin:teleport-player-to-me',
    ADMIN_UNCUFF_PLAYER = 'soz-core:server:admin:uncuff-player',
    ADMIN_RESET_SKIN = 'soz-core:server:admin:reset-skin',
    ADMIN_RESET_CRIMI = 'soz-core:server:admin:reset-crimi',
    ADMIN_RESET_CLIENT_STATE = 'soz-core:server:admin:reset-client-state',
    ADMIN_VEHICLE_SEE_CAR_PRICE = 'soz-core:server:admin:vehicle:see-car-price',
    ADMIN_VEHICLE_CHANGE_CAR_PRICE = 'soz-core:server:admin:vehicle:change-car-price',
    ADMIN_VEHICLE_SPAWN = 'soz-core:server:admin:vehicle:spawn',
    ADMIN_VEHICLE_DELETE = 'soz-core:server:admin:vehicle:delete',
    ADMIN_CREATE_CHARACTER = 'soz-core:server:admin:create-character',
    ADMIN_SWITCH_CHARACTER = 'soz-core:server:admin:switch-character',
    ADMIN_ADD_PERSISTENT_PROP = 'soz-core:server:admin:add-persistent-prop',
    ADMIN_ADD_VEHICLE = 'soz-core:server:admin:add-vehicle',
    ADMIN_PLAYER_SET_ZOMBIE = 'soz-core:server:admin:player:set-zombie',

    BASE_ENTERED_VEHICLE = 'baseevents:enteredVehicle',
    BASE_LEFT_VEHICLE = 'baseevents:leftVehicle',
    BASE_CHANGE_VEHICLE_SEAT = 'baseevents:changeVehicleSeat',

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

    DMC_HARVEST = 'soz-core:server:job:dmc:harvest',
    DMC_TOGGLE_CONVERTER = 'soz-core:server:job:dmc:toggle-converter',
    DMC_SET_CONVERTER_TARGET_TEMPERATURE = 'soz-core:server:job:dmc:set-converter-target-temperature',
    DMC_RESTOCK = 'soz-core:server:job:dmc:restock',

    FIVEM_PLAYER_CONNECTING = 'playerConnecting',

    FOOD_ORDER_MEALS = 'soz-core:server:job:food:order-meals',
    FOOD_RETRIEVE_ORDER = 'soz-core:server:job:food:retrieve-order',
    FOOD_RETRIEVE_STATE = 'soz-core:server:job:food:retrieve-state',
    FOOD_EASTER_HARVEST = 'soz-core:server:job:food:easter-harvest',

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
    LSMC_SET_PATIENT_OUTFIT = 'soz-core:server:job:lsmc:set-patient-outfit',

    LSC_CHECK_STOCK = 'soz-core:server:job:lsc:check-stock',

    MISSIVE_CREATE_ITEM = 'soz-core:server:missive:create-item',
    MISSIVE_DELETE_ITEM = 'soz-core:server:missive:delete-item',
    MISSIVE_COMPLETE = 'soz-core:server:missive:complete',

    MONITOR_ADD_EVENT = 'soz-core:server:monitor:add-event',
    MONITOR_LOG = 'soz-core:server:monitor:log',

    NEWS_ADD_FLASH = 'soz-core:server:news:add-flash',
    NEWS_NEWSPAPER_SOLD = 'soz-core:server:job:news:newspaper-sold',
    NEWS_NEWSPAPER_FARM = 'soz-core:server:job:news:newspaper-farm',
    NEWS_PLACE_OBJECT = 'soz-core:server:job:news:place-object',

    OBJECT_COLLECT = 'soz-core:server:object:collect',
    OBJECT_ATTACHED_REGISTER = 'soz-core:client:object:attached:register',
    OBJECT_ATTACHED_UNREGISTER = 'soz-core:client:object:attached:unregister',

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

    PLAYER_ZOMBIE_CONVERT = 'soz-core:server:player:zombie:convert',
    PLAYER_ZOMBIE_REMOVE = 'soz-core:server:player:zombie:remove',

    PLAYER_OPEN_WALLET = 'soz-core:server:player:open-wallet',

    PROGRESS_FINISH = 'soz-core:server:progress:finish',

    PROP_REQUEST_DELETE_PROP = 'soz-core:server:prop:request-delete',
    PROP_REQUEST_EDIT_PROP = 'soz-core:server:prop:request-edit',

    STORY_HALLOWEEN_2023_SCENARIO_1 = 'soz-core:server:halloween:scenario1',
    STORY_HALLOWEEN_2023_SCENARIO_2 = 'soz-core:server:halloween:scenario2',
    STORY_HALLOWEEN_2023_SCENARIO_3 = 'soz-core:server:halloween:scenario3',
    STORY_HALLOWEEN_2023_SCENARIO_4 = 'soz-core:server:halloween:scenario4',

    STORAGE_REMOVE_ITEM = 'soz-core:server:storage:remove-item',
    SHOP_BOSS_BUY = 'soz-core:server:shop:boss:buy',
    SHOP_EASTER_BUY = 'soz-core:server:shop:easter:buy',
    SHOP_VALIDATE_CART = 'soz-core:server:shop:validate-cart',

    UPW_CREATE_CHARGER = 'soz-core:server:job:upw:create-charger',
    UPW_REFILL_STATION = 'soz-core:server:job:upw:refill-station',
    UPW_CHANGE_BATTERY = 'soz-core:server:job:upw:change-battery',
    UPW_SET_CHARGER_PRICE = 'soz-core:server:job:upw:set-charger-price',

    PAWL_DECREASE_CHAINSAW_FUEL = 'soz-core:server:job:pawl:decrease-chainsaw-fuel',

    SHOP_BUY = 'soz-core:server:shop:buy',
    SHOP_TATTOO_RESET = 'soz-core:server:shop:tattoo-reset',
    ZKEA_CHECK_STOCK = 'soz-core:client:shop:zkea:check-stock',

    AFK_KICK = 'soz-core:server:afk:kick',

    // not core

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
    LSMC_NEW_URGENCY = 'soz-core:lsmc:server:new-urgency',
    LSMC_GIVE_BLOOD = 'soz-core:lsmc:server:give-blood',
    LSMC_TELEPORTATION = 'soz-core:lsmc:server:teleportation',

    METRICS_UPDATE = 'soz-core:server:metrics:update',

    REPOSITORY_REFRESH_DATA = 'soz-core:server:repository:refresh-data',

    TAXI_NPC_PAY = 'soz-core:server:taxi:npc-pay',

    VEHICLE_USE_REPAIR_KIT = 'soz-core:server:vehicle:use-repair-kit',
    VEHICLE_USE_BODY_REPAIR_KIT = 'soz-core:server:vehicle:use-body-repair-kit',
    VEHICLE_USE_CLEANING_KIT = 'soz-core:server:vehicle:use-cleaning-kit',
    VEHICLE_USE_WHEEL_KIT = 'soz-core:server:vehicle:use-wheel-kit',
    VEHICLE_FORCE_OPEN = 'soz-core:server:vehicle:force-open',
    VEHICLE_SET_CLOSEST = 'soz-core:server:vehicle:set-closest',
    VEHICLE_DELETED = 'soz-core:server:vehicle:deleted',
    VEHICLE_GARAGE_STORE = 'soz-core:server:vehicle:garage:store',
    VEHICLE_GARAGE_RETRIEVE = 'soz-core:server:vehicle:garage:retrieve',
    VEHICLE_GARAGE_RENAME = 'soz-core:server:vehicle:garage:rename',
    VEHICLE_GARAGE_TRANSFER = 'soz-core:server:vehicle:garage:transfer',
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
    WEAPON_SHOOTING_ALERT = 'soz-core:server:weapon:shooting-alert',

    VANDALISM_ABORT = 'soz-core:server:vandalism:abort',
    VANDALISM_REPAIR = 'soz-core:server:vandalism:repair',

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
    CRIMI_USE_JAMMER = 'soz-core:server:crimi:use-jammer',

    TALENT_TREE_DISABLE_CRIMI = 'soz-core:server:talent:disable-crimi',

    CRAFTING_TRAINING = 'soz-core:crafting:craft-training',

    ALERT_POLICE = 'soz-core:alert:notification:draw-police',
    ALERT_MESSAGE = 'phone:createSocietyMessagesBroadcast',

    FISHING_SUCCESS = 'soz-core:server:fishing:success',
    FISHING_GARBAGE = 'soz-core:server:fishing:garbage',
    FISHING_RESELL = 'soz-core:server:fishing:resell',
    FISHING_RENT_BOAT = 'soz-core:server:fishing:rent-boat',
    FISHING_REMOVE_BAIT = 'soz-core:server:fishing:remove-bait',
    FISHING_RETURN_BOAT = 'soz-core:server:fishing:return-boat',

    SOZEDEX_CLAIM_REWARD = 'soz-core:server:sozedex:claim-reward',

    DRUGS_SHOP_BUY = 'soz-core:server:drug:shop-buy',
    DRUGS_ADD_SKILL = 'soz-core:server:drug:add-skill',
    DRUGS_HARVEST_FIELDS = 'soz-core:server:drugs:harvest-fields',
    DRUGS_WATER = 'soz-core:server:drugs:water',
    DRUGS_CHECK = 'soz-core:server:drugs:check',
    DRUGS_HARVEST = 'soz-core:server:drugs:harvest',
    DRUGS_DESTROY = 'soz-core:server:drugs:destroy',
    DRUGS_SELL_PED = 'soz-core:server:drugs:sell-ped',
    DRUGS_SELL_CONTRACT = 'soz-core:server:drugs:sell-contract',
    DRUGS_STOLEN = 'soz-core:server:drugs:stolen',
    DRUGS_GARDEN_ADD = 'soz-core:server:drugs:garden-add',
    DRUGS_GARDEN_REMOVE = 'soz-core:server:drugs:garden-remove',
    DRUGS_ZONE_ADD = 'soz-core:server:drugs:zone-add',
    DRUGS_ZONE_DELETE = 'soz-core:server:drugs:zone-delete',
    DRUGS_ZONE_UPDATE = 'soz-core:server:drugs:zone-update',

    RACE_ADD = 'soz-core:server:race:add',
    RACE_UPDATE = 'soz-core:server:race:update',
    RACE_DELETE = 'soz-core:server:race:delete',
    RACE_FINISH = 'soz-core:server:race:finish',
    RACE_CLEAR_RANKING = 'soz-core:server:race:clear-ranking',

    FDF_TREE_CUT = 'soz-core:server:fdf:tree-cut',
    FDF_TREE_WATER = 'soz-core:server:fdf:tree-water',
    FDF_TREE_CHECK = 'soz-core:server:fdf:tree-check',
    FDF_FIELD_HILLING = 'soz-core:server:fdf:field-hilling',
    FDF_FIELD_HARVEST = 'soz-core:server:fdf:field-harvest',
    FDF_FIELD_DESTROY = 'soz-core:server:fdf:field-destroy',
    FDF_FIELD_PLOW = 'soz-core:server:fdf:field-plow',
    FDF_FIELD_PLANT = 'soz-core:server:fdf:field-plant',
    FDF_FIELD_CHECK = 'soz-core:server:fdf:field-check',
    FDF_TRACTOR_HARVEST = 'soz-core:server:fdf:field-tractor-harvest',
}
