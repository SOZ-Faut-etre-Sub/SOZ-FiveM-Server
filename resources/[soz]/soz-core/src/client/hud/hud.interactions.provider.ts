import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { uuidv4 } from '../../core/utils';
import { HubInteraction, HubInteractionOption } from '../../shared/hud';
import { Control } from '../../shared/input';
import { getDistance, Vector3 } from '../../shared/polyzone/vector';
import { ResourceLoader } from '../repository/resource.loader';

const DRAW_DISTANCE = 7;
const INTERACTION_DISTANCE = 1.5;

const spriteWidth = 0.25 / 16;
const spriteHeight = 0.25 / 9;

@Provider()
export class HudInteractionsProvider {
    @Inject(ResourceLoader)
    private readonly resourceLoader: ResourceLoader;

    private interactions: Record<string, HubInteraction> = {};

    public createInteractionForCoords(coords: Vector3, option: HubInteractionOption) {
        this.interactions[uuidv4()] = {
            coords,
            option,
        };
    }

    public createInteractionForEntity(entity: number, option: HubInteractionOption) {
        this.interactions[uuidv4()] = {
            entity,
            option,
        };
    }

    @Tick()
    public async onTick() {
        for (const [, interaction] of Object.entries(this.interactions)) {
            const entity = interaction.entity;
            let coords = interaction.coords;

            if (!coords && !entity) {
                continue;
            }

            if (entity) {
                coords = GetEntityCoords(entity, false) as Vector3;
            }

            const playerPosition = GetEntityCoords(PlayerPedId(), false) as Vector3;

            if (getDistance(playerPosition, coords) > DRAW_DISTANCE) {
                return;
            }

            SetDrawOrigin(coords[0], coords[1], coords[2], 0);

            if (getDistance(playerPosition, coords) <= INTERACTION_DISTANCE) {
                DrawSprite('soz_minimap', 'interaction_pin', 0, 0, spriteWidth, spriteHeight, 0, 255, 255, 255, 100);
                SetTextScale(0.0, 0.25);
                SetTextEntry('STRING');
                AddTextComponentString(interaction.option.label);
                DrawText(0.01, -0.01);

                DisableControlAction(0, Control.Context, true);

                if (IsDisabledControlJustPressed(0, Control.Context)) {
                    interaction.option.action(entity);
                }
            } else {
                DrawSprite('soz_minimap', 'interaction_pin', 0, 0, spriteWidth, spriteHeight, 0, 255, 255, 255, 255);
            }

            ClearDrawOrigin();
        }
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
