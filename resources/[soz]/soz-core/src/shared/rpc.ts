export enum RpcServerEvent {
    ADMIN_GET_PLAYERS = 'soz-core:admin:get-players',
    ADMIN_GET_CHARACTERS = 'soz-core:admin:get-characters',
    ADMIN_GET_FULL_PLAYERS = 'soz-core:admin:get-full-players',
    ADMIN_GET_VEHICLES = 'soz-core:admin:get-vehicles',
    ADMIN_IS_ALLOWED = 'soz-core:admin:is-allowed',
    ADMIN_GET_REPUTATION = 'soz-core:admin:get-reputation',

    BENNYS_GET_ORDERS = 'soz-core:server:job:bennys:get-orders',
    BENNYS_CANCEL_ORDER = 'soz-core:server:job:bennys:cancel-order',
    BENNYS_ORDER_VEHICLE = 'soz-core:server:job:bennys:order-vehicle',

    CRIMI_CAN_USE_CLOAKROOM = 'soz-core:server:crimi:can-use-cloakroom',

    DRIVING_SCHOOL_SPAWN_VEHICLE = 'soz-core:server:driving-school:spawn-vehicle',
    DRIVING_SCHOOL_CHECK_REMAINING_SLOTS = 'soz-core:server:driving-school:check-vehicle-slots',

    INVENTORY_SEARCH = 'soz-core:inventory:search',

    JOB_GET_JOBS = 'soz-core:jobs:get-jobs',
    JOBS_USE_WORK_CLOTHES = 'soz-core:server:job:use-work-clothes',

    OIL_GET_STATION = 'soz-core:job:oil:get-station',
    OIL_GET_STATION_PRICES = 'soz-core:job:oil:get-station-prices',

    PLAYER_GET_HEALTH_BOOK = 'soz-core:player:get-health-book',
    PLAYER_GET_SERVER_STATE = 'soz-core:player:get-server-state',
    PLAYER_GET_JWT_TOKEN = 'soz-core:player:get-jwt-token',

    CRAFTING_GET_RECIPES = 'soz-core:crafting:get-recipes',
    CRAFTING_DO_CRAFT = 'soz-core:crafting:do-craft',
    CRAFTING_DO_SALVAGE = 'soz-core:crafting:do-salvage',

    SHOP_MASK_GET_CATEGORIES = 'soz-core:shop:mask:get-categories',
    SHOP_MASK_GET_ITEMS = 'soz-core:shop:mask:get-items',

    STORY_HALLOWEEN_SCENARIO1 = 'soz-story:server:halloween1',
    STORY_HALLOWEEN_SCENARIO2 = 'soz-story:server:halloween2',
    STORY_HALLOWEEN_SCENARIO3 = 'soz-story:server:halloween3',
    STORY_HALLOWEEN_SCENARIO4 = 'soz-story:server:halloween4',

    REPOSITORY_GET_DATA = 'soz-core:repository:get-data',

    VEHICLE_CUSTOM_GET_MODS = 'soz-core:vehicle:custom:get-mods',
    VEHICLE_CUSTOM_SET_MODS = 'soz-core:vehicle:custom:set-mods',
    VEHICLE_DEALERSHIP_AUCTION_BID = 'soz-core:vehicle:dealership:auction:bid',
    VEHICLE_DEALERSHIP_GET_AUCTIONS = 'soz-core:vehicle:dealership:get-auctions',
    VEHICLE_DEALERSHIP_GET_LIST = 'soz-core:vehicle:dealership:get-list',
    VEHICLE_DEALERSHIP_GET_LIST_JOB = 'soz-core:vehicle:dealership:get-list-job',
    VEHICLE_DEALERSHIP_BUY = 'soz-core:vehicle:dealership:buy',
    VEHICLE_GARAGE_GET_VEHICLES = 'soz-core:vehicle:garage:get-vehicles',
    VEHICLE_GARAGE_GET_FREE_PLACES = 'soz-core:vehicle:garage:get-free-places',
    VEHICLE_GARAGE_GET_MAX_PLACES = 'soz-core:vehicle:garage:get-max-places',
    VEHICLE_HAS_KEY = 'soz-core:vehicle:has-key',

    VOIP_IS_MUTED = 'soz-core:voip:is-muted',

    INVENTORY_GET_ITEM_BY_SHORTCUT = 'soz-core:inventory:get-item-by-shortcut',

    WEAPON_USE_AMMO = 'soz-core:server:weapon:useAmmo',
    WEAPON_SET_LABEL = 'soz-core:server:weapon:setLabel',
    WEAPON_REPAIR = 'soz-core:server:weapon:repair',
    WEAPON_SET_TINT = 'soz-core:server:weapon:setTint',
    WEAPON_SET_ATTACHMENTS = 'soz-core:server:weapon:setAttachments',

    RACKET_LAST_RACKET_TIME = 'soz-core:server:racket:last-time',

    VANDALISM_END = 'soz-core:server:vandalism:end',
    VANDALISM_LOAD = 'soz-core:server:vandalism:load',
    VANDALISM_LOCK = 'soz-core:server:vandalism:lock',

    HEIST_CHECK = 'soz-core:server:heist:check',
    HEIST_JEWELRY_IS_ZONE_UNLOCK = 'soz-core:server:heist:jewelry-check-unlock',
    HEIST_JEWELRY_CHECK_ROBBERY = 'soz-core:server:heist:jewelry-check-robbery',
    HEIST_JEWELRY_START_ROBBERY = 'soz-core:server:heist:jewelry-start-robbery',

    LSMC_CAN_REMOVE_ITT = 'soz-core:server:lsmc:can-remove-itt',
    LSMC_CAN_SET_ITT = 'soz-core:server:lsmc:can-set-itt',

    TALENT_TREE_UNLOCK = 'soz-core:server:talent:unlock',
    TALENT_TREE_RESET = 'soz-core:server:talent:reset',
    TALENT_TREE_CAN_CRIMI_BE_ENABLED = 'soz-core:server:talent:can-crimi-be-enabled',

    HELICO_INIT_LIGHT = 'soz-core:server:helico:init-spotlight',

    POLICE_ALCOOLLEVEL = 'soz-core:server:police:alcool-level',
    HUB_EXIT_TIME = 'soz-core:server:hub:exit-time',

    BIN_IS_NOT_LOCKED = 'soz-core:server:bin:is-locked',
}

export enum RpcClientEvent {
    VEHICLE_GET_TYPE = 'soz-core:rpc:client:vehicle:get-type',
    VEHICLE_SPAWN = 'soz-core:rpc:client:vehicle:spawn',
    GET_LAST_VEHICLE_SPAWN = 'soz-core:rpc:client:vehicle:get-last-spawn',
    DELETE_LAST_VEHICLE_SPAWN = 'soz-core:rpc:client:vehicle:delete-last-spawn',
    VEHICLE_SPAWN_FROM_SERVER = 'soz-core:rpc:client:vehicle:spawn-from-server',
    VEHICLE_DELETE = 'soz-core:rpc:client:vehicle:delete',
}
