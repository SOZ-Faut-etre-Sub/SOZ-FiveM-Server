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

@Provider()
export class InteractionProvider {
    @Inject(ResourceLoader)
    private readonly resourceLoader: ResourceLoader;

    @Inject(TargetService)
    private readonly targetService: TargetService;

    private interactions: Record<string, Interaction> = {};
    private nearbyInteraction: Interaction = null;

    private readonly interactionSprite = {
        onoff: {
            size: 0.25,
            width: 0.25 / 16,
            height: 0.25 / 9,
        },
        start: {
            x: 0.03 / 16,
            width: 0.03 / 16,
            height: 0.25 / 9,
        },
        content: {
            height: 0.25 / 9,
        },
        end: {
            x: 0.03,
            width: 0.03 / 16,
            height: 0.25 / 9,
        },
    };

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

        const labelSize = this.nearbyInteraction.label.length * 0.005;
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
            contentX - labelSize / 2 - this.interactionSprite.start.width / 16,
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
            contentX + labelSize / 2,
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
        AddTextComponentString(this.nearbyInteraction.label);
        DrawText(0.011, -0.0105);

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
