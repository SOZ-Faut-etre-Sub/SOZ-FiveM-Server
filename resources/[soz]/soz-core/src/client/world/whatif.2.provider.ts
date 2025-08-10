import { emitRpc } from '@public/core/rpc';
import { Feature } from '@public/shared/features';
import { RpcServerEvent } from '@public/shared/rpc';

import { On, Once, OnceStep, OnEvent, OnGameEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { wait } from '../../core/utils';
import { AnimationStopReason } from '../../shared/animation';
import { WardrobeConfig } from '../../shared/cloth';
import { CraftsList } from '../../shared/craft/craft';
import { ClientEvent } from '../../shared/event/client';
import { GameEvent } from '../../shared/event/game';
import { NuiEvent } from '../../shared/event/nui';
import { ServerEvent } from '../../shared/event/server';
import { InventoryType } from '../../shared/inventory';
import { joaat } from '../../shared/joaat';
import { getLocationHash } from '../../shared/locationhash';
import { Vector3 } from '../../shared/polyzone/vector';
import { getRandomInt, getRandomItem } from '../../shared/random';
import {
    WhatIf2Cloakroom,
    WhatIf2CraftingTables,
    WhatIf2Lockers,
    WhatIf2LootInventoryType,
    WhatIf2LootModels,
    WhatIf2RespawnPoints,
    WhatIfGuild,
    WhatIfSafeZones,
} from '../../shared/whatif';
import { AnimationRunner } from '../animation/animation.factory';
import { AnimationService } from '../animation/animation.service';
import { FeatureProvider } from '../feature/feature.provider';
import { InventoryManager } from '../inventory/inventory.manager';
import { Notifier } from '../notifier';
import { NuiDispatch } from '../nui/nui.dispatch';
import { ObjectProvider } from '../object/object.provider';
import { PlayerInOutService } from '../player/player.inout.service';
import { PlayerListStateService } from '../player/player.list.state.service';
import { PlayerService } from '../player/player.service';
import { PlayerWardrobe } from '../player/player.wardrobe';
import { zombieModel } from '../story/zombie.provider';
import { TargetFactory } from '../target/target.factory';
import { BlurService } from '../utils/blur.service';
import { WeaponService } from '../weapon/weapon.service';

const INFECTED_TIME_BEFORE_DEATH = 20 * 60 * 1000; // 20 minutes

@Provider()
export class WhatIf2Provider {
    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

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

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    private inSafeZone = false;
    private zombieRelation = 'ZombieAggressive';

    private isInfected = false;
    private isInfectedAt = 0;

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
        SetRelationshipBetweenGroups(0, GetHashKey(this.zombieRelation), GetHashKey(this.zombieRelation));
        SetRelationshipBetweenGroups(5, GetHashKey(this.zombieRelation), GetHashKey('PLAYER'));
        SetRelationshipBetweenGroups(3, GetHashKey('PLAYER'), GetHashKey(this.zombieRelation));
    }

    private safeZoneSetup() {
        Object.entries(WhatIfSafeZones).forEach(([guild, zone]) => {
            this.playerInOutService.add(`SafeZone-${guild}`, zone, isInside => {
                this.weapon.setDisabled('SafeZone', isInside);
                this.inSafeZone = isInside;

                this.safeZoneLoop();

                if (isInside) {
                    this.notifier.notify(
                        'Ici, les murs tiennent encore. Un maigre rempart contre l’enfer extérieur.~n~' +
                            'Aucune créature, aucune arme, aucune trahison n’a sa place entre ces barrières.~n~' +
                            ' Reprenez votre souffle, échangez, préparez-vous… car au-delà de cette limite, c’est la survie, rien d’autre.',
                        'info',
                        20000
                    );
                }
            });
        });

        Object.entries(WhatIf2Lockers).forEach(([guild, lockers]) => {
            lockers.forEach((locker, index) => {
                this.objectProvider.createObject(
                    {
                        id: `whatif-lockers-${guild}-${index}`,
                        model: joaat('ch_prop_ch_service_locker_02a'),
                        position: locker,
                    },
                    [
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
                        this.inventoryAnimationRunner = this.animationService.playScenario({
                            name: 'CODE_HUMAN_MEDIC_TEND_TO_DEAD',
                        });

                        const playerPed = PlayerPedId();
                        const coords = GetEntityCoords(playerPed);

                        this.inventoryManager.openInventory(WhatIf2LootInventoryType[lootType], id, coords as Vector3);
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
                        this.inventoryAnimationRunner = this.animationService.playScenario({
                            name: 'CODE_HUMAN_MEDIC_TEND_TO_DEAD',
                        });

                        const playerPed = PlayerPedId();
                        const coords = GetEntityCoords(playerPed);

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
                    this.inventoryAnimationRunner = this.animationService.playScenario({
                        name: 'CODE_HUMAN_MEDIC_TEND_TO_DEAD',
                    });

                    await wait(4000);

                    const playerPed = PlayerPedId();
                    const coords = GetEntityCoords(playerPed);

                    this.inventoryManager.openInventory(
                        InventoryType.Player,
                        'player_' + targetCitizenId,
                        coords as Vector3
                    );
                },
                canInteract: async (entity: number) => {
                    const targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));

                    return this.playerListStateService.isDead(targetSource);
                },
            },
        ]);
    }

    @Once(OnceStep.NuiLoaded)
    @On(ClientEvent.WHAT_IF_RELOAD_GUILD)
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

        this.nuiDispatch.dispatch('whatif', 'OpenWelcomePage', true);
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
        this.nuiDispatch.dispatch('whatif', 'OpenWelcomePage', false);

        await emitRpc(
            RpcServerEvent.PLAYER_TELEPORT,
            'UHU_WHAT_IF_REPAWN_' + guild + '_' + getRandomInt(0, WhatIf2RespawnPoints[guild].length - 1)
        );

        const outfit = getRandomItem(Object.values(WhatIf2Cloakroom[player.skin.Model.Hash]));
        TriggerServerEvent(ServerEvent.CHARACTER_SET_JOB_CLOTHES, outfit);
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

    @OnGameEvent(GameEvent.CEventNetworkEntityDamage)
    async onPlayerVictim(victim: number, attacker: number): Promise<void> {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        if (this.isInfected) return;

        const playerPed = PlayerPedId();
        const attackerModel = GetEntityModel(attacker);

        if (playerPed !== victim) return;

        if (attackerModel !== joaat(zombieModel)) return;
        if (getRandomInt(0, 100) > 20) return;

        this.isInfected = true;
        this.isInfectedAt = Date.now();

        this.blurService.add('zombie-infected', 500);
        this.notifier.error(
            `Vous avez été infecté ! Vous avez ~b~20 minutes~s~ pour trouver et vous injecter un ~b~sérum~s~ avant que la fièvre ne vous consume.`
        );
    }

    @OnEvent(ClientEvent.PLAYER_ON_DEATH)
    async clearIsInfected() {
        this.isInfected = false;
        this.blurService.remove('zombie-infected', 0);
    }

    @On(ClientEvent.WHAT_IF_USE_ZOMBIE_SERUM)
    async onUseSerum() {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        this.isInfected = false;
        this.notifier.notify(`Vous avez réussis a vous injecter un sérum a temps !`);
        this.blurService.remove('zombie-infected', 500);
    }

    @Tick(TickInterval.EVERY_SECOND)
    async onInfectedCheck() {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        if (!this.isInfected) return;

        if (getRandomInt(0, 100) <= 10) {
            await this.animationService.playAnimation(
                {
                    base: {
                        dictionary: 'random@drunk_driver_1',
                        name: 'vomit_outside',
                        options: {
                            onlyUpperBody: true,
                        },
                        duration: 2000,
                    },
                },
                {
                    cancellable: false,
                }
            );
        }

        if (Date.now() - this.isInfectedAt < INFECTED_TIME_BEFORE_DEATH) return;

        SetEntityHealth(PlayerPedId(), 0);

        this.isInfected = false;
        this.blurService.remove('zombie-infected', 500);
    }

    @Tick(TickInterval.EVERY_SECOND)
    async onPedConfigurationCheck() {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        for (const pedHandle of GetGamePool('CPed')) {
            if (IsPedAPlayer(pedHandle) || !NetworkHasControlOfEntity(pedHandle)) {
                continue;
            }

            SetPedMovementClipset(pedHandle, 'move_m@drunk@moderatedrunk', 1.5);

            SetCanAttackFriendly(pedHandle, true, true);
            SetPedCanEvasiveDive(pedHandle, false);
            SetPedMoveRateOverride(pedHandle, 10.0);
            SetRunSprintMultiplierForPlayer(pedHandle, 1.49);

            DisablePedPainAudio(pedHandle, true);
            StopPedSpeaking(pedHandle, true);

            SetPedCombatAttributes(pedHandle, 0, false);
            SetPedCombatAttributes(pedHandle, 4, true);
            SetPedCombatAttributes(pedHandle, 5, true);
            SetPedCombatAttributes(pedHandle, 9, false);
            SetPedCombatAttributes(pedHandle, 13, true);
            SetPedCombatAttributes(pedHandle, 14, true);
            SetPedCombatAttributes(pedHandle, 21, true);
            SetPedCombatAttributes(pedHandle, 38, true);
            SetPedCombatAttributes(pedHandle, 42, true);
            SetPedCombatAttributes(pedHandle, 46, true);
            SetPedCombatAttributes(pedHandle, 50, true);
            SetPedFleeAttributes(pedHandle, 0, false);

            // GiveWeaponToPed(pedHandle, 'weapon_pistol', 1000, false, true);
            // SetCurrentPedWeapon(pedHandle, 'weapon_pistol', true);
            // SetPedDropsWeaponsWhenDead(pedHandle, false);

            SetPedShootRate(pedHandle, 1000);
            SetPedInfiniteAmmoClip(pedHandle, true);
            SetPedCombatMovement(pedHandle, 2);
            SetPedCombatRange(pedHandle, 0);
            SetPedCombatAbility(pedHandle, 2);
            SetPedSeeingRange(pedHandle, 200);
            SetPedHearingRange(pedHandle, 100);

            SetPedRelationshipGroupHash(pedHandle, GetHashKey(this.zombieRelation));
        }
    }

    private async openCloakroom(config: WardrobeConfig) {
        if (!config) {
            return;
        }

        const outfitSelection = await this.playerWardrobe.selectOutfit(config);
        if (outfitSelection.canceled) {
            return;
        }

        const progress = await this.playerWardrobe.waitProgress(false);
        if (!progress.completed) {
            return;
        }

        if (outfitSelection.outfit) {
            TriggerServerEvent(ServerEvent.CHARACTER_SET_JOB_CLOTHES, outfitSelection.outfit);
        } else {
            TriggerServerEvent(ServerEvent.CHARACTER_SET_JOB_CLOTHES, null);
        }
    }

    computeInventoryId(prefix: string, entity: number) {
        const coords = GetEntityCoords(entity) as Vector3;
        const coordsHash = getLocationHash(coords);
        return prefix + '_' + coordsHash;
    }
}
