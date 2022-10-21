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

    VOIP_IS_MUTED = 'soz-core:voip:is-muted',

    STORY_HALLOWEEN_SCENARIO1 = 'soz-story:server:halloween',
}
