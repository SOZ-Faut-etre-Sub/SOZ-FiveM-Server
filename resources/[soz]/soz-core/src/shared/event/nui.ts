export enum NuiEvent {
    AdminAutoPilot = 'soz-core:client:admin:autopilot',
    AdminChangePlayer = 'soz-core:client:admin:change-player',
    AdminTriggerNotification = 'soz-core:client:admin:trigger-notification',
    AdminCopyCoords = 'soz-core:client:admin:copy-coords',
    AdminCreateZone = 'soz-core:client:admin:create-zone',
    AdminGetJobGrades = 'soz-core:client:admin:get-job-grades',
    AdminGetPlayers = 'soz-core:client:admin:get-players',
    AdminGetVehicles = 'soz-core:client:admin:get-vehicles',
    AdminGiveLicence = 'soz-core:client:admin:give-licence',
    AdminGiveMoney = 'soz-core:client:admin:give-money',
    AdminGiveMarkedMoney = 'soz-core:client:admin:give-marked-money',
    AdminMenuMapperShowPropertyZone = 'soz-core:nui:admin:mapper:show-property-zone',
    AdminMenuMapperShowApartmentZone = 'soz-core:nui:admin:mapper:show-apartment-zone',
    AdminMenuMapperTeleportToZone = 'soz-core:nui:admin:mapper:teleport-to-zone',
    AdminMenuMapperUpdatePropertyZone = 'soz-core:nui:admin:mapper:update-property-zone',
    AdminMenuMapperUpdateApartmentZone = 'soz-core:nui:admin:mapper:update-apartment-zone',
    AdminMenuMapperTeleportToInsideCoords = 'soz-core:nui:admin:mapper:teleport-to-inside-coords',
    AdminMenuMapperSetInsideCoords = 'soz-core:nui:admin:mapper:set-inside-coords',
    AdminMenuMapperAddApartment = 'soz-core:nui:admin:mapper:add-apartment',
    AdminMenuMapperAddProperty = 'soz-core:nui:admin:mapper:add-property',
    AdminMenuMapperSetApartmentName = 'soz-core:nui:admin:mapper:set-apartment-name',
    AdminMenuMapperSetApartmentPrice = 'soz-core:nui:admin:mapper:set-apartment-price',
    AdminMenuMapperSetApartmentIdentifier = 'soz-core:nui:admin:mapper:set-apartment-identifier',
    AdminMenuMapperDeleteApartment = 'soz-core:nui:admin:mapper:delete-apartment',
    AdminMenuMapperDeleteProperty = 'soz-core:nui:admin:mapper:delete-property',
    AdminMenuMapperShowAllProperty = 'soz-core:nui:admin:mapper:show-all-property',
    AdminMenuMapperAddObject = 'soz-core:nui:admin:mapper:add-object',
    AdminMenuMapperSetShowInterior = 'soz-core:nui:admin:mapper:set-show-interior',
    AdminMenuMapperAddZone = 'soz-core:nui:admin:mapper:add-zone',
    AdminMenuMapperDeleteZone = 'soz-core:nui:admin:mapper:delete-zone',
    AdminMenuMapperShowZone = 'soz-core:nui:admin:mapper:show-zone',
    AdminMenuMapperAddPropertyCulling = 'soz-core:nui:admin:mapper:add-property-culling',
    AdminMenuMapperRemovePropertyCulling = 'soz-core:nui:admin:mapper:remove-property-culling',
    AdminMenuMapperSetSenateParty = 'soz-core:nui:admin:mapper:set-senate-party',
    AdminMenuMapperSetOwner = 'soz-core:nui:admin:mapper:set-owner',
    AdminMenuMapperClearOwner = 'soz-core:nui:admin:mapper:clear-owner',
    AdminMenuMapperSetApartmentTier = 'soz-core:nui:admin:mapper:set-apartment-tier',
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
    AdminMenuPlayerHandleResetClientState = 'soz-core:client:admin:reset-client-state',
    AdminMenuPlayerSearch = 'soz-core:client:admin:search',
    AdminMenuPlayerSetZombie = 'soz-core:client:admin:set-zombie',
    AdminMenuPlayerSetSenateParty = 'soz-core:client:admin:set-senate-party',
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
    AdminSetAdminGPS = 'soz-core:client:admin:gps',
    AdminSetPoliceLocator = 'soz-core:client:admin:police-locator',
    AdminMenuCharacterCreateNew = 'soz-core:client:admin:character:create-new',
    AdminMenuCharacterSwitch = 'soz-core:client:admin:character:switch',

    BaunDisplayBlip = 'soz-core:client:job:baun:display-blip',
    CraftingDoCraft = 'soz-core:nui:crafting:do-craft',
    CraftingDoSalvage = 'soz-core:nui:crafting:do-salvage',
    CraftingCancel = 'soz-core:nui:crafting:cancel',
    StonkDisplayBlip = 'soz-core:client:job:stonk:display-blip',

    JobPlaceProps = 'soz-core:client:job:place-props',

    LsmcPharmacyBuyItem = 'soz-core:nui:job:lsmc:pharmacy:buy-item',

    NewsCreateAnnounce = 'soz-core:nui:news:create-announce',
    NewsPlaceObject = 'soz-core:client:news:place-object',

    BennysCancelOrder = 'soz-core:client:job:bennys:cancel-order',
    BennysOrder = 'soz-core:client:job:bennys:order',
    BennysGetOrders = 'soz-core:client:job:bennys:get-orders',
    BennysUpgradeVehicle = 'soz-core:nui:job:bennys:upgrade-vehicle',

    FfsDisplayBlip = 'soz-core:client:job:ffs:display-blip',
    FoodDisplayBlip = 'soz-core:client:job:food:display-blip',
    FdfDisplayBlip = 'soz-core:client:job:fdf:display-blip',
    GarbageDisplayBlip = 'soz-core:client:job:garbage:display-blip',
    PlayerSetHealthBookField = 'soz-core:client:player:health-book:set',
    InputSet = 'soz-core:client:input:set',
    InputCancel = 'soz-core:client:input:cancel',

    Loaded = 'soz-core:nui:loaded',
    MenuClosed = 'menu_closed',
    JobBossShopBuyItem = 'soz-core:nui:job:boss-shop:buy-item',
    JobPromote = 'soz-core:nui:job:promote',
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
    PlayerMenuRemoveDeguisement = 'soz-core:nui:player:menu:cloth-remove-deguisement',
    PlayerMenuReDress = 'soz-core:nui:player:menu:cloth-redress',
    PlayerMenuVoipReset = 'soz-core:nui:player:menu:voip-reset',
    PlayerMenuHudSetArachnophobe = 'soz-core:nui:player:menu:arachnophobe',
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
    VehicleSetNeonStatus = 'soz-core:nui:vehicle:set-neon-status',
    VehicleSetSpeedLimit = 'soz-core:nui:vehicle:set-speed-limit',
    VehicleOpenLSCustom = 'soz-core:nui:vehicle:open-ls-custom',
    VehicleSetDoorOpen = 'soz-core:nui:vehicle:set-door-open',
    VehicleHandleRadio = 'soz-core:nui:vehicle:handle-radio',
    VehicleAnchorChange = 'soz-core:client:vehicle:anchor-change',
    VehiclePoliceDisplay = 'soz-core:client:vehicle:police-display',
    VehiclePitStop = 'soz-core:client:vehicle:pitstop',
    VehiclePitStopPrices = 'soz-core:client:vehicle:prices',
    VehiclePitStopSetPrice = 'soz-core:client:vehicle:set-price',

    VehicleGarageTakeOut = 'soz-core:client:vehicle:garage:take-out',
    VehicleGarageSetName = 'soz-core:client:vehicle:garage:set-name',
    VehicleGarageStore = 'soz-core:client:vehicle:garage:store',
    VehicleGarageStoreTrailer = 'soz-core:client:vehicle:garage:store-trailer',
    VehicleGarageShowPlaces = 'soz-core:client:vehicle:garage:show-places',
    VehicleGarageTransfer = 'soz-core:client:vehicle:garage:transfer',

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
    GunSmithPreviewAttachment = 'soz-core:client:job:gunsmith:preview-attachment',
    GunSmithApplyConfiguration = 'soz-core:client:job:gunsmith:apply-configuration',

    DrivingSchoolUpdateVehicleLimit = 'soz-core:client:driving-school:update-vehicle-limit',
    DrivingSchoolCheckVehicleSlots = 'soz-core:client:driving-school:check-vehicle-slots',

    HousingUpgradeApartment = 'soz-core:client:housing:upgrade-apartment',
    HousingAddRoommate = 'soz-core:nui:housing:add-roommate',
    HousingBell = 'soz-core:nui:housing:bell',
    HousingBuy = 'soz-core:nui:housing:buy',
    HousingEnter = 'soz-core:nui:housing:enter',
    HousingRemoveRoommate = 'soz-core:nui:housing:remove-roommate',
    HousingSell = 'soz-core:nui:housing:sell',
    HousingVisit = 'soz-core:nui:housing:visit',
    HousingCloakroomApply = 'soz-core:nui:housing:cloakroom:apply',
    HousingCloakroomSave = 'soz-core:nui:housing:cloakroom:save',
    HousingCloakroomRename = 'soz-core:nui:housing:cloakroom:rename',
    HousingCloakroomDelete = 'soz-core:nui:housing:cloakroom:delete',

    ToggleRadarMendatory = 'soz-core:client:mendatory:radar:toggle',
    RedCallMendatory = 'soz-core:client:mendatory:red-call',
    ToggleRadar = 'soz-core:client:police:radar:toggle',
    RedCall = 'soz-core:client:police:red-call',
    PoliceRemovePointsLicence = 'soz-core:client:police:remove-points-licence',
    PoliceRemoveLicence = 'soz-core:client:police:remove-licence',
    PoliceAddLicence = 'soz-core:client:police:add-licence',
    PolicePreFine = 'soz-core:client:police:pre-fine',
    PolicePreCustomFine = 'soz-core:client:police:pre-custom-fine',
    PoliceShowBadge = 'soz-core:client:police:show-badge',
    PoliceGetWantedPlayers = 'soz-core:client:police:get-wantedPlayers',
    PoliceDeleteWantedPlayer = 'soz-core:client:police:delete-wantedPlayer',
    PoliceGatherMoneyMarked = 'soz-core:client:police:gather-money-marked',

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

    AlbumPlay = 'soz-core:client:album:play',
    AlbumVolume = 'soz-core:client:album:volume',
    SuccessFishing = 'soz-core:client:fishing:success',
    StopFishing = 'soz-core:client:fishing:stop',
    FishingSuccessHit = 'soz-core:client:fishing:success-hit',
    ClaimReward = 'soz-core:client:sozedex:claim-reward',

    BoatRent = 'soz-core:client:fishing:rent-boat',
    BoatReturn = 'soz-core:client:fishing:return-boat',
    SozedexClosed = 'soz-core:nui:sozedex:closed',

    DrugSkillTreeBuy = 'soz-core:client:drug:skill-buy',
    DrugLocationGps = 'soz-core:client:drug:location-gps',
    DrugGardenEnter = 'soz-core:client:drug:garden-enter',
    DrugGardenAdd = 'soz-core:client:drug:garden-add',
    DrugGardenRemove = 'soz-core:client:drug:garden-remove',
    DrugZoneHide = 'soz-core:client:drug:zone-hide',
    DrugZoneAdd = 'soz-core:client:drug:zone-add',
    DrugUpdateZone = 'soz-core:client:drug:zone-update',
    DrugAdminMenuOpen = 'soz-core:client:drug:admin-menu-open',
    DrugTransformDoTransform = 'soz-core:client:drug:transform-doit',
    DrugTransformCancel = 'soz-core:client:drug:transform-cancel',
    DrugContractExit = 'soz-core:client:drug:contract-exit',

    RaceAdminMenuOpen = 'soz-core:client:race:open-menu',
    RaceAdd = 'soz-core:client:race:add',
    RaceEnable = 'soz-core:client:race:enable',
    RaceRename = 'soz-core:client:race:rename',
    RaceUpdateLocation = 'soz-core:client:race:update-location',
    RaceUpdateCarModel = 'soz-core:client:race:update-model',
    RaceDelete = 'soz-core:client:race:delete',
    RaceMenuLaunch = 'soz-core:client:race:menu-launch',
    RaceAddCheckpoint = 'soz-core:client:race:add-checkpoint',
    RaceUpdateCheckPoint = 'soz-core:client:race:update-checkpoint',
    RaceDisplay = 'soz-core:client:race:display',
    RaceTPStart = 'soz-core:client:race:tp',
    RaceCurrrent = 'soz-core:client:race:current',
    RaceClearRanking = 'soz-core:client:race:clear-ranking',
    RaceGetRanking = 'soz-core:client:race:get-ranking',
    RaceFps = 'soz-core:client:race:fps',
    RaceVehConfiguration = 'soz-core:client:race:veh-configuration',
    RaceUpdateGarage = 'soz-core:client:race:garage',

    GouvAnnoncement = 'soz-core:client:gouv:annoncement',

    SelectPlacedProp = 'soz-core:client:placement:select-placed-prop',
    SelectPropToCreate = 'soz-core:client:placement:select-prop-to-create',
    ChoosePropToCreate = 'soz-core:client:placement:choose-prop-to-create',
    ChoosePlacedPropToEdit = 'soz-core:client:placement:choose-placed-prop-to-edit',
    SearchProp = 'soz-core:client:placement:search-prop',
    LeaveEditorMode = 'soz-core:client:placement:leave-mode',
    ToggleMouseSelection = 'soz-core:client:placement:toggle-mouse-selection',
    TogglePipette = 'soz-core:client:placement:toggle-pipette',
    ValidatePlacement = 'soz-core:client:placement:validate',
    RequestDeleteCurrentProp = 'soz-core:client:placement:request-delete-current-prop',
    PropPlacementReset = 'soz-core:client:placement:reset',
    PropPlacementReturnToMainMenu = 'soz-core:client:placement:return-to-main-menu',
    PropToggleCollision = 'soz-core:client:placement:toggle-collision',
    SelectPlacementCollection = 'soz-core:client:placement:select-collection',
    RequestToggleCollectionLoad = 'soz-core:client:placement:toggle-collection-load',
    RequestDeletePropCollection = 'soz-core:client:placement:delete-collection',
    RequestCreatePropCollection = 'soz-core:client:placement:create-collection',
    RequestDeleteProp = 'soz-core:client:placement:delete-prop',
    PlacementCollectionRename = 'soz-core:client:placement:rename-collection',

    CraftDoRecipe = 'soz-core:client:craft:do-recipe',
    CraftCancel = 'soz-core:client:craft:cancel',

    DmcToggleBlip = 'soz-core:client:job:dmc:toggle-blip',

    HubEntryDisplay = 'soz-core:client:hub:entry-display',
    HubEntryFetch = 'soz-core:client:hub:entry-fetch',
    HubEntryAdd = 'soz-core:client:hub:entry-add',
    HubEntryShow = 'soz-core:client:hub:entry-show',
    HubEntryUpdate = 'soz-core:client:hub:entry-update',
    HubEntryAdminMenuOpen = 'soz-core:client:hub:entry-open-menu',
}
