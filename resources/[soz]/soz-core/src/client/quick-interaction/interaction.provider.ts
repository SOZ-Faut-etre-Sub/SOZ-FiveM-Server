import { Command } from '@core/decorators/command';
import { Once, OnceStep } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Tick, TickInterval } from '@core/decorators/tick';
import { uuidv4 } from '@core/utils';
import { InteractionDistanceProvider } from '@public/client/quick-interaction/interaction.distance.provider';
import { InteractionOffsetProvider } from '@public/client/quick-interaction/interaction.offset.provider';

import { Interaction, InteractionOption } from '../../shared/interaction';
import { getDistance, Vector3, Vector4 } from '../../shared/polyzone/vector';
import { ResourceLoader } from '../repository/resource.loader';
import { TargetService } from '../target/target.service';

type GamePoolObject = { entity: number; originalCoords: Vector3; coords: Vector3 };

@Provider()
export class InteractionProvider {
    @Inject(ResourceLoader)
    private readonly resourceLoader: ResourceLoader;

    @Inject(InteractionOffsetProvider)
    private readonly interactionOffsetProvider: InteractionOffsetProvider;

    @Inject(InteractionDistanceProvider)
    private readonly interactionDistanceProvider: InteractionDistanceProvider;

    @Inject(TargetService)
    private readonly targetService: TargetService;

    private gamePoolObjects: Record<number, GamePoolObject[]> = {};

    private interactions = new Map<string, Interaction>();
    private nearbyInteractions = new Map<string, Interaction>();
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
        interactionDistance?: number,
        drawDistance?: number
    ): string {
        const id = uuidv4();
        this.interactions.set(id, { id, coords, ...option });
        this.interactionDistanceProvider.updateDrawDistance(id, drawDistance);
        this.interactionDistanceProvider.updateInteractionDistance(id, interactionDistance);
        return id;
    }

    public createInteractionForModels(
        model: number,
        option: InteractionOption,
        searchCoords?: Vector3,
        interactionDistance?: number,
        drawDistance?: number
    ): string {
        const id = uuidv4();
        this.interactions.set(id, { id, model, searchCoords, ...option });
        this.interactionDistanceProvider.updateDrawDistance(id, drawDistance);
        this.interactionDistanceProvider.updateInteractionDistance(id, interactionDistance);
        return id;
    }

    public createInteractionForEntity(
        entity: number,
        option: InteractionOption,
        interactionDistance?: number,
        drawDistance?: number
    ): string {
        const id = uuidv4();
        this.interactions.set(id, { id, entity, ...option });
        this.interactionDistanceProvider.updateDrawDistance(id, drawDistance);
        this.interactionDistanceProvider.updateInteractionDistance(id, interactionDistance);
        return id;
    }

    public deleteInteraction(id: string): void {
        this.interactions.delete(id);
        this.nearbyInteractions.delete(id);
        if (this.nearbyInteraction?.id === id) this.nearbyInteraction = null;
    }

    @Tick(10 * TickInterval.EVERY_SECOND)
    public async updateGamePoolObjects() {
        this.gamePoolObjects = {};

        for (const object of GetGamePool('CObject')) {
            const model = GetEntityModel(object);

            if (!this.gamePoolObjects[model]) {
                this.gamePoolObjects[model] = [];
            }

            this.gamePoolObjects[model].push({
                entity: object,
                originalCoords: GetEntityCoords(object, false) as Vector3,
                coords: this.interactionOffsetProvider.getEntityCoordsWithOffset(object),
            });
        }
    }

    @Tick(1000)
    public async listNearbyInteractions() {
        for (const [id, interaction] of this.interactions.entries()) {
            const [entity, coords] = this.getInteractionCoords(interaction);
            if (!coords) continue;

            const distance = getDistance(this.playerPosition, coords);
            if (distance > this.interactionDistanceProvider.getDrawDistance(id)) continue;

            const isValid = await this.targetService.validateInteraction(interaction, entity);
            if (!isValid) continue;

            let interactionWithEntityAlreadyExists = false;

            for (const nearbyInteraction of this.nearbyInteractions.values()) {
                if (entity && entity === nearbyInteraction.entity) {
                    interactionWithEntityAlreadyExists = true;
                }
            }

            if (interactionWithEntityAlreadyExists) continue;

            this.nearbyInteractions.set(id, { ...interaction, entity });
        }
    }

    @Tick()
    public async onTick() {
        if (this.nearbyInteractions.size === 0) return;

        for (const [id, interaction] of this.nearbyInteractions.entries()) {
            const [, coords] = this.getInteractionCoords(interaction);
            if (!coords) continue;

            const distance = getDistance(this.playerPosition, coords);
            if (distance > this.interactionDistanceProvider.getDrawDistance(id)) {
                this.nearbyInteractions.delete(id);
                if (this.nearbyInteraction?.id === id) this.nearbyInteraction = null;
                continue;
            }

            const nearbyInteractionAlreadyExists = this.nearbyInteraction && this.nearbyInteraction.id !== id;

            SetDrawOrigin(coords[0], coords[1], coords[2], 0);

            if (
                nearbyInteractionAlreadyExists ||
                distance > this.interactionDistanceProvider.getInteractionDistance(id)
            ) {
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

                if (this.nearbyInteraction?.id === id) this.nearbyInteraction = null;
                continue;
            }

            if (nearbyInteractionAlreadyExists) {
                continue;
            }

            const labelSize = interaction.label.length * 0.004;
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

        if (distance > this.interactionDistanceProvider.getInteractionDistance(this.nearbyInteraction.id)) return;

        this.nearbyInteraction.action(entity);
        this.nearbyInteractions.clear();
        this.nearbyInteraction = null;
    }

    protected getInteractionCoords(interaction: Interaction): [number, Vector3] {
        if (interaction.entity) {
            return [interaction.entity, this.interactionOffsetProvider.getEntityCoordsWithOffset(interaction.entity)];
        }

        if (interaction.coords) {
            return [null, interaction.coords as Vector3];
        }

        if (interaction.model) {
            const playerPosition = this.playerPosition;

            const closedEntities = this.gamePoolObjects[interaction.model]
                ?.filter(({ originalCoords }) => {
                    if (!interaction.searchCoords) return true;

                    return (
                        getDistance(originalCoords, interaction.searchCoords) <=
                        this.interactionDistanceProvider.getInteractionDistance(interaction.id) + 0.5
                    );
                })
                ?.map(({ entity, originalCoords, coords }) => ({
                    entity,
                    originalCoords,
                    coords,
                    distance: getDistance(playerPosition, coords),
                }))
                ?.sort((a, b) => a.distance - b.distance);

            if (!closedEntities || closedEntities.length === 0) return [null, null];

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
        this.interactions.clear();
        this.nearbyInteractions.clear();
        this.nearbyInteraction = null;
    }
}
