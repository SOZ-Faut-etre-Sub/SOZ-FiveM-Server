import { Command } from '@core/decorators/command';
import { Once, OnceStep } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Tick, TickInterval } from '@core/decorators/tick';
import { uuidv4 } from '@core/utils';
import { InteractionOffsetProvider } from '@public/client/quick-interaction/interaction.offset.provider';

import { Interaction, InteractionOption } from '../../shared/interaction';
import { getDistance, Vector3, Vector4 } from '../../shared/polyzone/vector';
import { ResourceLoader } from '../repository/resource.loader';
import { TargetService } from '../target/target.service';

const DRAW_DISTANCE = 7;
const INTERACTION_DISTANCE = 1.5;

@Provider()
export class InteractionProvider {
    @Inject(ResourceLoader)
    private readonly resourceLoader: ResourceLoader;

    @Inject(InteractionOffsetProvider)
    private readonly interactionOffsetProvider: InteractionOffsetProvider;

    @Inject(TargetService)
    private readonly targetService: TargetService;

    private interactions: Record<string, Interaction> = {};
    private nearbyInteractions: Map<string, Interaction> = new Map();
    private nearbyInteraction: Interaction = null;

    private readonly interactionSprite = {
        onoff: {
            size: 0.25,
            width: 0.25 / 16,
            height: 0.25 / 9,
        },
        start: {
            x: 0.015 / 16,
            width: 0.03 / 16,
            height: 0.25 / 9,
        },
        content: {
            height: 0.25 / 9,
        },
        end: {
            x: 0.015 / 16,
            width: 0.035 / 16,
            height: 0.25 / 9,
        },
    };

    public createInteractionForCoords(
        coords: Vector3 | Vector4,
        option: InteractionOption,
        interactionDistance = INTERACTION_DISTANCE,
        drawDistance = DRAW_DISTANCE
    ): string {
        const id = uuidv4();
        this.interactions[id] = {
            coords,
            drawDistance,
            interactionDistance,
            ...option,
        };
        return id;
    }

    public createInteractionForModels(
        models: number[],
        option: InteractionOption,
        interactionDistance = INTERACTION_DISTANCE,
        drawDistance = DRAW_DISTANCE
    ): string {
        const id = uuidv4();
        this.interactions[id] = {
            models,
            drawDistance,
            interactionDistance,
            ...option,
        };
        return id;
    }

    @Tick(TickInterval.EVERY_SECOND)
    public async listNearbyInteractions() {
        if (this.nearbyInteraction) return;

        for (const [id, interaction] of Object.entries(this.interactions)) {
            const [entity, coords] = this.getInteractionCoords(interaction);
            if (!coords) continue;

            const distance = getDistance(this.playerPosition, coords);

            if (distance > interaction.drawDistance) continue;

            const isValid = await this.targetService.validateInteraction(interaction, entity);
            if (!isValid) continue;

            this.nearbyInteractions.set(id, { ...interaction, entity });
        }
    }

    @Tick()
    public async onTick() {
        if (this.nearbyInteractions.size === 0) return;

        for (const interaction of this.nearbyInteractions.values()) {
            const [, coords] = this.getInteractionCoords(interaction);
            if (!coords) return;

            const distance = getDistance(this.playerPosition, coords);

            if (distance > interaction.drawDistance) {
                this.resetNearbyInteraction();
                return;
            }

            SetDrawOrigin(coords[0], coords[1], coords[2], 0);

            if (distance > interaction.interactionDistance) {
                DrawSprite(
                    'soz_minimap',
                    'interaction_off',
                    0,
                    0,
                    this.interactionSprite.onoff.width,
                    this.interactionSprite.onoff.height,
                    0,
                    255,
                    255,
                    255,
                    255
                );
                ClearDrawOrigin();
                return;
            }

            const labelSize = interaction.label.length * 0.005;
            const contentX = (labelSize + this.interactionSprite.onoff.size / 2) / 16 + labelSize / 2;

            DrawSprite(
                'soz_minimap',
                'interaction_on',
                0,
                0,
                this.interactionSprite.onoff.width,
                this.interactionSprite.onoff.height,
                0,
                255,
                255,
                255,
                255
            );

            DrawSprite(
                'soz_minimap',
                'interaction_start',
                contentX - labelSize / 2 - this.interactionSprite.start.x,
                0,
                this.interactionSprite.start.width,
                this.interactionSprite.start.height,
                0,
                255,
                255,
                255,
                255
            );
            DrawSprite(
                'soz_minimap',
                'interaction_content',
                contentX,
                0,
                labelSize,
                this.interactionSprite.content.height,
                0,
                255,
                255,
                255,
                255
            );
            DrawSprite(
                'soz_minimap',
                'interaction_end',
                contentX + labelSize / 2 + this.interactionSprite.start.x,
                0,
                this.interactionSprite.end.width,
                this.interactionSprite.end.height,
                0,
                255,
                255,
                255,
                255
            );

            SetTextScale(0.0, this.interactionSprite.onoff.size);
            SetTextEntry('STRING');
            AddTextComponentString(interaction.label);
            DrawText(0.011, -0.0105);

            ClearDrawOrigin();

            this.nearbyInteraction = interaction;
        }
    }

    @Command('soz-quick-interaction', {
        description: "Lancer l'interaction rapide",
        keys: [{ mapper: 'keyboard', key: 'LMENU' }],
    })
    public async runInteraction(): Promise<void> {
        if (!this.nearbyInteraction) return;

        const [entity, coords] = this.getInteractionCoords(this.nearbyInteraction);
        const distance = getDistance(this.playerPosition, coords);

        if (distance > this.nearbyInteraction.interactionDistance) return;

        this.nearbyInteraction.action(entity);
        this.resetNearbyInteraction();
    }

    protected resetNearbyInteraction() {
        this.nearbyInteractions = new Map();
        this.nearbyInteraction = null;
    }

    protected getInteractionCoords(interaction: Interaction): [number, Vector3] {
        if (interaction.entity) {
            return [interaction.entity, this.interactionOffsetProvider.getEntityCoordsWithOffset(interaction.entity)];
        }

        if (interaction.coords) {
            return [null, interaction.coords as Vector3];
        }

        if (interaction.models) {
            const playerPosition = this.playerPosition;

            const entities = [];

            const objects: number[] = GetGamePool('CObject');
            for (const object of objects) {
                const objectCoords = GetEntityCoords(object, false) as Vector3;
                if (getDistance(playerPosition, objectCoords) > interaction.drawDistance) continue;

                const model = GetEntityModel(object);
                if (!interaction.models.includes(model)) continue;

                entities.push(object);
            }

            if (!entities.length) return [null, null];

            const closedEntities = entities
                .map(entity => {
                    const coords = this.interactionOffsetProvider.getEntityCoordsWithOffset(entity);

                    return {
                        entity,
                        coords,
                        distance: getDistance(playerPosition, coords),
                    };
                })
                .sort((a, b) => a.distance - b.distance);

            if (!closedEntities.length) return;

            return [closedEntities[0].entity, closedEntities[0].coords];
        }

        return [null, null];
    }

    protected get playerPosition(): Vector3 {
        return GetEntityCoords(PlayerPedId(), false) as Vector3;
    }

    @Once(OnceStep.Start)
    public async onServerStart() {
        await this.resourceLoader.loadStreamedTextureDict('soz_minimap');
    }

    @Once(OnceStep.Stop)
    public async onServerStop() {
        this.interactions = {};
        this.nearbyInteractions = new Map();
    }
}
