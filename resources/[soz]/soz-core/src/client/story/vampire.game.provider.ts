import { Once, OnceStep, OnEvent } from '@public/core/decorators/event';
import { wait } from '@public/core/utils';

import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { emitRpc } from '../../core/rpc';
import { ClientEvent } from '../../shared/event/client';
import { ServerEvent } from '../../shared/event/server';
import { Feature } from '../../shared/features';
import {
    VampireGameClientState,
    VampireGameCollection,
    VampireGameCollectionLabel,
    VampireGameCollectionSprite,
    VampireGameRole,
} from '../../shared/halloween';
import { PlayerClientState } from '../../shared/player';
import { toVector3Object, Vector3 } from '../../shared/polyzone/vector';
import { RpcServerEvent } from '../../shared/rpc';
import { BlipFactory } from '../blip';
import { FeatureProvider } from '../feature/feature.provider';
import { InstructionalService } from '../instructional.service';
import { PlayerListStateService } from '../player/player.list.state.service';
import { InteractionProvider } from '../quick-interaction/interaction.provider';
import { TargetFactory } from '../target/target.factory';
import { BlurService } from '../utils/blur.service';

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
                    if (this.state.role !== VampireGameRole.Vampire) return false;

                    const targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));

                    if (!this.playerListStateService.isKnockedOut(targetSource)) return false;

                    const targetState = await emitRpc<PlayerClientState>(
                        RpcServerEvent.PLAYER_GET_CLIENT_STATE,
                        targetSource
                    );

                    return targetState.halloweenRole === VampireGameRole.Mortal;
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

        if (role === VampireGameRole.Ghoul) {
            SetPedArmour(ped, 100);
        }

        this.instructionalService.display(['Tu es désormais', role]);

        await wait(5000);
        this.instructionalService.clear();
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

    private async onGameStart() {
        const player = PlayerPedId();
        FreezeEntityPosition(player, true);
        SwitchOutPlayer(player, 0, 2);

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
    }
}
