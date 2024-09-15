import { Command } from '@core/decorators/command';
import { Once, OnceStep } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Tick, TickInterval } from '@core/decorators/tick';
import { uuidv4 } from '@core/utils';

import { Interaction, InteractionOption } from '../../shared/interaction';
import { getDistance, Vector3, Vector4 } from '../../shared/polyzone/vector';
import { ResourceLoader } from '../repository/resource.loader';
import { TargetService } from '../target/target.service';

const DRAW_DISTANCE = 7;
const INTERACTION_DISTANCE = 1.5;

const INTERACTION_SIZE = 0.25;
const spriteWidth = INTERACTION_SIZE / 16;
const spriteHeight = INTERACTION_SIZE / 9;

const INTERACTION_SPRITE_CONTENT_WIDTH = 0.0375;

@Provider()
export class InteractionProvider {
    @Inject(ResourceLoader)
    private readonly resourceLoader: ResourceLoader;

    @Inject(TargetService)
    private readonly targetService: TargetService;

    private interactions: Record<string, Interaction> = {};
    private nearbyInteraction: Interaction = null;

    public createInteractionForCoords(
        coords: Vector3 | Vector4,
        option: InteractionOption,
        interactionDistance = INTERACTION_DISTANCE,
        drawDistance = DRAW_DISTANCE
    ) {
        this.interactions[uuidv4()] = {
            coords,
            drawDistance,
            interactionDistance,
            ...option,
        };
    }

    @Tick(TickInterval.EVERY_SECOND)
    public async listNearbyInteractions() {
        if (this.nearbyInteraction) return;

        for (const interaction of Object.values(this.interactions)) {
            const coords = interaction.coords;
            if (!coords) continue;

            const playerPosition = GetEntityCoords(PlayerPedId(), false) as Vector3;
            const distance = getDistance(playerPosition, coords);

            if (distance > interaction.drawDistance) continue;

            const isValid = await this.targetService.validateInteraction(interaction);
            if (!isValid) continue;

            this.nearbyInteraction = interaction;
            return;
        }
    }

    @Tick()
    public async onTick() {
        if (!this.nearbyInteraction) return;

        const coords = this.nearbyInteraction.coords;

        const playerPosition = GetEntityCoords(PlayerPedId(), false) as Vector3;
        const distance = getDistance(playerPosition, coords);

        if (distance > this.nearbyInteraction.drawDistance) {
            this.resetNearbyInteraction();
            return;
        }

        SetDrawOrigin(coords[0], coords[1], coords[2], 0);

        if (distance > this.nearbyInteraction.interactionDistance) {
            DrawSprite('soz_minimap', 'interaction_off', 0, 0, spriteWidth, spriteHeight, 0, 255, 255, 255, 255);
            ClearDrawOrigin();
            return;
        }

        const contentX =
            (INTERACTION_SPRITE_CONTENT_WIDTH + INTERACTION_SIZE / 2) / 16 + INTERACTION_SPRITE_CONTENT_WIDTH / 2;

        DrawSprite('soz_minimap', 'interaction_on', 0, 0, spriteWidth, spriteHeight, 0, 255, 255, 255, 255);
        DrawSprite(
            'soz_minimap',
            'interaction_content',
            contentX,
            0,
            INTERACTION_SPRITE_CONTENT_WIDTH,
            spriteHeight,
            0,
            255,
            255,
            255,
            255
        );

        SetTextScale(0.0, INTERACTION_SIZE);
        SetTextEntry('STRING');
        AddTextComponentString(this.nearbyInteraction.label);
        DrawText(0.0122, -0.0105);

        ClearDrawOrigin();
    }

    @Command('soz-quick-interaction', {
        description: "Lancer l'interaction rapide",
        keys: [{ mapper: 'keyboard', key: 'LMENU' }],
    })
    public async runInteraction(): Promise<void> {
        if (!this.nearbyInteraction) return;

        const playerPosition = GetEntityCoords(PlayerPedId(), false) as Vector3;
        const distance = getDistance(playerPosition, this.nearbyInteraction.coords);

        if (distance > this.nearbyInteraction.interactionDistance) return;

        this.nearbyInteraction.action();
        this.resetNearbyInteraction();
    }

    protected resetNearbyInteraction() {
        this.nearbyInteraction = null;
    }

    @Once(OnceStep.Start)
    public async onServerStart() {
        await this.resourceLoader.loadStreamedTextureDict('soz_minimap');
    }

    @Once(OnceStep.Stop)
    public async onServerStop() {
        this.interactions = {};
    }
}
