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

    ADMIN_MAPPER_ADD_ZONE = 'soz-core:admin:mapper:add-zone',
    ADMIN_MAPPER_REMOVE_ZONE = 'soz-core:admin:mapper:remove-zone',

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

    JOBS_USE_WORK_CLOTHES = 'soz-core:server:job:use-work-clothes',

    OIL_GET_STATION = 'soz-core:job:oil:get-station',
    OIL_GET_STATION_PRICES = 'soz-core:job:oil:get-station-prices',

    PLAYER_GET_CLIENT_STATE = 'soz-core:player:get-client-state',
    PLAYER_GET_LIST_STATE = 'soz-core:player:get-list-state',
    PLAYER_GET_SERVER_STATE = 'soz-core:player:get-server-state',
    PLAYER_GET_JWT_TOKEN = 'soz-core:player:get-jwt-token',
    PLAYER_GET_LICENCES = 'soz-core:player:get-licences',
    PLAYER_TELEPORT = 'soz-core:player:teleport',
    PLAYER_GET_JOB = 'soz-core:player:get-job',

    BANK_GET_ACCOUNT = 'soz-core:bank:get-account',

    CRAFTING_GET_RECIPES = 'soz-core:crafting:get-recipes',
    CRAFTING_DO_CRAFT = 'soz-core:crafting:do-craft',
    CRAFTING_DO_SALVAGE = 'soz-core:crafting:do-salvage',

    STORY_HALLOWEEN_SCENARIO1 = 'soz-story:server:halloween1',
    STORY_HALLOWEEN_SCENARIO2 = 'soz-story:server:halloween2',
    STORY_HALLOWEEN_SCENARIO3 = 'soz-story:server:halloween3',
    STORY_HALLOWEEN_SCENARIO4 = 'soz-story:server:halloween4',

    REPOSITORY_GET_DATA = 'soz-core:repository:get-data',
    REPOSITORY_GET_DATA_2 = 'soz-core:repository:get-data-2',
    REPOSITORY_CLOTHING_GET_SHOP = 'soz-core:repository:clothing:get-shop',

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
    VEHICLE_GET_CONDITION = 'soz-core:rpc:vehicle:get-condition',
    VEHICLE_GET_MUTED_SIRENS = 'soz-core:rpc:vehicle:get-muted-sirens',
    VEHICLE_GET_OPENED = 'soz-core:rpc:vehicle:get-opened',
    VEHICLE_FDO_GET_POSTIONS = 'soz-core:rpc:vehicle:fdo-get-positions',
    VEHICLE_PITSTOP_DATA = 'soz-core:rpc:vehicle:pitstop:data',
    VEHICLE_PITSTOP_PRICES = 'soz-core:rpc:vehicle:pitstop:price',
    VEHICLE_PITSTOP_PRICES_UPDATE = 'soz-core:rpc:vehicle:pitstop:price-update',
    VEHICLE_SPAWN_TEMPORARY = 'soz-core:rpc:vehicle:spawn-temporary',

    VOIP_IS_MUTED = 'soz-core:voip:is-muted',
    VOIP_GET_MEGAPHONE_PLAYERS = 'soz-core:voip:get-megaphone-players',

    INVENTORY_GET_ITEM_BY_SHORTCUT = 'soz-core:inventory:get-item-by-shortcut',

    UPW_GET_FACILITIES = 'soz-core:job:upw:get-facilities',
    UPW_GET_ORDERS = 'soz-core:job:upw:get-orders',
    UPW_CANCEL_ORDER = 'soz-core:server:job:upw:cancel-order',
    UPW_ORDER_VEHICLE = 'soz-core:server:job:upw:order-vehicle',
    UPW_GET_CATALOG = 'soz-core:server:job:upw:get-catalog',
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

    TALENT_TREE_UNLOCK = 'soz-core:server:talent:unlock',
    TALENT_TREE_RESET = 'soz-core:server:talent:reset',
    TALENT_TREE_ENABLE_CRIMI = 'soz-core:server:talent:enable-crimi',

    HELICO_INIT_LIGHT = 'soz-core:server:helico:init-spotlight',

    POLICE_ALCOOLLEVEL = 'soz-core:server:police:alcool-level',
    POLICE_DRUGLEVEL = 'soz-core:server:police:drug-level',
    POLICE_GET_WANTED_PLAYERS = 'soz-core:server:police:get-wanted-players',
    POLICE_DELETE_WANTED_PLAYER = 'soz-core:server:police:delete-wanted-player',
    POLICE_GET_VEHICLE_OWNER = 'soz-core:server:police:get-vehicule-owner',
    POLICE_GET_MARKED_MONEY = 'soz-core:server:police:get-marked-money',
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
}

export enum RpcClientEvent {
    VEHICLE_GET_TYPE = 'soz-core:rpc:client:vehicle:get-type',
    VEHICLE_SPAWN = 'soz-core:rpc:client:vehicle:spawn',
    GET_LAST_VEHICLE_SPAWN = 'soz-core:rpc:client:vehicle:get-last-spawn',
    DELETE_LAST_VEHICLE_SPAWN = 'soz-core:rpc:client:vehicle:delete-last-spawn',
    VEHICLE_SPAWN_FROM_SERVER = 'soz-core:rpc:client:vehicle:spawn-from-server',
    VEHICLE_DELETE = 'soz-core:rpc:client:vehicle:delete',
    MONITOR_GET_TRACES = 'soz-core:rpc:client:monitor:get-traces',
    DRUG_CHECK_ZONE = 'soz-core:rpc:client:drug:check-zone',
    FDF_CHECK_ZONE = 'soz-core:rpc:client:fdf:check-zone',
}
