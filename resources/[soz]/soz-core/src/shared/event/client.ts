export enum ClientEvent {
    ADMIN_OPEN_MENU = 'soz-core:client:admin:openMenu',
    ADMIN_MAPPER_OPEN_MENU = 'soz-core:client:admin:mapper:openMenu',
    ADMIN_SHOW_GPS = 'soz-core:client:admin:show-gps',
    ADMIN_SPECTATE_PLAYER = 'soz-core:client:admin:spectate-player',
    ADMIN_KILL_PLAYER = 'soz-core:client:admin:kill-player',
    ANIMATION_SURRENDER = 'soz-core:client:animation:surrender',
    ANIMATION_GIVE = 'soz-core:client:animation:give',

    BASE_ENTERED_VEHICLE = 'baseevents:enteredVehicle',
    BASE_LEFT_VEHICLE = 'baseevents:leftVehicle',
    BASE_CHANGE_VEHICLE_SEAT = 'baseevents:changedVehicleSeat',

    BENNYS_OPEN_CLOAKROOM = 'soz-core:client:job:bennys:open-cloakroom',
    BENNYS_FLATBED_DETACH_VEHICLE = 'soz-core:client:job:bennys:flatbed:detach-vehicle',

    CHARACTER_REQUEST_CHARACTER_WIZARD = 'soz-character:client:RequestCharacterWizard',

    CORE_CLOSE_MENU = 'soz-core:client:menu:close',

    AUDIO_PLAY = 'soz-core:client:audio:play',
    AUDIO_STOP = 'soz-core:client:audio:stop',
    CRIMI_USE_CLOAKROOM = 'soz-core:client:crimi:use-cloakroom',
    CRIMI_USE_FAKE_CARD = 'soz-core:client:crimi:use-fake-card',
    CRIMI_USE_JAMMER = 'soz-core:client:crimi:use-jammer',
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
    FOOD_HUNT_SYNC = 'soz-core:client:food:hunt-sync',

    HOUSING_OPEN_UPGRADES_MENU = 'soz-core:client:housing:open-upgrades-menu',
    HOUSING_REQUEST_ENTER = 'soz-core:client:housing:request-enter',
    HOUSING_ADD_TEMPORARY_ACCESS = 'soz-core:client:housing:add-temporary-access',
    HOUSING_TELEPORT = 'soz-core:client:housing:teleport',

    HALLOWEEN_HAT_TOOGLE = 'soz-core:client:halloween:hat-toggle',
    HALLOWEEN_DEGUISEMENT_USE = 'soz-core:client:halloween:use-deguisement',
    HALLOWEEN_DEMON_ANALISYS = 'soz-core:client:halloween:use-demon-analysis',

    ITEM_USE = 'soz-core:client:item:use',
    ITEM_ALBUM_USE = 'soz-core:client:item:album:toggle',
    ITEM_PROTEST_SIGN_TOGGLE = 'soz-core:client:item:protest-sign:toggle',
    ITEM_UMBRELLA_TOGGLE = 'soz-core:client:item:umbrella:toggle',
    ITEM_WALK_STICK_TOGGLE = 'soz-core:client:item:walk-stick:toggle',
    ITEM_BOOK_USE = 'soz-core:client:item:book:use',
    ITEM_CAMERA_TOGGLE = 'soz-core:client:item:camera:toggle',
    ITEM_MICROPHONE_TOGGLE = 'soz-core:client:item:microphone:toggle',
    ITEM_SCUBA_TOOGLE = 'soz-core:client:item:scuba:toggle',

    HELICO_UPDATE_LIGHT = 'soz-core:client:police:update-light',

    JOBS_FFS_OPEN_SOCIETY_MENU = 'soz-jobs:client:ffs:OpenSocietyMenu',
    JOBS_BAUN_OPEN_SOCIETY_MENU = 'soz-jobs:client:baun:OpenSocietyMenu',
    JOBS_FOOD_OPEN_SOCIETY_MENU = 'jobs:client:food:OpenSocietyMenu',
    JOBS_STONK_OPEN_SOCIETY_MENU = 'stonk:client:OpenSocietyMenu',
    JOBS_MDR_OPEN_SOCIETY_MENU = 'soz-jobs:client:mdr:OpenSocietyMenu',
    JOBS_TAXI_OPEN_SOCIETY_MENU = 'soz-jobs:client:taxi:OpenSocietyMenu',
    JOBS_LSMC_OPEN_SOCIETY_MENU = 'soz-jobs:client:lsmc:OpenSocietyMenu',
    JOBS_GARBAGE_OPEN_SOCIETY_MENU = 'jobs:client:garbage:OpenSocietyMenu',
    JOBS_FDF_OPEN_SOCIETY_MENU = 'soz-jobs:client:fdf:OpenSocietyMenu',
    JOBS_GOUV_OPEN_SOCIETY_MENU = 'soz-jobs:client:gouv:OpenSocietyMenu',
    JOBS_TWITCH_NEWS_OPEN_SOCIETY_MENU = 'soz-jobs:client:twitch-news:OpenSocietyMenu',
    JOBS_YOU_NEWS_OPEN_SOCIETY_MENU = 'soz-jobs:client:you-news:OpenSocietyMenu',
    JOBS_DMC_OPEN_SOCIETY_MENU = 'soz-jobs:client:dmc:OpenSocietyMenu',
    JOBS_POLICE_OPEN_SOCIETY_MENU = 'soz-jobs:client:police:OpenSocietyMenu',

    JOBS_CHECK_CLOAKROOM_STORAGE = 'soz-jobs:client:check-cloakroom-storage',
    JOB_OPEN_MENU = 'soz-core:client:job:open-menu',
    JOB_DUTY_CHANGE = 'QBCore:Client:SetDuty',
    JOB_OPEN_CLOAKROOM = 'soz-core:client:job::OpenCloakroomMenu',
    JOB_OPEN_ON_DUTY_MENU = 'soz-job:client:OpenOnDutyMenu',

    LSMC_DISEASE_APPLY_CURRENT_EFFECT = 'lsmc:maladie:client:ApplyCurrentDiseaseEffect',
    LSMC_REVIVE = 'soz-core:lsmc:client:revive',
    LSMC_CALL = 'soz-core:lsmc:client:call',
    LSMC_APPLY_PATIENT_CLOTHING = 'soz-core:client:lsmc:applyPatientClothing',
    LSMC_REMOVE_PATIENT_CLOTHING = 'soz-core:client:lsmc:removePatientClothing',
    LSMC_APPLY_OUTFIT = 'soz-core:client:lsmc:ApplyDutyClothing',
    LSMC_TELEPORTATION = 'soz-core:lsmc:client:teleportation',
    LSMC_HEAL = 'soz-core:lsmc:client:heal',
    LSMC_NEW_URGENCY = 'soz-core:lsmc:client:new-urgency',
    LSMC_END_URGENCY = 'soz-core:lsmc:client:end-urgency',

    LSC_ENTER_SHOP = 'soz-core:client:job:lsc:enter-shop',
    LSC_EXIT_SHOP = 'soz-core:client:job:lsc:exit-shop',

    MISSIVE_SHOW_ITEM = 'soz-core:client:missive:show-item',
    MONITOR_START_TRACING = 'soz-core:client:monitor:start-tracing',

    NEWS_DRAW = 'soz-core:client:news:draw',
    NEWS_NEWSPAPER_SELL = 'soz-core:client:news:newspaper-sell',
    NEWS_NEWSPAPER_SOLD = 'soz-core:client:news:newspaper-sold',

    NOTIFICATION_DRAW = 'soz-core:client:notification:draw',
    NOTIFICATION_DRAW_ADVANCED = 'soz-core:client:notification:draw-advanced',
    NUI_SHOW_PANEL = 'soz-core:client:nui:show-panel',

    NUI_HIDE_PANEL = 'soz-core:client:nui:hide-panel',

    OBJECT_CREATE = 'soz-core:client:object:create',
    OBJECT_DELETE = 'soz-core:client:object:delete',
    OBJECT_EDIT = 'soz-core:client:object:edit',

    PROP_OPEN_MENU = 'soz-core:client:prop:open-menu',

    OIL_REFILL_ESSENCE_STATION = 'soz-core:client:oil:refill-essence-station',
    OIL_REFILL_KEROSENE_STATION = 'soz-core:client:oil:refill-kerosene-station',
    OIL_UPDATE_STATION_PRICE = 'soz-core:client:oil:update-station-price',

    PHONE_APP_WEATHER_UPDATE_FORECASTS = 'phone:app:weather:updateForecasts',
    PHONE_APP_WEATHER_UPDATE_STORM_ALERT = 'phone:app:weather:updateStormAlert',

    STONK_DELIVER_LOCATION = 'stonk:client:DeliverLocation',
    STONK_APPLY_OUTFIT = 'soz-core:client:stonk:ApplyDutyClothing',

    SHOP_OPEN_MENU = 'soz-core:client:shops:open-menu',
    SHOP_UPDATE_STOCKS = 'soz-core:client:shops:update-stocks',

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
    PLAYER_SET_JOB_OUTFIT = 'soz-core:client:player:set-job-outfit',
    PLAYER_SET_UNLIMITED_SPRINT = 'soz-core:client:player:set-unlimited-sprint',
    PLAYER_SHOW_IDENTITY = 'soz-core:client:player:show-identity',
    PLAYER_UPDATE_CROSSHAIR = 'soz-core:client:player:update-crosshair',
    PLAYER_UPDATE_STATE = 'soz-core:client:player:update-state',
    PLAYER_UPDATE_LIST_STATE = 'soz-core:client:player:update-list-state',
    PLAYER_ON_DEATH = 'ems:client:onDeath',
    PLAYER_ZOMBIE_TRANSFORM = 'soz-core:client:player:zombie:transform',
    PLAYER_ZOMBIE_REMOVE = 'soz-core:client:player:zombie:remove',
    PLAYER_CARD_SHOW = 'soz-core:client:player:card:show',
    PLAYER_CARD_SEE = 'soz-core:client:player:card:see',

    PROGRESS_START = 'soz-core:client:progress:start',
    PROGRESS_STOP = 'soz-core:client:progress:stop',

    REPOSITORY_SYNC_DATA = 'soz-core:client:repository:sync-data',
    REPOSITORY_SET_DATA = 'soz-core:client:repository:set-data',
    REPOSITORY_PATCH_DATA = 'soz-core:client:repository:patch-data',
    REPOSITORY_DELETE_DATA = 'soz-core:client:repository:delete-data',

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
    VEHICLE_DAMAGE_BLUR = 'soz-core:client:vehicle:damage-blur',

    VOIP_UPDATE_MODE = 'soz-core:client:voip:update-mode',
    VOIP_SET_MEGAPHONE = 'soz-core:client:voip:set-megaphone',
    VOIP_ITEM_RADIO_TOGGLE = 'soz-core:client:voip:item-radio:toggle',
    VOIP_ITEM_MEGAPHONE_TOGGLE = 'soz-core:client:voip:item-megaphone:toggle',
    VOIP_ITEM_MICROPHONE_TOGGLE = 'soz-core:client:voip:item-microphone:toggle',
    VOIP_RADIO_VEHICLE_ENABLE = 'soz-core:client:voip:radio-vehicle-enable',
    VOIP_RADIO_VEHICLE_UPDATE = 'soz-core:client:voip:radio-vehicle-update',

    UPW_OPEN_CLOAKROOM = 'soz-core:client:job:upw:open-cloakroom',
    UPW_CREATE_CHARGER = 'soz-core:client:job:upw:create-charger',

    PAWL_FAST_HARVEST_TREE = 'soz-core:client:job:pawl:fast-harvest-tree',

    RADAR_TOGGLE_BLIP = 'soz-core:client:radar:toggle-blip',

    ZEVENT_TOGGLE_TSHIRT = 'soz-core:client:zevent:toggle-tshirt',

    WEAPON_USE_WEAPON = 'soz-core:client:weapon:use-weapon',
    WEAPON_USE_WEAPON_NAME = 'soz-core:client:weapon:use-weapon-name',
    WEAPON_USE_AMMO = 'soz-core:client:weapon:use-ammo',
    WEAPON_OPEN_GUNSMITH = 'soz-core:client:weapon:open-gunsmith',
    WEAPON_EXPLOSION = 'soz-core:client:weapon:explosion',
    WEAPON_CLEAR_WEAPON = 'soz-core:client:weapon:clear',

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
    POLICE_HANDCUFF_ANIMATION = 'soz-core:client:police:handcuff-animation',
    POLICE_UNCUFF_ANIMATION = 'soz-core:client:police:uncuff-animation',
    POLICE_GET_UNCUFFED = 'soz-core:client:police:get-uncuffed',
    POLICE_GET_CUFFED = 'soz-core:client:police:get-cuffed',
    POLICE_RED_CALL = 'soz-core:client:police:red-call',
    POLICE_REQUEST_ADD_SPIKE = 'soz-core:client:police:request-add-spike',
    POLICE_SYNC_SPIKE = 'soz-core:client:police:sync-spikes',
    POLICE_OPEN_STASH_CLOAKROOM = 'police:cloakroom:openStash',

    SET_ESCORTING = 'soz-core:client:police:set-escorting',
    GET_ESCORTED = 'soz-core:client:police:get-escorted',
    REMOVE_ESCORTED = 'soz-core:client:police:remove-escorted',

    HELICO_ADD_LIGHT = 'soz-core:client:police:add-light',
    HELICO_REMOVE_LIGHT = 'soz-core:client:police:del-light',

    TALENT_TREE_DISABLE_CRIMI = 'soz-core:client:talent:disable-crimi',
    TALENT_NEW_CRIMI = 'soz-core:client:talent:new-crimi',

    PLAYER_TELEPORT = 'soz-core:client:player:teleport',

    HUB_ENTER = 'soz-core:client:hub:enter',
    HUB_REMOVE_STATUS = 'soz-core:client:hub:remove-status',
    HUB_ENTRY_REFRESH = 'soz-core:client:hub:entry-refresh',

    CRIMI_HOOD = 'soz-core:client:crimi:hood',
    CRIMI_SMOKE = 'soz-core:client:crimi:smoke',

    FISHING_ROD_TOGGLE = 'soz-core:server:fishing:toggle-rod',
    FISHING_BAIT_TOGGLE = 'soz-core:server:fishing:toggle-bait',

    EASTER_EAR_TOGGLE = 'soz-core:client:easter:toogle-ear',

    BINOCULARS_TOGGLE = 'items:binoculars:toggle',
    BINOCULARS_SET = 'items:binoculars:set',

    RACKET_START_PHASE = 'soz-core:client:racket:start-phase',

    // Not core
    LOCATION_ENTER = 'locations:zone:enter',
    LOCATION_EXIT = 'locations:zone:exit',

    // Sozedex
    NUI_SHOW_SOZEDEX = 'soz-core:client:nui:show-sozedex',
    NUI_HIDE_SOZEDEX = 'soz-core:client:nui:hide-sozedex',

    DRUGS_SHOW_CONTRACT = 'soz-core:client:drug:show-contract',
    DRUGS_HARVEST_CHAMPI = 'soz-core:client:drugs:harvest-champi',
    DRUGS_HARVEST_ZEED = 'soz-core:client:drugs:harvest-zeed',
    DRUGS_HARVEST_URANIUM = 'soz-core:client:drugs:harvest-uranium',
    DRUGS_DELETE = 'soz-core:client:drugs:delete',
    DRUGS_ADD = 'soz-core:client:drugs:add',
    DRUGS_UPDATE_SEED = 'soz-core:client:drugs:update-seed',
    DRUGS_CONSUME = 'soz-core:client:drugs:consume',
    DRUGS_ZONE_ADD_UPDATE = 'soz-core:client:drugs:zone-add',
    DRUGS_ZONE_DELETE = 'soz-core:client:drugs:zone-delete',

    RACE_ADD_UPDATE = 'soz-core:client:race:add-update',
    RACE_DELETE = 'soz-core:client:race:delete',

    BILLBOARD_UPDATE = 'soz-core:client:billboard:update',
    BILLBOARD_DELETE = 'soz-core:client:billboard:delete',

    VANDALISM_ABORT = 'soz-core:client:vandalism:abort',
    VANDALISM_STEP = 'soz-core:client:vandalism:step',
    VANDALISM_UPDATE_PROP = 'soz-core:client:vandalism:update-prop',

    ANIMATION_FX = 'soz-core:client:animation:fx',
}
