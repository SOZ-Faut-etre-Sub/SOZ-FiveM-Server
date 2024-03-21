export enum RpcServerEvent {
    ADMIN_GET_PLAYERS = 'soz-core:admin:get-players',
    ADMIN_GET_CHARACTERS = 'soz-core:admin:get-characters',
    ADMIN_GET_FULL_PLAYERS = 'soz-core:admin:get-full-players',
    ADMIN_GET_VEHICLES = 'soz-core:admin:get-vehicles',
    ADMIN_IS_ALLOWED = 'soz-core:admin:is-allowed',
    ADMIN_GET_REPUTATION = 'soz-core:admin:get-reputation',
    ADMIN_MAPPER_SET_APARTMENT_PRICE = 'soz-core:admin:mapper:set-apartment-price',
    ADMIN_MAPPER_SET_APARTMENT_NAME = 'soz-core:admin:mapper:set-apartment-name',
    ADMIN_MAPPER_SET_APARTMENT_IDENTIFIER = 'soz-core:admin:mapper:set-apartment-identifier',
    ADMIN_MAPPER_UPDATE_APARTMENT_ZONE = 'soz-core:admin:mapper:update-apartment-zone',
    ADMIN_MAPPER_UPDATE_PROPERTY_ZONE = 'soz-core:admin:mapper:update-property-zone',
    ADMIN_MAPPER_ADD_APARTMENT = 'soz-core:admin:mapper:add-apartment',
    ADMIN_MAPPER_ADD_PROPERTY = 'soz-core:admin:mapper:add-property',
    ADMIN_MAPPER_ADD_PROPERTY_CULLING = 'soz-core:admin:mapper:add-property-culling',
    ADMIN_MAPPER_REMOVE_PROPERTY_CULLING = 'soz-core:admin:mapper:remove-property-culling',
    ADMIN_MAPPER_REMOVE_PROPERTY = 'soz-core:admin:mapper:remove-property',
    ADMIN_MAPPER_REMOVE_APARTMENT = 'soz-core:admin:mapper:remove-apartment',
    ADMIN_MAPPER_SET_SENATE_PARTY = 'soz-core:admin:mapper:set-senate-party',
    ADMIN_MAPPER_SET_OWNER = 'soz-core:admin:mapper:set-owner',
    ADMIN_MAPPER_CLEAR_OWNER = 'soz-core:admin:mapper:clear-owner',
    ADMIN_MAPPER_SET_APARTMENT_TIER = 'soz-core:admin:mapper:set-apartment-tier',
    ADMIN_OCEAN = 'soz-core:admin:ocean',
    ADMIN_METEOR_STATE = 'soz-core:admin:meteor:state',

    BENNYS_GET_ORDERS = 'soz-core:server:job:bennys:get-orders',
    BENNYS_CANCEL_ORDER = 'soz-core:server:job:bennys:cancel-order',
    BENNYS_ORDER_VEHICLE = 'soz-core:server:job:bennys:order-vehicle',

    CRIMI_CAN_USE_CLOAKROOM = 'soz-core:server:crimi:can-use-cloakroom',
    CRIMI_IS_NAKED = 'soz-core:server:crimi:is-naked',
    CRIMI_SIPHON_CHECK = 'soz-core:server:crimi:siphon-check',

    DRIVING_SCHOOL_SPAWN_VEHICLE = 'soz-core:server:driving-school:spawn-vehicle',
    DRIVING_SCHOOL_CHECK_REMAINING_SLOTS = 'soz-core:server:driving-school:check-vehicle-slots',

    DMC_GET_CONVERTER_STATE = 'soz-core:server:job:dmc:get-converter-state',

    INVENTORY_SEARCH = 'soz-core:inventory:search',

    HOUSING_GET_TEMPORARY_ACCESS = 'soz-core:server:housing:get-temporary-access',
    HOUSING_GET_FOURNITURE = 'soz-core:server:housing:get-fourniture',
    HOUSING_GET_LIGHTS = 'soz-core:server:housing:get-lights',
    HOUSING_EDIT_FOURNITURE = 'soz-core:server:housing:edit-fourniture',
    HOUSING_SET_SHELL = 'soz-core:server:housing:set-shell',

    JOBS_USE_WORK_CLOTHES = 'soz-core:server:job:use-work-clothes',

    OIL_GET_STATION = 'soz-core:job:oil:get-station',
    OIL_GET_STATION_PRICES = 'soz-core:job:oil:get-station-prices',
    OIL_LOCK_TANKER = 'soz-core:job:oil:lock-tanker',

    PLAYER_GET_CLIENT_STATE = 'soz-core:player:get-client-state',
    PLAYER_GET_LIST_STATE = 'soz-core:player:get-list-state',
    PLAYER_GET_SERVER_STATE = 'soz-core:player:get-server-state',
    PLAYER_GET_JWT_TOKEN = 'soz-core:player:get-jwt-token',
    PLAYER_GET_LICENCES = 'soz-core:player:get-licences',
    PLAYER_TELEPORT = 'soz-core:player:teleport',
    PLAYER_GET_JOB = 'soz-core:player:get-job',

    CRAFTING_GET_RECIPES = 'soz-core:crafting:get-recipes',
    CRAFTING_DO_CRAFT = 'soz-core:crafting:do-craft',
    CRAFTING_DO_SALVAGE = 'soz-core:crafting:do-salvage',

    CLOTHING_GET_WARM_SCORE = 'soz-core:clothing:gwarm-score',
    CLOTHING_GET_SHOP = 'soz-core:clothing:get-shop',

    STORY_HALLOWEEN_SCENARIO1 = 'soz-story:server:halloween1',
    STORY_HALLOWEEN_SCENARIO2 = 'soz-story:server:halloween2',
    STORY_HALLOWEEN_SCENARIO3 = 'soz-story:server:halloween3',
    STORY_HALLOWEEN_SCENARIO4 = 'soz-story:server:halloween4',

    REPOSITORY_GET_DATA = 'soz-core:repository:get-data',
    REPOSITORY_GET_DATA_2 = 'soz-core:repository:get-data-2',

    GET_DISABLE_NPC = 'soz-core:utils:get-disable-npc',

    VEHICLE_CUSTOM_GET_MODS = 'soz-core:vehicle:custom:get-mods',
    VEHICLE_CUSTOM_SET_MODS = 'soz-core:vehicle:custom:set-mods',
    VEHICLE_DEALERSHIP_AUCTION_BID = 'soz-core:vehicle:dealership:auction:bid',
    VEHICLE_DEALERSHIP_GET_AUCTIONS = 'soz-core:vehicle:dealership:get-auctions',
    VEHICLE_DEALERSHIP_GET_LIST = 'soz-core:vehicle:dealership:get-list',
    VEHICLE_DEALERSHIP_GET_LIST_JOB = 'soz-core:vehicle:dealership:get-list-job',
    VEHICLE_DEALERSHIP_BUY = 'soz-core:vehicle:dealership:buy',
    VEHICLE_GARAGE_GET_VEHICLES = 'soz-core:vehicle:garage:get-vehicles',
    VEHICLE_GARAGE_GET_PLACES = 'soz-core:vehicle:garage:get-places',
    VEHICLE_GARAGE_GET_PROPERTY_PLACES = 'soz-core:vehicle:garage:get-property-places',
    VEHICLE_GARAGE_GET_MAX_PLACES = 'soz-core:vehicle:garage:get-max-places',
    VEHICLE_HAS_KEY = 'soz-core:vehicle:has-key',
    VEHICLE_GET_STATE = 'soz-core:rpc:vehicle:get-state',
    VEHICLE_GET_CONFIGURATION = 'soz-core:rpc:vehicle:get-configuration',
    VEHICLE_GET_CONDITION = 'soz-core:rpc:vehicle:get-condition',
    VEHICLE_GET_MUTED_SIRENS = 'soz-core:rpc:vehicle:get-muted-sirens',
    VEHICLE_GET_OPENED = 'soz-core:rpc:vehicle:get-opened',
    VEHICLE_FDO_GET_POSTIONS = 'soz-core:rpc:vehicle:fdo-get-positions',
    VEHICLE_PITSTOP_DATA = 'soz-core:rpc:vehicle:pitstop:data',
    VEHICLE_PITSTOP_PRICES = 'soz-core:rpc:vehicle:pitstop:price',
    VEHICLE_PITSTOP_PRICES_UPDATE = 'soz-core:rpc:vehicle:pitstop:price-update',
    VEHICLE_SPAWN_TEMPORARY = 'soz-core:rpc:vehicle:spawn-temporary',

    VEHICLE_ORDER_GET = 'soz-core:vehicle:orders-get',
    VEHICLE_ORDER_CANCEL = 'soz-core:server:vehicle:cancel-order',
    VEHICLE_ORDER_DO = 'soz-core:server:vehicle:order-do',

    VOIP_SET_MUTE = 'soz-core:voip:set-mute',
    VOIP_IS_MUTED = 'soz-core:voip:is-muted',
    VOIP_GET_MEGAPHONE_PLAYERS = 'soz-core:voip:get-megaphone-players',
    VOIP_VOICE_START_TRANSMITTING = 'soz-core:server:voip:voice-start-transmitting',
    VOIP_VOICE_STOP_TRANSMITTING = 'soz-core:server:voip:voice-stop-transmitting',

    INVENTORY_GET_ITEM_BY_SHORTCUT = 'soz-core:inventory:get-item-by-shortcut',

    UPW_GET_FACILITIES = 'soz-core:job:upw:get-facilities',
    UPW_GET_STATION = 'soz-core:server:job:upw:get-station',

    WEAPON_USE_AMMO = 'soz-core:server:weapon:useAmmo',
    WEAPON_SET_LABEL = 'soz-core:server:weapon:setLabel',
    WEAPON_REPAIR = 'soz-core:server:weapon:repair',
    WEAPON_SET_TINT = 'soz-core:server:weapon:setTint',
    WEAPON_SET_ATTACHMENTS = 'soz-core:server:weapon:setAttachments',

    VANDALISM_LOAD = 'soz-core:server:vandalism:load',
    VANDALISM_CHECK = 'soz-core:server:vandalism:check',
    VANDALISM_ALERT_CHECK = 'soz-core:server:vandalism:alert-check',

    HEIST_CHECK = 'soz-core:server:heist:check',
    HEIST_JEWELRY_IS_ZONE_UNLOCK = 'soz-core:server:heist:jewelry-check-unlock',
    HEIST_JEWELRY_CHECK_ROBBERY = 'soz-core:server:heist:jewelry-check-robbery',
    HEIST_JEWELRY_START_ROBBERY = 'soz-core:server:heist:jewelry-start-robbery',

    LSMC_CAN_REMOVE_ITT = 'soz-core:server:lsmc:can-remove-itt',
    LSMC_CAN_SET_ITT = 'soz-core:server:lsmc:can-set-itt',
    LSMC_PLAYER_PLASTER = 'soz-core:server:lsmc:get-plaster',
    LSMC_STRETCHER_AMBULANCE_STATUS = 'soz-core:server:lsmc:ambulance-stretcher-status',

    TALENT_TREE_UNLOCK = 'soz-core:server:talent:unlock',
    TALENT_TREE_RESET = 'soz-core:server:talent:reset',
    TALENT_TREE_ENABLE_CRIMI = 'soz-core:server:talent:enable-crimi',

    HELICO_INIT_LIGHT = 'soz-core:server:helico:init-spotlight',

    POLICE_ALCOOLLEVEL = 'soz-core:server:police:alcool-level',
    POLICE_DRUGLEVEL_AND_TYPE = 'soz-core:server:police:drug-level',
    POLICE_GET_WANTED_PLAYERS = 'soz-core:server:police:get-wanted-players',
    POLICE_DELETE_WANTED_PLAYER = 'soz-core:server:police:delete-wanted-player',
    POLICE_GET_MARKED_MONEY = 'soz-core:server:police:get-marked-money',
    POLICE_GET_CLUES_IN_AREA = 'soz-core:server:police:get-clues-in-area',
    POLICE_GET_ALL_IDENTIFIED_CLUES = 'soz-core:server:police:get-all-identified-clues',
    POLICE_LICENSE_HAS_RECUER = 'soz-core:server:police:has-recuer-license',

    HUB_EXIT_TIME = 'soz-core:server:hub:exit-time',
    HUB_ENTRY_FETCH_ALL = 'soz-core:server:hub:fetch-all',
    HUB_ENTRY_FETCH_ACTIVE = 'soz-core:server:hub:fetch-active',

    BIN_IS_NOT_LOCKED = 'soz-core:server:bin:is-locked',

    LSMC_GET_CURRENT_ORGAN = 'soz-core:server:lsmc:get-organ',

    RACKET_COOP_CHECK_CRIMI = 'soz-core:server:racket:check-crimi',
    RACKET_LOCK_PED = 'soz-core:server:racket:lock-ped',

    DRUGS_GET_GARDEN_INFO = 'soz-core:server:drugs:garden-info',
    DRUGS_GARDEN_ENTER = 'soz-core:server:drugs:garden-enter',
    DRUGS_GARDEN_EXIT = 'soz-core:server:drugs:garden-exit',
    DRUGS_GET_RECIPES = 'soz-core:server:drugs:recipes-get',
    DRUG_DO_TRANSFORM = 'soz-core:server:drugs:recipes-transform',
    DRUGS_PAY_LOCATION = 'soz-core:server:drugs:location-pay',
    DRUGS_FIELD_HEALTH = 'soz-core:server:drugs:field-health',
    DRUGS_CAN_CONTRACT = 'soz-core:server:drugs:can-contract',

    SOZEDEX_CLAIM_REWARD = 'soz-core:server:sozedex:claim-reward',

    RACE_SERVER_START = 'soz-core:server:race:start',
    RACE_SERVER_EXIT = 'soz-core:server:race:exit',
    RACE_GET_RANKING = 'soz-core:server:race:get-ranking',
    RACE_GET_SPLITS = 'soz-core:server:race:get-splits',

    OBJECT_GET_LIST = 'soz-core:server:object:get-list',

    PLAYER_IS_ZOMBIE = 'soz-core:server:player:is-zombie',

    PROP_GET_COLLECTIONS_DATA = 'soz-core:server:prop:get-collection-names',
    PROP_GET_PROP_COLLECTION = 'soz-core:server:prop:get-collection',
    PROP_GET_SERVER_DATA = 'soz-core:server:prop:get-number-props',
    PROP_GET_LOADED_PROPS = 'soz-core:server:prop:get-all-props',
    PROP_REQUEST_CREATE_COLLECTION = 'soz-core:server:prop:create-collection',
    PROP_REQUEST_RENAME_COLLECTION = 'soz-core:server:prop:rename-collection',
    PROP_REQUEST_DELETE_COLLECTION = 'soz-core:server:prop:delete-collection',
    PROP_REQUEST_CREATE_PROP = 'soz-core:server:prop:create-prop',
    PROP_REQUEST_TOGGLE_LOAD_COLLECTION = 'soz-core:server:prop:load-collection',
    PROP_REQUEST_PERSIST_COLLECTION = 'soz-core:server:prop:persist-collection',

    CRAFT_GET_RECIPES = 'soz-core:server:craft:get-recipes',
    CRAFT_DO_RECIPES = 'soz-core:server:craft:do-recipes',

    FDF_TREE_HARVEST = 'soz-core:server:fdf:tree-harvest',
    FDF_TREE_GET = 'soz-core:server:fdf:tree-get',
    FDF_CROP_GET = 'soz-core:server:fdf:crop-get',
    FDF_FIELD_ISPLOW = 'soz-core:server:fdf:field-isplow',
    FDF_GET_CROP_TO_TRACTOR_HARVEST = 'soz-core:server:fdf:get-crops-to-harvest',
    FDF_CROP_WITH_TRACTOR = 'soz-core:server:fdf:crop-with-tractor',
    FDF_PLOW_STATUS = 'soz-core:server:fdf:get-plow-status',

    CURRENT_PLAYERS = 'soz-core:server:utils:getnbplayers',

    FOOD_HUNT_INIT = 'soz-core:server:food:hunt-init',

    METEOR_OCEAN = 'soz-core:meteor:ocean',

    BANK_GET_ACCOUNT = 'soz-core:server:bank:safe:get-account',
    BANK_GET_ACCOUNT_MONEY = 'soz-core:server:bank:get-account-money',
    BANK_GET_ACCOUNT_UI = 'soz-core:server:bank:get-account-ui',
    BANK_TRANSFER_ACTION = 'soz-core:server:bank:transfer-action',
    BANK_CASH_TRANSFER_ACTION = 'soz-core:server:bank:safe:transfer-action',
    BANK_CREATE_OFFSHORE_ACCOUNT = 'soz-core:server:bank:create-offshore-account',
    BANK_CONTACT_ADD = 'soz-core:server:bank:contact:add',
    BANK_CONTACT_REMOVE = 'soz-core:server:bank:contact:remove',

    BANK_ATM_REMOVE_LIQUIDITY = 'soz-core:server:bank:atm:remove-liquidity',
    BANK_ATM_GET_ACCOUNT_UI = 'soz-core:server:bank:atm:get-account-ui',
    BANK_ATM_GET_ACCOUNT = 'soz-core:server:bank:atm:get-account',
    BANK_ATM_GET_MONEY = 'soz-core:server:bank:atm:get-money',

    BANK_GET_INVOICES = 'soz-core:server:bank:get-invoices',
    BANK_CREATE_INVOICE = 'soz-core:server:bank:create-invoice',

    GANG_VEHBIZ_LIST = 'soz-core:server:gang:vehbiz:list',
    GANG_VEHBIZ_REFRESH_LIST = 'soz-core:server:gang:vehbiz:refresh-list',
    GANG_VEHBIZ_COMMAND = 'soz-core:server:gang:veh:command',
    GANG_VEHBIZ_UNIQUE_GET = 'soz-core:server:gang:veh:unique-get',
    GANG_VEHBIZ_UNIQUE_ADD = 'soz-core:server:gang:veh:unique-add',
    GANG_VEHBIZ_UNIQUE_DELETE = 'soz-core:server:gang:veh:unique-delete',
    GANG_VEHBIZ_UNIQUE_PRICE = 'soz-core:server:gang:veh:unique-price',
    GANG_INFLUENCE_ZONE_GET = 'soz-core:server:gang:inflence:get',
    GANG_MEMBER_FETCH = 'soz-core:server:gang:member:get',
    GANG_MEMBER_ADD = 'soz-core:server:gang:member:add',
    GANG_MEMBER_UPDATE = 'soz-core:server:gang:member:update',
}

export enum RpcClientEvent {
    VEHICLE_GET_TYPE = 'soz-core:rpc:client:vehicle:get-type',
    VEHICLE_GET_NAME = 'soz-core:rpc:client:vehicle:get-name',
    VEHICLE_SPAWN = 'soz-core:rpc:client:vehicle:spawn',
    GET_LAST_VEHICLE_SPAWN = 'soz-core:rpc:client:vehicle:get-last-spawn',
    DELETE_LAST_VEHICLE_SPAWN = 'soz-core:rpc:client:vehicle:delete-last-spawn',
    VEHICLE_SPAWN_FROM_SERVER = 'soz-core:rpc:client:vehicle:spawn-from-server',
    VEHICLE_DELETE = 'soz-core:rpc:client:vehicle:delete',
    MONITOR_GET_TRACES = 'soz-core:rpc:client:monitor:get-traces',
    DRUG_CHECK_ZONE = 'soz-core:rpc:client:drug:check-zone',
    FDF_CHECK_ZONE = 'soz-core:rpc:client:fdf:check-zone',
    CHECK_WEARING_GLOVES = 'soz-core:rpc:client:check-wearing-gloves',
    OBJECT_GET_GROUND_POSITION = 'soz-core:rpc:client:object:get-ground-position',
}
