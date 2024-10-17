import { Once, OnceStep, OnEvent, OnGameEvent } from '@public/core/decorators/event';
import { wait } from '@public/core/utils';

import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { ClientEvent } from '../../shared/event/client';
import { GameEvent } from '../../shared/event/game';
import { ServerEvent } from '../../shared/event/server';
import { Feature } from '../../shared/features';
import {
    VampireGameClientState,
    VampireGameCollection,
    VampireGameCollectionLabel,
    VampireGameCollectionSprite,
    VampireGameEnemyRoles,
    VampireGameRole,
} from '../../shared/halloween';
import { PlayerClientState } from '../../shared/player';
import { toVector3Object, Vector3 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { WeaponName } from '../../shared/weapons/weapon';
import { BlipFactory } from '../blip';
import { FeatureProvider } from '../feature/feature.provider';
import { InstructionalService } from '../instructional.service';
import { Notifier } from '../notifier';
import { PlayerListStateService } from '../player/player.list.state.service';
import { PlayerService } from '../player/player.service';
import { InteractionProvider } from '../quick-interaction/interaction.provider';
import { SkinService } from '../skin/skin.service';
import { TargetFactory } from '../target/target.factory';
import { BlurService } from '../utils/blur.service';
import { WeaponService } from '../weapon/weapon.service';

@Provider()
export class VampireGameProvider {
    @Inject(InstructionalService)
    private readonly instructionalService: InstructionalService;

    @Inject(InteractionProvider)
    private readonly interactionProvider: InteractionProvider;

    @Inject(TargetFactory)
    private readonly targetFactory: TargetFactory;

    @Inject(FeatureProvider)
    private readonly featureProvider: FeatureProvider;

    @Inject(BlipFactory)
    private readonly blipFactory: BlipFactory;

    @Inject(PlayerListStateService)
    private readonly playerListStateService: PlayerListStateService;

    @Inject(BlurService)
    private readonly blurService: BlurService;

    @Inject(SkinService)
    private readonly skinService: SkinService;

    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Inject(WeaponService)
    private readonly weaponService: WeaponService;

    @Inject(Notifier)
    private readonly notifier: Notifier;

    private blipDisabled = new Set<string>();
    private objectiveInteractions = new Set<string>();
    private vampirePositionBlip = new Set<string>();
    private state: VampireGameClientState = {
        inWaitingRoom: false,
        started: false,
        role: null,
        objective: null,
    };

    public isGameRunning() {
        return this.state.started;
    }

    public async handleOnDeath() {
        if (!this.state.started) return;
        if (this.playerListStateService.isKnockedOut(GetPlayerServerId(PlayerId()))) return;

        this.blurService.add('dead', 5);
        StartScreenEffect('DeathFailOut', 0, true);

        if (VampireGameEnemyRoles.includes(this.state.role)) {
            this.instructionalService.display([
                'Tu as failli à ta tâche...',
                "Ton vampire va te réanimer d'ici quelques secondes",
            ]);
        } else {
            this.instructionalService.display(["Tu es au sol, prie pour qu'un vampire ne te suce pas !"]);
        }

        TriggerServerEvent(ServerEvent.HALLOWEEN_VAMPIRE_GAME_PLAYER_KNOCKED_OUT);
    }

    @Once(OnceStep.PlayerLoaded)
    async onStart() {
        if (!this.featureProvider.isFeatureEnabled(Feature.Halloween)) return;

        this.targetFactory.createForAllPlayer([
            {
                label: 'Sucer',
                icon: 'halloween/vampire',
                category: 'citizen',
                canInteract: async entity => {
                    if (!this.state.started) return false;
                    if (!VampireGameEnemyRoles.includes(this.state.role)) return false;

                    const targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));

                    if (!this.playerListStateService.isKnockedOut(targetSource)) return false;

                    const targetState = await emitRpc<PlayerClientState>(
                        RpcServerEvent.PLAYER_GET_CLIENT_STATE,
                        targetSource
                    );

                    return !VampireGameEnemyRoles.includes(targetState.halloweenRole);
                },
                action: async entity => {
                    const targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    TriggerServerEvent(
                        ServerEvent.HALLOWEEN_VAMPIRE_GAME_CONVERT_PLAYER,
                        targetSource,
                        VampireGameRole.Ghoul
                    );
                },
            },
            {
                label: 'Soigner',
                icon: 'ems/heal',
                category: 'citizen',
                canInteract: async entity => {
                    if (!this.state.started) return false;
                    if (this.state.role !== VampireGameRole.Alchemist) return false;

                    const targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));

                    if (!this.playerListStateService.isKnockedOut(targetSource)) return false;

                    const targetState = await emitRpc<PlayerClientState>(
                        RpcServerEvent.PLAYER_GET_CLIENT_STATE,
                        targetSource
                    );

                    return targetState.halloweenRole === VampireGameRole.Ghoul;
                },
                action: async entity => {
                    const targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    TriggerServerEvent(
                        ServerEvent.HALLOWEEN_VAMPIRE_GAME_CONVERT_PLAYER,
                        targetSource,
                        VampireGameRole.Mortal
                    );
                },
            },
        ]);
    }

    @OnEvent(ClientEvent.HALLOWEEN_VAMPIRE_UPDATE_STATE)
    public async onGameStateUpdate(state: Partial<VampireGameClientState>) {
        if (this.state.started && !state.started) {
            await this.onGameEnd();
        }

        this.state = { ...this.state, ...state };

        if (this.state.inWaitingRoom && !this.state.started) {
            await this.onGameStart();
        }

        this.syncObjective(this.state.objective);
        await this.syncModel(this.state.role);
        await this.displayRoleObjective(this.state.role);
    }

    @OnEvent(ClientEvent.HALLOWEEN_VAMPIRE_PLAYER_CONVERTED)
    public async onPlayerConverted(role: VampireGameRole) {
        const ped = PlayerPedId();
        const pos = GetEntityCoords(ped);
        const heading = GetEntityHeading(ped);

        StopScreenEffect('DeathFailOut');
        this.blurService.remove('dead', 1000);

        NetworkResurrectLocalPlayer(pos[0], pos[1], pos[2], heading, 1, false);
        SetEntityHealth(ped, 200);

        this.instructionalService.display(['Tu es désormais', role]);

        await wait(5000);
        this.instructionalService.clear();

        await this.syncModel(role);
        await this.displayRoleObjective(this.state.role);
    }

    @OnEvent(ClientEvent.HALLOWEEN_VAMPIRE_UPDATE_OBJECTIVE)
    public syncObjective(objective: Record<VampireGameCollection, Vector3[]>) {
        this.state.objective = objective;

        this.objectiveInteractions.forEach(interaction => {
            this.interactionProvider.deleteInteraction(interaction);
            this.blipFactory.remove(`halloween_vampire_objective_${interaction}`);
        });
        this.objectiveInteractions.clear();

        for (const [collection, objectives] of Object.entries(this.state.objective ?? {})) {
            for (const objective of objectives) {
                const interactionId = this.interactionProvider.createInteractionForCoords(
                    [objective[0], objective[1], objective[2] + 0.7],
                    {
                        label: VampireGameCollectionLabel(collection as VampireGameCollection),
                        action: entity => {
                            TaskTurnPedToFaceEntity(PlayerPedId(), entity, 500);

                            TriggerServerEvent(
                                ServerEvent.HALLOWEEN_VAMPIRE_GAME_TAKE_OBJECTIVE,
                                this.state.role,
                                collection,
                                objective
                            );
                        },
                    },
                    2,
                    15
                );

                this.objectiveInteractions.add(interactionId);
                this.blipFactory.create(
                    `halloween_vampire_objective_${interactionId}`,
                    {
                        name: VampireGameCollectionLabel(collection as VampireGameCollection),
                        coords: toVector3Object(objective),
                        sprite: VampireGameCollectionSprite(collection as VampireGameCollection),
                        color: 1,
                    },
                    true
                );
            }
        }
    }

    @OnEvent(ClientEvent.HALLOWEEN_VAMPIRE_UPDATE_ENEMY_POSITION)
    public syncEnemyPosition(positions: Vector3[]) {
        this.vampirePositionBlip.forEach(blipName => {
            this.blipFactory.remove(blipName);
        });
        this.vampirePositionBlip.clear();

        for (const [index, position] of positions.entries()) {
            const blipName = `halloween_vampire_position_${index}`;

            this.blipFactory.create(
                blipName,
                {
                    name: 'Présence de danger',
                    coords: toVector3Object(position),
                    sprite: 1,
                    color: 1,
                },
                true
            );
            this.vampirePositionBlip.add(blipName);
        }
    }

    @OnGameEvent(GameEvent.CEventNetworkEntityDamage)
    async onPlayerAttack(
        victim: number,
        attacker: number,
        _unkInt1: number,
        _unkBool1: number,
        _unkBool2: number,
        _isFatal: boolean,
        weaponHash: number
    ): Promise<void> {
        if (!this.state.started) return;

        const playerPed = PlayerPedId();
        if (playerPed !== attacker) return;

        if (!IsPedAPlayer(victim)) return;

        if (VampireGameEnemyRoles.includes(this.state.role)) {
            const victimId = GetPlayerServerId(NetworkGetPlayerIndexFromPed(victim));
            TriggerServerEvent(ServerEvent.HALLOWEEN_VAMPIRE_GAME_KNOCK_PLAYER, victimId);
        }
    }

    @OnGameEvent(GameEvent.CEventNetworkEntityDamage)
    async onPlayerVictim(
        victim: number,
        attacker: number,
        _unkInt1: number,
        _unkBool1: number,
        _unkBool2: number,
        _isFatal: boolean,
        weaponHash: number
    ): Promise<void> {
        if (!this.state.started) return;

        const damageType = GetWeaponDamageType(weaponHash);

        const playerPed = PlayerPedId();
        if (playerPed !== victim) return;

        if (this.state.role === VampireGameRole.Vampire && damageType > 1) {
            if (weaponHash === GetHashKey('weapon_musket')) {
                SetEntityHealth(playerPed, 0);
            } else {
                SetEntityHealth(playerPed, GetPedMaxHealth(playerPed));
            }
        }
    }

    private async onGameStart() {
        const player = PlayerPedId();
        FreezeEntityPosition(player, true);
        SwitchOutPlayer(player, 0, 2);

        this.weaponService.setDisabled('vampire-game', true);

        for (const [name] of this.blipFactory.getAll().entries()) {
            if (
                name.startsWith('halloween_vampire_objective_') ||
                this.blipFactory.isHidden(name) ||
                this.blipDisabled.has(name)
            ) {
                continue;
            }

            this.blipDisabled.add(name);
            this.blipFactory.hide(name, true);
        }
        this.blipFactory.qbHide('job_pawl', true);
        this.blipFactory.qbHide('job_upw', true);

        this.instructionalService.display(['Tu es désormais', this.state.role]);

        do {
            await wait(0);
        } while (this.state.inWaitingRoom && !this.state.started);

        this.instructionalService.clear();
        SwitchInPlayer(player);
        FreezeEntityPosition(player, false);
    }

    private async onGameEnd() {
        this.blipDisabled.forEach(name => {
            this.blipFactory.hide(name, false);
        });
        this.blipFactory.qbHide('job_pawl', false);
        this.blipFactory.qbHide('job_upw', false);
        this.blipDisabled.clear();

        for (let i = 0; i < 10; i++) {
            ForceLightningFlash();
            await wait(10);
        }

        this.weaponService.setDisabled('vampire-game', false);
        this.instructionalService.clear();
        await this.syncModel(null);
    }

    private async syncModel(role: VampireGameRole) {
        await this.weaponService.clear();
        this.playerService.setNbArmorPlates(0);

        const player = PlayerPedId();
        const weapon = GetHashKey(WeaponName.MUSKET);
        const weaponAmmo = 500;

        if (role === VampireGameRole.Vampire) {
            await this.skinService.setModel('vampmonster');
        } else if (role === VampireGameRole.Ghoul) {
            await this.skinService.setModel('ghoul');

            SetPedArmour(PlayerPedId(), 100);
            this.playerService.setNbArmorPlates(3);
        } else if (role === VampireGameRole.Hunter) {
            GiveWeaponToPed(player, weapon, weaponAmmo, false, true);
            SetPedAmmo(player, weapon, weaponAmmo);
            SetCurrentPedWeapon(player, weapon, true);
        } else {
            // Reset ped and clothes
            TriggerEvent('soz-character:Client:ApplyCurrentSkin');
            TriggerEvent('soz-character:Client:ApplyCurrentClothConfig');
        }
    }

    private async displayRoleObjective(role: VampireGameRole) {
        switch (role) {
            case VampireGameRole.Vampire:
                this.instructionalService.display([
                    "Dirige-toi en ville pour empêcher les survivants de rallumer l'électricité, et suce pour gagner des pouvoirs.",
                ]);
                break;
            case VampireGameRole.Hunter:
                this.instructionalService.display([
                    'En tant que Chasseur, tu peux tuer les Vampires à l’aide de ton Mousquet et tes Balles en Argent.',
                ]);
                break;
            case VampireGameRole.Mortal:
                this.instructionalService.display([
                    "Dirige-toi en ville pour réparer l'électricité, et survie aux monstres.",
                ]);
                break;
            case VampireGameRole.Squire:
                this.instructionalService.display([
                    'En tant qu’Écuyère, tu as le pouvoir de sentir la présence des vampires sur ta carte. Aide les Chasseurs à trouver les vampires et protège les Mortels.',
                ]);
                break;
            case VampireGameRole.Alchemist:
                this.instructionalService.display([
                    'En tant qu’Alchimiste, tu as le pouvoir de réanimer les Goules en Mortel. Soigne-les dès que tu le peux.',
                ]);
                break;
        }

        await wait(5000);
        this.instructionalService.clear();
    }
}
