import { ShopBrand } from '@public/config/shops';
import { Rpc } from '@public/core/decorators/rpc';
import { emitRpc } from '@public/core/rpc';
import { Feature } from '@public/shared/features';
import { Control } from '@public/shared/input';
import { RpcClientEvent, RpcServerEvent } from '@public/shared/rpc';
import { Parade } from '@public/shared/story/parade';

import { DealershipType } from '../../config/dealership';
import { GarageList } from '../../config/garage';
import { Once, OnceStep, OnEvent, OnGameEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { wait } from '../../core/utils';
import { AnimationStopReason } from '../../shared/animation';
import { Component, Outfit, Prop, WardrobeConfig } from '../../shared/cloth';
import { CraftsList } from '../../shared/craft/craft';
import { ClientEvent } from '../../shared/event/client';
import { GameEvent } from '../../shared/event/game';
import { NuiEvent } from '../../shared/event/nui';
import { ServerEvent } from '../../shared/event/server';
import { InventoryType } from '../../shared/inventory';
import { joaat } from '../../shared/joaat';
import { HAZMAT_OUTFIT_NAME, LsmcCloakroom } from '../../shared/job/lsmc';
import { getExtendedLocationHash } from '../../shared/locationhash';
import { NotEmptyStringValidator } from '../../shared/nui/input';
import { MenuType } from '../../shared/nui/menu';
import { ForbiddenPropModels } from '../../shared/object';
import { getDistance, toVector4Object, Vector3, Vector4 } from '../../shared/polyzone/vector';
import { getRandomInt, getRandomItem } from '../../shared/random';
import { getDefaultVehicleConfiguration } from '../../shared/vehicle/modification';
import { Vehicle, VehicleSeat } from '../../shared/vehicle/vehicle';
import {
    HammerProp,
    WHAT_IF_HELIS,
    WhatIf2Cloakroom,
    WhatIf2CraftingTables,
    WhatIf2Lockers,
    WhatIf2LootInventoryType,
    WhatIf2LootModels,
    WhatIf2LootType,
    WhatIf2LootZones,
    WhatIf2RespawnPoints,
    WhatIf2ShopPosition,
    WhatIf2SpawnGuild,
    WhatIf2TpPosition,
    WhatIfGuild,
    WhatIfMedicPosition,
    WhatIfPveZone,
    WhatIfSafeZones,
} from '../../shared/whatif';
import { AnimationRunner } from '../animation/animation.factory';
import { AnimationService } from '../animation/animation.service';
import { CameraService } from '../camera';
import { PedFactory } from '../factory/ped.factory';
import { FeatureProvider } from '../feature/feature.provider';
import { HudStateProvider } from '../hud/hud.state.provider';
import { InventoryDragAndDropProvider } from '../inventory/inventory.draganddrop.provider';
import { InventoryManager } from '../inventory/inventory.manager';
import { ItemService } from '../item/item.service';
import { Notifier } from '../notifier';
import { InputService } from '../nui/input.service';
import { NuiDispatch } from '../nui/nui.dispatch';
import { NuiMenu } from '../nui/nui.menu';
import { ObjectEditorProvider } from '../object/object.editor.provider';
import { ObjectProvider } from '../object/object.provider';
import { PropHighlightService } from '../object/prop.highlight.service';
import { MapPickerProvider } from '../picker/map.picker.provider';
import { PlayerHealthProvider } from '../player/player.health.provider';
import { PlayerInOutService } from '../player/player.inout.service';
import { PlayerListStateService } from '../player/player.list.state.service';
import { PlayerPositionProvider } from '../player/player.position.provider';
import { PlayerService } from '../player/player.service';
import { PlayerWalkstyleProvider } from '../player/player.walkstyle.provider';
import { PlayerWardrobe } from '../player/player.wardrobe';
import { ProgressService } from '../progress.service';
import { ResourceLoader } from '../repository/resource.loader';
import { ClothingShopRepository } from '../repository/shop.repository';
import { UnderTypesShopRepository } from '../repository/under_types.shop.repository';
import { SoundService } from '../sound.service';
import { ZombieModels } from '../story/zombie.provider';
import { TargetFactory } from '../target/target.factory';
import { BlurService } from '../utils/blur.service';
import { VehicleGarageProvider } from '../vehicle/vehicle.garage.provider';
import { VehicleService } from '../vehicle/vehicle.service';
import { VoipService } from '../voip/voip.service';
import { WeaponService } from '../weapon/weapon.service';

const INFECTED_TIME_BEFORE_DEATH = 20 * 60 * 1000; // 20 minutes

const MAX_HAMMER_PROPS_DISTANCE = 100;

const ZombieModelHash = Object.keys(ZombieModels).map(model => joaat(model));

const MAX_SOUND_DISTANCE = 50;

const ZombieSound = [
    {
        dict: '',
        name: 'groan',
        native: false,
        speech: false,
    },
    {
        dict: '',
        name: 'groan2',
        native: false,
        speech: false,
    },
    {
        dict: '',
        name: 'groan3',
        native: false,
        speech: false,
    },
    {
        dict: '',
        name: 'groan4',
        native: false,
        speech: false,
    },
    {
        dict: '',
        name: 'lowgroan',
        native: false,
        speech: false,
    },
    {
        dict: '',
        name: 'lowgroan2',
        native: false,
        speech: false,
    },
    {
        dict: '',
        name: 'zmoan01',
        native: false,
        speech: false,
    },
    {
        dict: '',
        name: 'zmoan02',
        native: false,
        speech: false,
    },
    {
        dict: '',
        name: 'zmoan03',
        native: false,
        speech: false,
    },
    {
        dict: '',
        name: 'zmoan04',
        native: false,
        speech: false,
    },
    {
        dict: 'DLC_24-1_YK_Survival_Sounds',
        name: 'Undead_Death',
        native: true,
        speech: false,
    },
    {
        dict: 'DLC_24-1_YK_Survival_Sounds',
        name: 'Undead_Pain',
        native: true,
        speech: false,
    } /*,
    {
        dict: 'DLC_24-YK_Survival_01',
        name: 'UNDEAD_SPAWN',
        native: true,
        speech: true,
    },
    {
        dict: 'DLC_24-YK_Survival_01',
        name: 'UNDEAD_IDLE',
        native: true,
        speech: true,
    },
    {
        dict: 'DLC_24-YK_Survival_01',
        name: 'UNDEAD_SPAWN_FIRE',
        native: true,
        speech: true,
    },
    {
        dict: 'DLC_24-YK_Survival_01',
        name: 'UNDEAD_SPAWN_PLAGUE',
        native: true,
        speech: true,
    },
    {
        dict: 'DLC_24-YK_Survival_01',
        name: 'UNDEAD_SPAWN_SUCIDE',
        native: true,
        speech: true,
    },
    {
        dict: 'DLC_24-YK_Survival_01',
        name: 'UNDEAD_SPAWN_HEAVY',
        native: true,
        speech: true,
    },
    {
        dict: 'DLC_24-YK_Survival_01',
        name: 'UNDEAD_WAR_CRY',
        native: true,
        speech: true,
    },
    {
        dict: 'DLC_24-YK_Survival_01',
        name: 'UNDEAD_EXPLODER_SPRINT',
        native: true,
        speech: true,
    }*/,
];

const MIN_SPAWN_DISTANCE = 30;
const MAX_SPAWN_DISTANCE = 100;

@Provider()
export class WhatIf2Provider {
    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    @Inject(ResourceLoader)
    private readonly resourceLoader: ResourceLoader;

    @Inject(PlayerInOutService)
    private playerInOutService: PlayerInOutService;

    @Inject(WeaponService)
    private weapon: WeaponService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(TargetFactory)
    public targetFactory: TargetFactory;

    @Inject(InventoryManager)
    public inventoryManager: InventoryManager;

    @Inject(AnimationService)
    public animationService: AnimationService;

    @Inject(BlurService)
    public blurService: BlurService;

    @Inject(PlayerListStateService)
    private readonly playerListStateService: PlayerListStateService;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Inject(ObjectProvider)
    private readonly objectProvider: ObjectProvider;

    @Inject(PlayerWardrobe)
    private playerWardrobe: PlayerWardrobe;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(ItemService)
    private readonly itemService: ItemService;

    @Inject(NuiMenu)
    public nuiMenu: NuiMenu;

    @Inject(PropHighlightService)
    private propHighlightService: PropHighlightService;

    @Inject(ObjectEditorProvider)
    public objectEditorProvider: ObjectEditorProvider;

    @Inject(InputService)
    public inputService: InputService;

    @Inject(MapPickerProvider)
    private mapPickerProvider: MapPickerProvider;

    @Inject(VehicleGarageProvider)
    private vehicleGarageProvider: VehicleGarageProvider;

    @Inject(ClothingShopRepository)
    public clothingShopRepository: ClothingShopRepository;

    @Inject(UnderTypesShopRepository)
    private underTypesShopRepository: UnderTypesShopRepository;

    @Inject(PlayerWalkstyleProvider)
    private readonly playerWalkstyleProvider: PlayerWalkstyleProvider;

    @Inject(PlayerPositionProvider)
    private readonly playerPositionProvider: PlayerPositionProvider;

    @Inject(VoipService)
    private voipService: VoipService;

    @Inject(SoundService)
    public soundService: SoundService;

    @Inject(InventoryDragAndDropProvider)
    public inventoryDragAndDropProvider: InventoryDragAndDropProvider;

    @Inject(CameraService)
    private readonly cameraService: CameraService;

    @Inject(HudStateProvider)
    public hudStateProvider: HudStateProvider;

    @Inject(PlayerHealthProvider)
    public playerHealthProvider: PlayerHealthProvider;

    @Inject(PedFactory)
    private pedFactory: PedFactory;

    @Inject(VehicleService)
    private vehicleService: VehicleService;

    private camera = null;

    private inSafeZone = false;
    private zombieRelation = 'ZombieAggressive';
    private zombieVehicleRelation = 'ZombieVehicleKnockOut';

    private isInfected = false;
    private isInfectedAt = 0;
    private lastInfectionAnimation = 0;

    private isMouseSelectionOn: boolean;
    private hammerDebugEntity = 0;

    private hubMessageDisplayed = false;
    private inventoryAnimationRunner: AnimationRunner | null = null;

    @Once(OnceStep.Start)
    async onStart() {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        const playerBlip = GetMainPlayerBlipId();
        const northBlip = GetNorthRadarBlip();

        SetBlipAlpha(playerBlip, 0);
        SetBlipAlpha(northBlip, 0);

        this.safeZoneSetup();
        this.lootingSetup();

        SetPedMeleeCombatLimits(10, 10, 10);

        AddRelationshipGroup(this.zombieRelation);
        AddRelationshipGroup(this.zombieVehicleRelation);
        SetRelationshipBetweenGroups(0, GetHashKey(this.zombieRelation), GetHashKey(this.zombieRelation));
        SetRelationshipBetweenGroups(0, GetHashKey(this.zombieVehicleRelation), GetHashKey(this.zombieVehicleRelation));
        SetRelationshipBetweenGroups(0, GetHashKey(this.zombieVehicleRelation), GetHashKey(this.zombieRelation));
        SetRelationshipBetweenGroups(0, GetHashKey(this.zombieRelation), GetHashKey(this.zombieVehicleRelation));
        SetRelationshipBetweenGroups(5, GetHashKey(this.zombieRelation), GetHashKey('PLAYER'));
        SetRelationshipBetweenGroups(5, GetHashKey('PLAYER'), GetHashKey(this.zombieRelation));
        SetRelationshipBetweenGroups(3, GetHashKey(this.zombieVehicleRelation), GetHashKey('PLAYER'));

        await this.resourceLoader.loadClipSet('clipset@anim@ingame@move_m@zombie@core');
        await this.resourceLoader.loadClipSet('clipset@anim@ingame@move_m@zombie@strafe');
        await this.resourceLoader.loadClipSet('clipset@anim@ingame@melee@unarmed@streamed_core_zombie');
        await this.resourceLoader.loadClipSet('clipset@anim@ingame@melee@unarmed@streamed_variations_zombie');
        await this.resourceLoader.loadClipSet('clipset@anim@ingame@melee@unarmed@streamed_taunts_zombie');

        await this.resourceLoader.requestScriptAudioBank('DLC_24-1/YK_Survival');
        await this.resourceLoader.requestScriptAudioBank('DLC_24-1/YK_Survival_02');

        if (!IsAudioSceneActive('DLC_24-1_YK_Mixer_Scene')) {
            StartAudioScene('DLC_24-1_YK_Mixer_Scene');
        }

        const id1 = 'whatifstorage_raider';
        this.objectProvider.createObject(
            {
                id: id1,
                position: [1717.98, 2518.86, 44.567, 28.83],
                placeOnGround: true,
                model: GetHashKey('xm3_prop_xm3_whshelf_01a'),
            },
            [
                {
                    label: 'Ouvrir',
                    icon: 'inventory/ouvrir_le_stockage',
                    category: 'citizen',
                    event: 'all',
                    action: entity => {
                        this.inventoryManager.openInventory(
                            InventoryType.ObjectStorage,
                            id1,
                            GetEntityCoords(entity) as Vector3
                        );
                    },
                },
            ]
        );

        const id2 = 'whatifstorage_warden';
        this.objectProvider.createObject(
            {
                id: id2,
                position: [2572.76, -389.92, 93.2, 46.24],
                placeOnGround: true,
                model: GetHashKey('xm3_prop_xm3_whshelf_01a'),
            },
            [
                {
                    label: 'Ouvrir',
                    icon: 'inventory/ouvrir_le_stockage',
                    category: 'citizen',
                    event: 'all',
                    action: entity => {
                        this.inventoryManager.openInventory(
                            InventoryType.ObjectStorage,
                            id2,
                            GetEntityCoords(entity) as Vector3
                        );
                    },
                },
            ]
        );
    }

    private safeZoneSetup() {
        Object.entries(WhatIfSafeZones).forEach(([guild, zone]) => {
            this.playerInOutService.add(`SafeZone-${guild}`, zone, isInside => {
                this.weapon.setDisabled('SafeZone', isInside);
                this.inSafeZone = isInside;

                this.safeZoneLoop();

                if (isInside && !this.hubMessageDisplayed) {
                    this.notifier.notify(
                        'Bienvenue dans le campement des ~b~' +
                            guild +
                            's~s~, ici les murs tiennent encore. Un maigre rempart contre ~r~l’enfer extérieur~s~.~n~' +
                            'Aucune créature, aucune arme, aucune trahison ~h~~r~n’a sa place~s~~/h~ entre ces barrières.~n~' +
                            'Reprenez votre souffle, échangez, préparez-vous… car au-delà de cette limite, ~b~c’est la ~h~survie~/h~~s~, rien d’autre.',
                        'info',
                        20000
                    );
                    this.hubMessageDisplayed = true;
                }

                if (!isInside) {
                    this.getOutSafeZone();
                }
            });
        });

        Object.entries(WhatIf2Lockers).forEach(([guild, lockers]) => {
            lockers.forEach((locker, index) => {
                this.objectProvider.createObject(
                    {
                        id: `whatif-lockers-${guild}-${index}`,
                        model: joaat('bkr_prop_biker_garage_locker_01'),
                        position: locker,
                    },
                    [
                        {
                            label: 'Customiser ses habits',
                            icon: 'shop/store',
                            category: 'citizen',
                            event: 'whatif:2',
                            action: async () => {
                                const brand: ShopBrand = ShopBrand.Binco;

                                const { shop: shop_content, content: shop_categories } =
                                    await this.clothingShopRepository.getShopContent(brand);
                                const under_types = this.underTypesShopRepository.getAllUnderTypes();

                                this.nuiDispatch.dispatch('cloth_shop', 'SetCatalog', {
                                    brand: brand,
                                    shop_content,
                                    shop_categories,
                                    under_types,
                                    isInCayo: true,
                                });
                            },
                        },
                        {
                            label: 'Customiser son masque',
                            icon: 'shop/store',
                            category: 'citizen',
                            event: 'whatif:2',
                            action: async () => {
                                const brand: ShopBrand = ShopBrand.Mask;

                                const { shop: shop_content, content: shop_categories } =
                                    await this.clothingShopRepository.getShopContent(brand);
                                const under_types = this.underTypesShopRepository.getAllUnderTypes();

                                this.nuiDispatch.dispatch('cloth_shop', 'SetCatalog', {
                                    brand: brand,
                                    shop_content,
                                    shop_categories,
                                    under_types,
                                    isInCayo: true,
                                });
                            },
                        },
                        {
                            label: 'Se changer',
                            icon: 'jobs/habiller',
                            category: 'citizen',
                            event: 'whatif:2',
                            action: () => this.openCloakroom(WhatIf2Cloakroom),
                        },
                        {
                            label: 'Ouvrir mon casier',
                            icon: 'inventory/archive',
                            category: 'citizen',
                            event: 'whatif:2',
                            action: async () => {
                                const player = this.playerService.getPlayer();
                                if (!player) {
                                    return false;
                                }

                                const playerPed = PlayerPedId();
                                const coords = GetEntityCoords(playerPed);

                                this.inventoryManager.openInventory(
                                    InventoryType.HugeStash,
                                    `stash_${guild}_${player.citizenid}`,
                                    coords as Vector3
                                );
                            },
                        },
                    ]
                );
            });
        });

        Object.entries(WhatIf2CraftingTables).forEach(([guild, tables]) => {
            tables.forEach((table, index) => {
                this.objectProvider.createObject(
                    {
                        id: `whatif-crafting-${guild}-${index}`,
                        model: joaat('gr_prop_gr_bench_03a'),
                        position: table,
                    },
                    [
                        {
                            label: 'Confectionner',
                            icon: 'dmc/confection',
                            category: 'citizen',
                            event: 'whatif:2',
                            action: async () => {
                                const crafting = await emitRpc<CraftsList>(RpcServerEvent.CRAFT_GET_RECIPES, 'whatif2');
                                crafting.title = 'Campement';
                                crafting.subtitle = 'Confection';
                                this.nuiDispatch.dispatch('craft', 'ShowCraft', crafting);
                            },
                        },
                    ]
                );
            });
        });

        this.targetFactory.createForModel('gr_prop_gr_bench_03a', [
            {
                label: 'Confectionner',
                icon: 'dmc/confection',
                category: 'citizen',
                event: 'whatif:2',
                canInteract: entity => {
                    const id = this.objectProvider.getIdFromEntity(entity);
                    const obj = this.objectProvider.getObject(id);
                    if (!obj) {
                        return false;
                    }

                    return id && id.startsWith('whatif_');
                },
                action: async () => {
                    const crafting = await emitRpc<CraftsList>(RpcServerEvent.CRAFT_GET_RECIPES, 'whatif2');
                    crafting.title = 'Table de confection';
                    crafting.subtitle = 'Confection';
                    this.nuiDispatch.dispatch('craft', 'ShowCraft', crafting);
                },
            },
        ]);

        this.inventoryDragAndDropProvider.registerModelTarget(joaat('gr_prop_gr_bench_03a'), [
            async item => {
                TriggerServerEvent(ServerEvent.WHAT_IF_SALVAGE, item);
                return true;
            },
        ]);

        Object.entries(WhatIf2ShopPosition).forEach(([guild, shop]) => {
            this.targetFactory.createForPed({
                model: 'ig_jimmyboston',
                coords: toVector4Object(shop),
                invincible: true,
                freeze: true,
                spawnNow: true,
                blockevents: true,
                scenario: 'WORLD_HUMAN_STAND_IMPATIENT',
                target: {
                    options: [
                        {
                            icon: 'dealership/list',
                            label: 'Accéder au catalogue',
                            category: 'citizen',
                            event: 'whatif:2',
                            action: () => {
                                this.openDealership(DealershipType.WhatIf, shop);
                            },
                        },
                        {
                            label: 'Garage',
                            icon: 'housing/garage',
                            category: 'citizen',
                            event: 'whatif:2',
                            action: () => {
                                this.vehicleGarageProvider.enterGarage(`whatif_garage_${guild}`, {
                                    ...GarageList[`whatif_garage_${guild}`],
                                    id: `whatif_garage_${guild}`,
                                });
                            },
                        },
                    ],
                    distance: 2.5,
                },
            });
        });

        WhatIf2TpPosition.map(position => {
            this.targetFactory.createForPed({
                model: 'u_m_y_proldriver_01',
                coords: toVector4Object(position),
                invincible: true,
                freeze: true,
                spawnNow: true,
                blockevents: true,
                scenario: 'WORLD_HUMAN_STAND_IMPATIENT',
                target: {
                    options: [
                        {
                            icon: 'housing/enter',
                            label: 'Aller en zone PVE',
                            category: 'citizen',
                            event: 'whatif:2',
                            action: () => {
                                TriggerServerEvent(ServerEvent.WHAT_IF_TELEPORT_PVE);
                            },
                        },
                    ],
                    distance: 2.5,
                },
            });
        });

        Object.values(WhatIfMedicPosition).forEach(shop => {
            this.targetFactory.createForPed({
                model: 's_m_m_doctor_01',
                coords: toVector4Object(shop),
                invincible: true,
                freeze: true,
                spawnNow: true,
                blockevents: true,
                animDict: 'anim@amb@casino@valet_scenario@pose_d@',
                anim: 'base_a_m_y_vinewood_01',
                flag: 49,
                target: {
                    options: [
                        {
                            label: 'Soins médicaux',
                            icon: 'ems/heal',
                            category: 'citizen',
                            event: 'whatif:2',
                            action: () => {
                                TriggerServerEvent(ServerEvent.LSMC_NPC_HEAL);
                            },
                        },
                    ],
                    distance: 2.5,
                },
            });
        });

        this.playerInOutService.add('what-if-pve', WhatIfPveZone, isInside => {
            SetCanAttackFriendly(PlayerPedId(), !isInside, false);
            NetworkSetFriendlyFireOption(!isInside);
        });
    }

    private lootingSetup() {
        Object.entries(WhatIf2LootModels).forEach(([lootType, models]) => {
            this.targetFactory.createForModel(models, [
                {
                    label: 'Fouiller',
                    icon: 'police/fouiller',
                    category: 'citizen',
                    event: 'whatif:2',
                    action: async (entity: number) => {
                        const id = this.computeInventoryId('lootbox', entity);
                        TaskTurnPedToFaceEntity(PlayerPedId(), entity, 800);
                        await wait(800);

                        PlaySoundFrontend(-1, 'Collect_Pickup', 'DLC_IE_PL_Player_Sounds', true);
                        this.inventoryAnimationRunner = this.animationService.playScenario(
                            {
                                name: 'PROP_HUMAN_BUM_BIN',
                            },
                            {
                                cancellable: true,
                            }
                        );

                        const playerPed = PlayerPedId();
                        const coords = GetEntityCoords(playerPed);

                        const currentLootZone = this.getCurrentLootZone();
                        if (Number(lootType) > currentLootZone) {
                            await emitRpc(RpcServerEvent.WHAT_IF_LOOT_INVENTORY, id, currentLootZone);
                            this.inventoryManager.openInventory(
                                WhatIf2LootInventoryType[currentLootZone] as InventoryType,
                                id,
                                coords as Vector3
                            );
                        } else {
                            await emitRpc(RpcServerEvent.WHAT_IF_LOOT_INVENTORY, id, lootType);
                            this.inventoryManager.openInventory(
                                WhatIf2LootInventoryType[lootType],
                                id,
                                coords as Vector3
                            );
                        }
                    },
                    canInteract: async (entity: number) => {
                        const coords = GetEntityCoords(entity) as Vector3;
                        return Object.values(WhatIfSafeZones).every(zone => !zone.isPointInside(coords));
                    },
                },
            ]);
        });

        this.targetFactory.createForAllPed(
            [
                {
                    label: 'Fouiller',
                    icon: 'police/fouiller',
                    category: 'citizen',
                    event: 'whatif:2',
                    action: async (entity: number) => {
                        const id = this.computeInventoryId('zombie', entity);
                        TaskTurnPedToFaceEntity(PlayerPedId(), entity, 800);
                        await wait(800);

                        PlaySoundFrontend(-1, 'Collect_Pickup', 'DLC_IE_PL_Player_Sounds', true);
                        this.inventoryAnimationRunner = this.animationService.playScenario(
                            {
                                name: 'CODE_HUMAN_MEDIC_TEND_TO_DEAD',
                            },
                            {
                                cancellable: true,
                            }
                        );

                        const playerPed = PlayerPedId();
                        const coords = GetEntityCoords(playerPed);

                        const currentLootZone = this.getCurrentLootZone();
                        await emitRpc(RpcServerEvent.WHAT_IF_LOOT_INVENTORY, id, currentLootZone, true);

                        this.inventoryManager.openInventory(InventoryType.Zombie, id, coords as Vector3);
                    },
                    canInteract: async (entity: number) => {
                        return IsEntityDead(entity) && !IsPedAPlayer(entity);
                    },
                },
            ],
            10
        );

        this.targetFactory.createForAllPlayer([
            {
                label: 'Fouiller',
                icon: 'police/fouiller',
                category: 'citizen',
                event: 'whatif:2',
                action: async (entity: number) => {
                    const targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    const targetCitizenId = await emitRpc<string>(
                        RpcServerEvent.WHAT_IF_PLAYER_GET_CITIZEN_ID,
                        targetSource
                    );
                    if (!targetCitizenId) return;

                    TaskTurnPedToFaceEntity(PlayerPedId(), entity, 800);
                    await wait(800);

                    PlaySoundFrontend(-1, 'Collect_Pickup', 'DLC_IE_PL_Player_Sounds', true);
                    this.inventoryAnimationRunner = this.animationService.playScenario(
                        {
                            name: 'CODE_HUMAN_MEDIC_TEND_TO_DEAD',
                        },
                        {
                            cancellable: true,
                        }
                    );

                    await wait(4000);

                    this.inventoryManager.openInventory(InventoryType.Player, 'player_' + targetCitizenId);
                },
                canInteract: async (entity: number) => {
                    const targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));

                    return this.playerListStateService.isDead(targetSource);
                },
            },
        ]);
    }

    private getCurrentLootZone(): WhatIf2LootType {
        const coords = GetEntityCoords(PlayerPedId(), false) as Vector3;

        if (WhatIf2LootZones[WhatIf2LootType.Military].some(zone => zone.isPointInside(coords))) {
            return WhatIf2LootType.Military;
        }

        if (WhatIf2LootZones[WhatIf2LootType.High].some(zone => zone.isPointInside(coords))) {
            return WhatIf2LootType.High;
        }

        if (WhatIf2LootZones[WhatIf2LootType.Medium].some(zone => zone.isPointInside(coords))) {
            return WhatIf2LootType.Medium;
        }

        return WhatIf2LootType.Low;
    }

    public async openDealership(dealershipType: DealershipType, position: Vector4) {
        const vehicles = await emitRpc<Vehicle[]>(RpcServerEvent.WHAT_IF_VEHICLE_DEALERSHIP_GET_LIST);

        this.nuiMenu.openMenu(
            MenuType.VehicleDealership,
            {
                name: 'Concessionnaire',
                dealershipId: dealershipType,
                vehicles,
            },
            {
                position: {
                    position,
                    distance: 3.0,
                },
            }
        );
    }

    @Once(OnceStep.NuiLoaded)
    @OnEvent(ClientEvent.WHAT_IF_RELOAD_GUILD)
    async onPlayerLoaded(forceReload = false) {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        const player = this.playerService.getPlayer();
        if (!player) {
            return;
        }

        if (!forceReload && player.metadata.whatif_guild) {
            return;
        }

        exports['soz-loadscreen'].Shutdown();

        this.voipService.mutePlayer(true);

        const publicApiUrl = GetConvar('soz_public_endpoint', 'https://soz.zerator.com');
        const location = await this.mapPickerProvider.showGlobalLocationPicker(
            WhatIf2SpawnGuild.map(spawn => ({
                ...spawn,
                description: { ...spawn.description, image: publicApiUrl + spawn.description.image },
            }))
        );
        if (!location) return;

        this.voipService.mutePlayer(false);
        await this.onSetGuild(location.id as WhatIfGuild);
    }

    @OnNuiEvent(NuiEvent.WhatIfSetGuild)
    async onSetGuild(guild: WhatIfGuild) {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        const player = this.playerService.getPlayer();
        if (!player) {
            return;
        }

        if (!guild) {
            return;
        }

        TriggerServerEvent(ServerEvent.QBCORE_SET_METADATA, 'whatif_guild', guild);

        await emitRpc(
            RpcServerEvent.PLAYER_TELEPORT,
            'UHU_WHAT_IF_REPAWN_' + guild + '_' + getRandomInt(0, WhatIf2RespawnPoints[guild].length - 1)
        );

        const outfit = getRandomItem(Object.values(WhatIf2Cloakroom[player.skin.Model.Hash]));

        outfit.Props = {
            [Prop.Hat]: { Clear: true },
            [Prop.Glasses]: { Clear: true },
            [Prop.Ear]: { Clear: true },
            [Prop.LeftHand]: { Clear: true },
            [Prop.RightHand]: { Clear: true },
        };

        TriggerServerEvent(ServerEvent.CHARACTER_SET_CLOTHES, outfit);
        TriggerServerEvent(ServerEvent.WHAT_IF_GIVE_DEFAULT_ITEMS);
    }

    @OnEvent(ClientEvent.WHAT_IF_UHU)
    async onUhu() {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        TriggerServerEvent(ServerEvent.CHARACTER_SET_JOB_CLOTHES, null);
    }

    @OnEvent(ClientEvent.INVENTORY_UNSUBSCRIBE)
    public closeInventory() {
        this.inventoryAnimationRunner?.cancel(AnimationStopReason.Finished);
        this.inventoryAnimationRunner = null;
    }

    private async safeZoneLoop() {
        while (this.inSafeZone) {
            await wait(0);
            //disable firing and aim
            DisablePlayerFiring(PlayerId(), true);
            DisableControlAction(0, 24, true);
            DisableControlAction(0, 25, true);
            DisableControlAction(0, 29, true);
            DisableControlAction(0, 44, true);
            DisableControlAction(1, 37, true);
            DisableControlAction(0, 47, true);
            DisableControlAction(0, 58, true);
            DisableControlAction(0, 140, true);
            DisableControlAction(0, 141, true);
            DisableControlAction(0, 142, true);
            DisableControlAction(0, 143, true);
            DisableControlAction(0, 263, true);
            DisableControlAction(0, 264, true);
            DisableControlAction(0, 257, true);
        }
    }

    private async getOutSafeZone() {
        const start = Date.now();
        const playerEntity = PlayerPedId();

        // remove damage for 3 minutes
        SetEntityInvincible(playerEntity, true);
        SetPlayerInvincible(PlayerId(), true);
        // eslint-disable-next-line no-constant-condition
        while (true) {
            await wait(0);
            const duration = Date.now() - start;

            // player goes back to safe zone make it not
            // or duration has exceeded 3 minutes
            if (this.inSafeZone || duration > 180_000) {
                SetEntityInvincible(playerEntity, false);
                SetPlayerInvincible(PlayerId(), false);

                return;
            }
        }
    }

    @OnGameEvent(GameEvent.CEventNetworkEntityDamage)
    async onPlayerVictim(victim: number, attacker: number): Promise<void> {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        if (this.isInfected) return;
        if (!victim || !attacker) return;

        const playerPed = PlayerPedId();
        const attackerModel = GetEntityModel(attacker);

        if (playerPed !== victim) return;

        if (ZombieModelHash.every(model => model !== attackerModel)) return;

        this.closeInventory();

        if (getRandomInt(0, 100) > 20) return;

        this.isInfected = true;
        this.isInfectedAt = Date.now();
    }

    @OnEvent(ClientEvent.PLAYER_ON_DEATH)
    async clearIsInfected() {
        this.isInfected = false;
        this.blurService.remove('zombie-infected', 0);
    }

    @OnEvent(ClientEvent.WHAT_IF_USE_HAZMAT)
    async onUseHazmat() {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        const player = this.playerService.getPlayer();
        if (!player) {
            return;
        }

        const model = GetEntityModel(PlayerPedId());

        const outfit = LsmcCloakroom[model][HAZMAT_OUTFIT_NAME];

        if (player.cloth_config.JobClothSet?.Components?.[Component.Bag]) {
            outfit.Components[Component.Bag] = player.cloth_config.JobClothSet?.Components?.[Component.Bag];
        }

        const progress = await this.playerWardrobe.waitProgress(false);
        if (progress.completed) {
            TriggerServerEvent(ServerEvent.CHARACTER_SET_JOB_CLOTHES, outfit, true);
        }
    }

    @OnEvent(ClientEvent.WHAT_IF_USE_BAG)
    async onUseBag(bagId: number) {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        TriggerServerEvent(
            ServerEvent.CHARACTER_SET_JOB_CLOTHES,
            {
                Components: { [Component.Bag]: { Drawable: bagId, Texture: 0, Palette: 0 } },
                Props: {},
            },
            true,
            false
        );
    }

    @OnEvent(ClientEvent.WHAT_IF_USE_ZOMBIE_SERUM)
    async onUseSerum() {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        if (!this.isInfected) {
            return;
        }

        this.isInfected = false;
        this.notifier.notify(`Vous avez réussis a vous injecter un sérum a temps !`);
        this.blurService.remove('zombie-infected', 500);
    }

    @OnEvent(ClientEvent.WHAT_IF_OPEN_HAMMER)
    async onOpenHammer() {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        const props = await emitRpc(RpcServerEvent.WHAT_IF_GET_HAMMER_PROPS);
        this.nuiMenu.openMenu(MenuType.WhatIfHammer, props);
    }

    @OnNuiEvent(NuiEvent.WhatIfHammerSelectPropToRemove)
    public async onSelectPropToRemove() {
        if (this.hammerDebugEntity) {
            DeleteEntity(this.hammerDebugEntity);
            this.hammerDebugEntity = 0;
        }
        this.propHighlightService.unhighlightAllEntities();
    }

    @OnNuiEvent(NuiEvent.WhatIfHammerSelectPlacedProp)
    public async onSelectProp(id: string) {
        this.propHighlightService.unhighlightAllEntities();
        if (!id) {
            return;
        }
        const entity = this.objectProvider.getEntityFromId(id);
        if (!entity) {
            return;
        }
        this.propHighlightService.highlightEntities([entity]);
    }

    @OnNuiEvent(NuiEvent.WhatIfHammerToggleMouseSelection)
    public async toggleMouseSelection(value: boolean) {
        this.isMouseSelectionOn = value;
        if (value) {
            EnterCursorMode();
        } else {
            LeaveCursorMode();
        }
    }

    @OnNuiEvent(NuiEvent.WhatIfHammerSelectPropToCreate)
    public async onSelectPropToCreate(model: string) {
        if (this.hammerDebugEntity) {
            DeleteEntity(this.hammerDebugEntity);
            this.hammerDebugEntity = 0;
        }

        const ped = PlayerPedId();
        const coords = GetOffsetFromEntityInWorldCoords(ped, 0, 2.0, 0);

        this.hammerDebugEntity = CreateObject(model, coords[0], coords[1], coords[2], false, false, false);
        SetEntityAlpha(this.hammerDebugEntity, 200, false);
        SetEntityCollision(this.hammerDebugEntity, false, false);
        SetEntityInvincible(this.hammerDebugEntity, true);
        FreezeEntityPosition(this.hammerDebugEntity, true);
    }

    @OnNuiEvent(NuiEvent.WhatIfHammerChoosePropToCreate)
    public async onChoosePropToCreate(model: string) {
        if (this.hammerDebugEntity) {
            DeleteEntity(this.hammerDebugEntity);
            this.hammerDebugEntity = 0;
        }

        if (model == null) {
            model = await this.inputService.askInput(
                {
                    title: 'Nom du modèle',
                },
                NotEmptyStringValidator
            );

            if (!model) {
                return;
            }

            if (ForbiddenPropModels.includes(joaat(model))) {
                this.notifier.notify(`Ce modèle est interdit`, 'error');
                return;
            }
        }

        const newObj = await this.objectEditorProvider.createOrUpdateObject(GetHashKey(model), {
            allowRotation: true,
            allowScale: true,
            allowToggleCollision: true,
            allowToggleSnap: true,
        });

        if (newObj) {
            const playerCoords = GetEntityCoords(PlayerPedId()) as Vector3;
            if (getDistance(playerCoords, newObj.position) <= MAX_HAMMER_PROPS_DISTANCE) {
                const props = await emitRpc<HammerProp[]>(
                    RpcServerEvent.WHAT_IF_HAMMER_CREATE,
                    model,
                    newObj.position,
                    newObj.matrix,
                    newObj.noCollision
                );
                if (props) {
                    this.nuiDispatch.dispatch('whatif', 'hammer_props', props);
                }
            } else {
                this.notifier.error('~r~Le modèle est trop loin !');
            }
        }
    }

    @OnNuiEvent(NuiEvent.WhatIfHammerRequestDeleteProp)
    public async onDeleteProp(id: string) {
        const props = await emitRpc<HammerProp[]>(RpcServerEvent.WHAT_IF_HAMMER_DELETE, id);
        if (props) {
            this.nuiDispatch.dispatch('whatif', 'hammer_props', props);
        }
    }

    @OnNuiEvent(NuiEvent.WhatIfHammerChoosePlacedPropToEdit)
    public async onEditProp(id: string) {
        const obj = this.objectProvider.getObject(id);
        const newObj = await this.objectEditorProvider.createOrUpdateObject(
            obj.model,
            {
                allowRotation: true,
                allowScale: true,
                allowToggleCollision: true,
                allowToggleSnap: true,
            },
            obj
        );

        if (newObj) {
            const playerCoords = GetEntityCoords(PlayerPedId()) as Vector3;
            if (getDistance(playerCoords, newObj.position) <= MAX_HAMMER_PROPS_DISTANCE) {
                await emitRpc(
                    RpcServerEvent.WHAT_IF_HAMMER_UPDATE,
                    id,
                    newObj.position,
                    newObj.matrix,
                    newObj.noCollision
                );
            } else {
                this.notifier.error('~r~Le modèle est trop loin !');
            }
        }
    }

    @Rpc(RpcClientEvent.WHAT_IF_SPAWN_PEDS)
    async spawnPeds(count: number, overriddenCoords?: Vector3): Promise<number[]> {
        const spawnedPeds: number[] = [];

        const playerCoords = GetEntityCoords(PlayerPedId()) as Vector3;

        for (let i = 0; i < count; i++) {
            await wait(0);

            const coords = this.getZombieSpawnCoords(playerCoords);
            if (!coords && !overriddenCoords) {
                continue;
            }

            const zombieModel = getRandomItem(
                Object.keys(ZombieModels).filter(elem => ZombieModels[elem] || !overriddenCoords)
            );

            await this.resourceLoader.loadModel(zombieModel);

            const pedHandle = CreatePed(
                0,
                zombieModel,
                overriddenCoords ? overriddenCoords[0] : coords[0],
                overriddenCoords ? overriddenCoords[1] : coords[1],
                overriddenCoords ? overriddenCoords[2] : coords[2],
                0.0,
                false,
                false
            );
            if (pedHandle === 0) {
                continue;
            }

            NetworkRegisterEntityAsNetworked(pedHandle);

            if (!NetworkGetEntityIsNetworked(pedHandle)) {
                DeleteEntity(pedHandle);
                continue;
            }

            const netPedHandle = PedToNet(pedHandle);
            if (!netPedHandle) {
                DeleteEntity(pedHandle);
                continue;
            }

            await this.configurePed(pedHandle);

            spawnedPeds.push(netPedHandle);
        }

        return spawnedPeds;
    }

    private getZombieSpawnCoords(playerCoords: Vector3): Vector3 | null {
        let iter = 0;
        let canSpawn = false;

        do {
            const x = playerCoords[0] + getRandomInt(-MAX_SPAWN_DISTANCE, MAX_SPAWN_DISTANCE);
            const y = playerCoords[1] + getRandomInt(-MAX_SPAWN_DISTANCE, MAX_SPAWN_DISTANCE);
            const [valid, posZ] = GetGroundZFor_3dCoord(x, y, playerCoords[2], false);
            if (!valid) {
                iter++;
                continue;
            }

            if (
                (x > playerCoords[0] - MIN_SPAWN_DISTANCE && x < playerCoords[0] + MIN_SPAWN_DISTANCE) ||
                (y > playerCoords[1] - MIN_SPAWN_DISTANCE && y < playerCoords[1] + MIN_SPAWN_DISTANCE)
            ) {
                canSpawn = false;
            } else if (
                Object.values(WhatIfSafeZones).every(zone => !zone.isPointInside([x, y, posZ])) &&
                Object.values(WhatIf2ShopPosition).every(pos => getDistance([x, y, posZ], pos) >= 500)
            ) {
                return [x, y, posZ];
            }

            iter++;
        } while (!canSpawn && iter < 30);

        return null;
    }

    @Tick(TickInterval.EVERY_SECOND)
    async onInfectedCheck() {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        if (!this.isInfected) return;

        const infectionTime = Date.now() - this.isInfectedAt;

        if (this.lastInfectionAnimation < Date.now() - 60000) {
            if (infectionTime < 10 * 60 * 1000) {
                this.blurService.add('zombie-infected', 500);

                await this.playerWalkstyleProvider.updateWalkStyle('drugAlcool', 'move_m@drunk@verydrunk');
                await wait(1000);

                this.blurService.remove('zombie-infected', 500);
            } else if (infectionTime < 5 * 60 * 1000) {
                this.blurService.add('zombie-infected', 500);

                await this.playerWalkstyleProvider.updateWalkStyle('drugAlcool', 'move_m@drunk@moderatedrunk');
                await wait(1000);

                this.blurService.remove('zombie-infected', 500);
            } else if (infectionTime < 60 * 1000) {
                if (getRandomInt(0, 100) <= 5) {
                    SetPedToRagdoll(PlayerPedId(), 1000, 1000, 0, false, false, false);
                }

                this.blurService.add('zombie-infected', 500);

                await this.playerWalkstyleProvider.updateWalkStyle('drugAlcool', 'move_m@drunk@slightlydrunk');
                await wait(1000);

                this.blurService.remove('zombie-infected', 500);
            }

            await this.playerWalkstyleProvider.updateWalkStyle('drugAlcool', null);
            this.lastInfectionAnimation = Date.now();

            const remainingMinutes = 20 + Math.floor((this.isInfectedAt + 60000 - Date.now()) / 60000);
            this.notifier.error(
                `Vous avez été infecté ! Vous avez ~b~${remainingMinutes} minutes~s~ pour trouver et vous injecter un ~b~sérum~s~ avant que la fièvre ne vous consume.`
            );
        }

        if (infectionTime < INFECTED_TIME_BEFORE_DEATH) return;

        this.notifier.error(`Vous avez succombé à vos blessures...`);
        SetEntityHealth(PlayerPedId(), 0);

        this.isInfected = false;
    }

    @Tick(TickInterval.EVERY_SECOND)
    async onPedConfigurationCheck() {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        const playerPed = PlayerPedId();

        for (const pedHandle of GetGamePool('CPed')) {
            if (
                IsPedAPlayer(pedHandle) ||
                IsEntityDead(pedHandle) ||
                !DoesEntityExist(pedHandle) ||
                !NetworkGetEntityIsNetworked(pedHandle) ||
                !NetworkHasControlOfEntity(pedHandle)
            ) {
                continue;
            }

            const model = GetEntityModel(pedHandle);
            if (!ZombieModelHash.includes(model)) {
                continue;
            }

            if (getRandomInt(0, 100) <= 20) {
                const playerCoords = GetEntityCoords(playerPed) as Vector3;
                setTimeout(
                    async () => {
                        if (!DoesEntityExist(pedHandle)) return;

                        const sound = getRandomItem(ZombieSound);
                        if (sound.native) {
                            if (sound.speech) {
                                PlayPedAmbientSpeechWithVoiceNative(
                                    pedHandle,
                                    sound.name,
                                    sound.dict,
                                    'SPEECH_PARAMS_FORCE_SHOUTED',
                                    true
                                );
                            } else {
                                PlaySoundFromEntity(-1, sound.name, pedHandle, sound.dict, true, MAX_SOUND_DISTANCE);
                            }
                        } else {
                            const pedCoords = GetEntityCoords(pedHandle) as Vector3;
                            const playerDistance = getDistance(playerCoords, pedCoords);

                            if (playerDistance > MAX_SOUND_DISTANCE) return;

                            const volume = Math.min(
                                (0.07 * (MAX_SOUND_DISTANCE - playerDistance)) / MAX_SOUND_DISTANCE,
                                0.1
                            );

                            this.soundService.play('zombie/' + sound.name, volume);
                        }
                    },
                    getRandomInt(0, 1000)
                );
            }

            await this.configurePed(pedHandle);
        }
    }

    private async configurePed(pedHandle: number) {
        const model = GetEntityModel(pedHandle);
        const modelStr = Object.keys(ZombieModels).find(elem => joaat(elem) == model);

        if (ZombieModels[modelStr]) {
            SetPedMovementClipset(pedHandle, 'clipset@anim@ingame@move_m@zombie@core', 1.0);
            SetPedUsingActionMode(pedHandle, true, -1, 'clipset@anim@ingame@move_m@zombie@core');
            SetPedStrafeClipset(pedHandle, 'clipset@anim@ingame@move_m@zombie@strafe');
            SetWeaponAnimationOverride(pedHandle, GetHashKey('ZOMBIE'));
        }

        SetPedCanEvasiveDive(pedHandle, false);
        SetPedMoveRateOverride(pedHandle, 10.0);
        SetRunSprintMultiplierForPlayer(pedHandle, 1.49);
        SetEntityMaxSpeed(pedHandle, 10.0);

        DisablePedPainAudio(pedHandle, true);
        StopPedSpeaking(pedHandle, true);
        BlockAllSpeechFromPed(pedHandle, true, true);

        SetPedDiesInWater(pedHandle, false);
        SetPedAlertness(pedHandle, 3);
        SetPedTargetLossResponse(pedHandle, 2);
        SetAmbientVoiceName(pedHandle, 'ALIENS');

        SetPedConfigFlag(pedHandle, 281, false);
        SetPedConfigFlag(pedHandle, 155, false);
        SetPedConfigFlag(pedHandle, 42, true);
        SetPedConfigFlag(pedHandle, 301, true);
        SetPedCombatAttributes(pedHandle, 0, false);
        SetPedCombatAttributes(pedHandle, 4, true);
        SetPedCombatAttributes(pedHandle, 5, true);
        SetPedCombatAttributes(pedHandle, 9, false);
        SetPedCombatAttributes(pedHandle, 13, true);
        SetPedCombatAttributes(pedHandle, 14, true);
        SetPedCombatAttributes(pedHandle, 16, false);
        SetPedCombatAttributes(pedHandle, 17, false);
        SetPedCombatAttributes(pedHandle, 21, true);
        SetPedCombatAttributes(pedHandle, 28, true);
        SetPedCombatAttributes(pedHandle, 31, true);
        SetPedCombatAttributes(pedHandle, 38, true);
        SetPedCombatAttributes(pedHandle, 42, true);
        SetPedCombatAttributes(pedHandle, 46, true);
        SetPedCombatAttributes(pedHandle, 50, true);
        SetPedCombatAttributes(pedHandle, 52, true);
        SetPedCombatAttributes(pedHandle, 58, true);
        SetPedCombatAttributes(pedHandle, 71, true);
        SetPedFleeAttributes(pedHandle, 0, false);

        ApplyPedDamagePack(pedHandle, 'BigHitByVehicle', 1.0, 9.0);
        ApplyPedDamagePack(pedHandle, 'SCR_Dumpster', 1.0, 9.0);
        ApplyPedDamagePack(pedHandle, 'SCR_Torture', 1.0, 9.0);
        ApplyPedDamagePack(pedHandle, 'Splashback_Face_0', 1.0, 9.0);
        ApplyPedDamagePack(pedHandle, 'SCR_Cougar', 1.0, 9.0);
        ApplyPedDamagePack(pedHandle, 'SCR_Shark', 1.0, 9.0);

        SetPedShootRate(pedHandle, 1000);
        SetPedInfiniteAmmoClip(pedHandle, true);
        SetPedCombatMovement(pedHandle, 2);
        SetPedCombatRange(pedHandle, 0);
        SetPedCombatAbility(pedHandle, 1);
        SetPedSeeingRange(pedHandle, 30);
        SetPedHearingRange(pedHandle, 50);
        SetCanAttackFriendly(pedHandle, false, false);

        if (IsPedInMeleeCombat(pedHandle) && !GetIsTaskActive(pedHandle, 160) && !GetIsTaskActive(pedHandle, 163)) {
            const target = Citizen.invokeNative('0x5C4AABA3E6CEBF7F', pedHandle) as number;
            const vehicle = GetVehiclePedIsIn(target, false);
            if (vehicle) {
                let seat = 0;
                for (let i = -1; i < GetVehicleMaxNumberOfPassengers(vehicle); i++) {
                    if (GetPedInVehicleSeat(vehicle, i) === target) {
                        seat = i;
                        break;
                    }
                }
                SetPedRelationshipGroupHash(pedHandle, GetHashKey(this.zombieVehicleRelation));
                TaskEnterVehicle(pedHandle, vehicle, -1, seat, 2.0, 524288 + 8, 0);
            }
        } else if (
            !GetIsTaskActive(pedHandle, 241) &&
            !GetIsTaskActive(pedHandle, 160) &&
            !GetIsTaskActive(pedHandle, 163)
        ) {
            SetPedRelationshipGroupHash(pedHandle, GetHashKey(this.zombieRelation));
            TaskWanderStandard(pedHandle, 1.0, 10);
        }
        SetEntityAsMissionEntity(pedHandle, true, true);
    }

    @Tick()
    async onMapTick() {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        SetFakePausemapPlayerPositionThisFrame(0.0, 0.0);
        ClearGpsPlayerWaypoint();
    }

    private async openCloakroom(config: WardrobeConfig) {
        const player = this.playerService.getPlayer();
        if (!player) {
            return;
        }

        if (!config) {
            return;
        }

        const outfitSelection = await this.playerWardrobe.selectOutfit(config, 'Tenue de survivant');
        if (outfitSelection.canceled) {
            return;
        }

        const progress = await this.playerWardrobe.waitProgress(false);
        if (!progress.completed) {
            return;
        }

        if (player.cloth_config.JobClothSet?.Components?.[Component.Bag]) {
            TriggerServerEvent(ServerEvent.CHARACTER_SET_JOB_CLOTHES, {
                Components: {
                    [Component.Bag]: player.cloth_config.JobClothSet?.Components?.[Component.Bag],
                },
            } as Outfit);
        } else {
            TriggerServerEvent(ServerEvent.CHARACTER_SET_JOB_CLOTHES, null);
        }

        if (!outfitSelection.outfit) {
            return;
        }

        TriggerServerEvent(ServerEvent.CHARACTER_SET_CLOTHES, outfitSelection.outfit);
    }

    computeInventoryId(prefix: string, entity: number) {
        if (prefix === 'zombie') {
            const netId = PedToNet(entity);
            return `zombie_${netId}`;
        }

        const coords = GetEntityCoords(entity) as Vector3;
        const coordsHash = getExtendedLocationHash(coords);
        return prefix + '_' + coordsHash;
    }

    @OnNuiEvent(NuiEvent.PlayerMenuWhatIf2Retrieval)
    public async onRetrieval() {
        const player = this.playerService.getPlayer();
        if (!player || player.metadata.isdead) {
            this.notifier.error('Rapatriement impossible en étant coma');
            return;
        }

        const validate = await this.inputService.askConfirm(
            'Confimer le raptriement (oui), ⚠️Vous perdrez tout ce que vous avez pu récupérer excepter votre marteau'
        );

        if (!validate) {
            return;
        }

        if (!player.metadata.whatif_guild) {
            return;
        }

        this.playerPositionProvider.teleportPlayerToPosition(
            'UHU_WHAT_IF_REPAWN_' +
                player.metadata.whatif_guild +
                '_' +
                getRandomInt(0, WhatIf2RespawnPoints[player.metadata.whatif_guild].length - 1)
        );

        TriggerServerEvent(ServerEvent.WHAT_IF_GIVE_DEFAULT_ITEMS, true);
    }

    @OnNuiEvent(NuiEvent.PlayerMenuWhatIfRemoveHazmat)
    public async onRemoveHazmat() {
        const { completed } = await this.progressService.progress('remove_hazmat', '', 5000, {
            dictionary: 'anim@mp_yacht@shower@male@',
            name: 'male_shower_towel_dry_to_get_dressed',
            flags: 15,
        });

        if (!completed) {
            return;
        }

        const player = this.playerService.getPlayer();
        if (!player) {
            return;
        }

        if (player.cloth_config.JobClothSet?.Components?.[Component.Bag]) {
            TriggerServerEvent(ServerEvent.CHARACTER_SET_JOB_CLOTHES, {
                Components: {
                    [Component.Bag]: player.cloth_config.JobClothSet?.Components?.[Component.Bag],
                },
            } as Outfit);
        } else {
            TriggerServerEvent(ServerEvent.CHARACTER_SET_JOB_CLOTHES, null);
        }
    }

    @OnEvent(ClientEvent.LSMC_REVIVE)
    public async revive(skipanim: boolean, uniteHU: boolean) {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        if (skipanim || uniteHU) {
            return;
        }

        await this.playerWalkstyleProvider.updateWalkStyle('injury', 'move_injured_generic');
        const end = Date.now() + 120_000;
        while (Date.now() < end) {
            DisableControlAction(0, Control.Sprint, true);
            await wait(0);
        }
        await this.playerWalkstyleProvider.updateWalkStyle('injury', null);
    }

    private peds = new Map<number, Vector4>();
    private vehs = new Map<number, number>();

    @OnEvent(ClientEvent.WHAT_IF_CINEMATIC)
    private async onCinematic() {
        this.blurService.remove('dead', 0);
        StopScreenEffect('DeathFailOut');

        DoScreenFadeOut(500);
        await wait(500);

        this.camera = this.cameraService.createCameraAtPosition([5080.76, -4735.67, 7.15], 60);
        this.cameraService.setCameraActive(this.camera, true);
        this.cameraService.setCameraPointAt(this.camera, [-553.84, -641.39, 35.27]);
        this.cameraService.renderCamera(0);

        DoScreenFadeIn(500);
        await wait(500);

        this.hudStateProvider.setCinematicMode(true, 5000);

        this.cameraService.updateCameraPosition(this.camera, [4714.54, -4528.05, 30.42], [0, 0, 0], 10000);
        this.cameraService.renderCamera();

        this.playerHealthProvider.setNutritionDisabled(true);
        this.hudStateProvider.setHudVisible(false);
        await this.voipService.mutePlayer(true);

        let midVehId = 0;

        for (const coords of WHAT_IF_HELIS) {
            const index = WHAT_IF_HELIS.indexOf(coords);

            const ped = await this.pedFactory.createPed({
                model: 'mp_m_freemode_01',
                coords: toVector4Object(coords),
                network: false,
                blockevents: true,
                invincible: true,
                skin: {
                    Model: {
                        Hash: 0,
                        Father: 0,
                        Mother: 0,
                        ShapeMix: 0,
                        SkinMix: 0,
                    },
                    Hair: {
                        HairColor: 61,
                        HairSecondaryColor: 54,
                    },
                },
            });
            SetPedConfigFlag(ped, 35, false);
            SetPedMovementClipset(ped, 'move_m@multiplayer', 0.0);

            this.peds.set(ped, [...Parade.end, 0]);

            const hash = GetHashKey('lazer');
            await this.resourceLoader.loadModel(hash);
            const vehicle = CreateVehicle(hash, coords[0], coords[1], coords[2], coords[3], false, false);
            this.vehicleService.applyVehicleConfiguration(vehicle, getDefaultVehicleConfiguration());
            SetVehicleEngineOn(vehicle, true, true, false);
            this.vehs.set(ped, vehicle);
            TaskWarpPedIntoVehicle(ped, vehicle, VehicleSeat.Driver);
            SetPlaneTurbulenceMultiplier(vehicle, 0);
            ControlLandingGear(vehicle, 3);

            if (index === 10) {
                midVehId = vehicle;
            }

            this.resourceLoader.unloadModel(hash);
        }

        for (const [ped, pedVehs] of this.vehs.entries()) {
            ClearPedTasks(ped);
            TaskWarpPedIntoVehicle(ped, pedVehs, VehicleSeat.Driver);
        }

        await wait(500);

        for (const [ped, dest] of this.peds.entries()) {
            const veh = this.vehs.get(ped);
            if (veh) {
                TaskVehicleDriveToCoord(ped, veh, dest[0], dest[1], dest[2], 60, 0, 0, 16777216, 1, -1.0);
            }
        }

        await wait(10000);
        this.cameraService.updateCameraPosition(this.camera, [3987.4, -3646.3, 124.0], [0, 0, 0], 5000);

        AttachCamToEntity(this.camera, midVehId, 0.0, -60.0, 10.0, false);

        await wait(20000);
        DoScreenFadeOut(2000);
    }

    @Once(OnceStep.Stop)
    private onStop() {
        for (const [ped, veh] of this.vehs.entries()) {
            DeleteVehicle(veh);
            this.pedFactory.unspawnEntity(ped);
        }

        this.peds.clear();
        this.vehs.clear();

        this.cameraService.deleteAllCameras();
    }
}
