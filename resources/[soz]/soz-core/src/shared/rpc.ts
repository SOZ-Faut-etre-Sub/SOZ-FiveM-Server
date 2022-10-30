export enum RpcEvent {
    ADMIN_GET_PLAYERS = 'soz-core:admin:get-players',
    ADMIN_GET_FULL_PLAYERS = 'soz-core:admin:get-full-players',
    ADMIN_GET_VEHICLES = 'soz-core:admin:get-vehicles',
    ADMIN_IS_ALLOWED = 'soz-core:admin:is-allowed',

    BENNYS_GET_ORDERS = 'soz-core:server:job:bennys:get-orders',
    BENNYS_CANCEL_ORDER = 'soz-core:server:job:bennys:cancel-order',
    BENNYS_ORDER_VEHICLE = 'soz-core:server:job:bennys:order-vehicle',

    INVENTORY_SEARCH = 'soz-core:inventory:search',

    JOB_GET_JOBS = 'soz-core:jobs:get-jobs',

    PLAYER_GET_HEALTH_BOOK = 'soz-core:player:get-health-book',
    PLAYER_GET_SERVER_STATE = 'soz-core:player:get-server-state',

    SHOP_MASK_GET_CATEGORIES = 'soz-core:shop:mask:get-categories',
    SHOP_MASK_GET_ITEMS = 'soz-core:shop:mask:get-items',

    STORY_HALLOWEEN_SCENARIO1 = 'soz-story:server:halloween1',
    STORY_HALLOWEEN_SCENARIO2 = 'soz-story:server:halloween2',
    STORY_HALLOWEEN_SCENARIO3 = 'soz-story:server:halloween3',
    STORY_HALLOWEEN_SCENARIO4 = 'soz-story:server:halloween4',

    REPOSITORY_GET_DATA = 'soz-core:repository:get-data',

    VEHICLE_CUSTOM_GET_MODS = 'soz-core:vehicle:custom:get-mods',
    VEHICLE_CUSTOM_SET_MODS = 'soz-core:vehicle:custom:set-mods',
    VEHICLE_DEALERSHIP_GET_LIST = 'soz-core:vehicle:dealership:get-list',
    VEHICLE_DEALERSHIP_BUY = 'soz-core:vehicle:dealership:buy',
    VEHICLE_GARAGE_GET_VEHICLES = 'soz-core:vehicle:garage:get-vehicles',
    VEHICLE_GARAGE_GET_FREE_PLACES = 'soz-core:vehicle:garage:get-free-places',
    VEHICLE_HAS_KEY = 'soz-core:vehicle:has-key',

    VOIP_IS_MUTED = 'soz-core:voip:is-muted',
}
