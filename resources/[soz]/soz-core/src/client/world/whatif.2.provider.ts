import { emitRpc } from '@public/core/rpc';
import { Feature } from '@public/shared/features';
import { RpcServerEvent } from '@public/shared/rpc';

import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { wait } from '../../core/utils';
import { AnimationStopReason } from '../../shared/animation';
import { InventoryType } from '../../shared/inventory';
import { getLocationHash } from '../../shared/locationhash';
import { Vector3 } from '../../shared/polyzone/vector';
import { WhatIfSafeZone } from '../../shared/whatif';
import { AnimationService } from '../animation/animation.service';
import { FeatureProvider } from '../feature/feature.provider';
import { InventoryManager } from '../inventory/inventory.manager';
import { Notifier } from '../notifier';
import { PlayerInOutService } from '../player/player.inout.service';
import { TargetFactory } from '../target/target.factory';
import { WeaponService } from '../weapon/weapon.service';

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

    private inSafeZone = false;
    private zombieRelation = 'ZombieAggressive';

    @Once(OnceStep.Start)
    async onStart() {
        if (!this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            return;
        }

        const playerBlip = GetMainPlayerBlipId();
        const northBlip = GetNorthRadarBlip();

        SetBlipAlpha(playerBlip, 0);
        SetBlipAlpha(northBlip, 0);

        this.playerInOutService.add('SafeZone', WhatIfSafeZone, isInside => {
            this.weapon.setDisabled('hub', isInside);
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

        this.targetFactory.createForAllPed(
            [
                {
                    label: 'Fouiller',
                    icon: 'police/fouiller',
                    category: 'citizen',
                    event: 'whatif:2',
                    action: async (entity: number) => {
                        const id = this.computeZombieInventory(entity);
                        TaskTurnPedToFaceEntity(PlayerPedId(), entity, 800);
                        await wait(800);

                        PlaySoundFrontend(-1, 'Collect_Pickup', 'DLC_IE_PL_Player_Sounds', true);
                        const cancelled = await this.animationService.playScenario({
                            name: 'CODE_HUMAN_MEDIC_TEND_TO_DEAD',
                            duration: 4000,
                        });

                        if (
                            cancelled === AnimationStopReason.Finished &&
                            (await emitRpc<boolean>(RpcServerEvent.WHAT_IF_ZOMBIE_IS_NOT_LOCKED, id))
                        ) {
                            const playerPed = PlayerPedId();
                            const coords = GetEntityCoords(playerPed);

                            this.inventoryManager.openInventory(InventoryType.Zombie, id, coords as Vector3);
                        }
                    },
                    canInteract: async (entity: number) => {
                        if (!IsEntityDead(entity) || IsPedAPlayer(entity)) return false;

                        const id = this.computeZombieInventory(entity);
                        return emitRpc<boolean>(RpcServerEvent.WHAT_IF_ZOMBIE_IS_NOT_LOCKED, id);
                    },
                },
            ],
            10
        );

        SetPedMeleeCombatLimits(10, 10, 10);

        AddRelationshipGroup(this.zombieRelation);
        SetRelationshipBetweenGroups(0, GetHashKey(this.zombieRelation), GetHashKey(this.zombieRelation));
        SetRelationshipBetweenGroups(5, GetHashKey(this.zombieRelation), GetHashKey('PLAYER'));
        SetRelationshipBetweenGroups(3, GetHashKey('PLAYER'), GetHashKey(this.zombieRelation));
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

    computeZombieInventory(entity: number) {
        const coords = GetEntityCoords(entity) as Vector3;
        const coordsHash = getLocationHash(coords);
        return 'zombie_' + coordsHash;
    }
}
