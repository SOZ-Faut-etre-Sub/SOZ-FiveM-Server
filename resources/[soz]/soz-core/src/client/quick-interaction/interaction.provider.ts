import { Command } from '../../core/decorators/command';
import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { uuidv4 } from '../../core/utils';
import { Interaction, InteractionOption } from '../../shared/interaction';
import { getDistance, Vector3, Vector4 } from '../../shared/polyzone/vector';
import { ResourceLoader } from '../repository/resource.loader';
import { TargetService } from '../target/target.service';

const DRAW_DISTANCE = 7;
const INTERACTION_DISTANCE = 1.5;

const INTERACTION_SIZE = 0.25;
const spriteWidth = INTERACTION_SIZE / 16;
const spriteHeight = INTERACTION_SIZE / 9;

@Provider()
export class InteractionProvider {
    @Inject(ResourceLoader)
    private readonly resourceLoader: ResourceLoader;

    @Inject(TargetService)
    private readonly targetService: TargetService;

    private interactions: Record<string, Interaction> = {};
    private nearbyInteraction: Interaction = null;

    public createInteractionForCoords(coords: Vector3 | Vector4, option: InteractionOption) {
        this.interactions[uuidv4()] = {
            coords,
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

            if (distance > DRAW_DISTANCE) continue;

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

        if (distance > DRAW_DISTANCE) {
            this.resetNearbyInteraction();
        }

        SetDrawOrigin(coords[0], coords[1], coords[2], 0);

        if (distance > INTERACTION_DISTANCE) {
            DrawSprite('soz_minimap', 'interaction_off', 0, 0, spriteWidth, spriteHeight, 0, 255, 255, 255, 255);
            ClearDrawOrigin();
            return;
        }

        DrawSprite('soz_minimap', 'interaction_on', 0, 0, spriteWidth, spriteHeight, 0, 255, 255, 255, 255);

        const contentWidth = this.nearbyInteraction.label.length * 0.0075;

        DrawSprite(
            'soz_minimap',
            'interaction_content',
            (spriteWidth + INTERACTION_SIZE / 2) / 16 + contentWidth / 2,
            0,
            contentWidth,
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
        DrawText(0.0122, -0.011);

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

        if (distance > INTERACTION_DISTANCE) return;

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
