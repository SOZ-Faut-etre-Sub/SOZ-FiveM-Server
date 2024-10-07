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
import { InteractionProvider } from '../quick-interaction/interaction.provider';
import { TargetFactory } from '../target/target.factory';

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

    private blipDisabled = new Set<string>();
    private objectiveInteractions = new Set<string>();
    private state: VampireGameClientState = {
        inWaitingRoom: false,
        started: false,
        role: null,
        objective: null,
    };

    @Once(OnceStep.PlayerLoaded)
    async onStart() {
        if (!this.featureProvider.isFeatureEnabled(Feature.Halloween)) return;

        this.targetFactory.createForAllPlayer([
            {
                label: 'Sucer',
                category: 'citizen',
                canInteract: async entity => {
                    if (!this.state.started) return false;
                    const targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    const targetState = await emitRpc<PlayerClientState>(
                        RpcServerEvent.PLAYER_GET_CLIENT_STATE,
                        targetSource
                    );

                    return targetState.halloweenRole === VampireGameRole.Mortal;
                },
                action: async entity => {
                    const targetSource = GetPlayerServerId(NetworkGetPlayerIndexFromPed(entity));
                    TriggerServerEvent(ServerEvent.HALLOWEEN_VAMPIRE_GAME_CONVERT_PLAYER, targetSource);
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
