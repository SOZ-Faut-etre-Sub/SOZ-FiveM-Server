import { emitRpc } from '@public/core/rpc';

import { ZEventClothes } from '../../config/clothes/zevent';
import { Inject } from '../../core/decorators/injectable';
import { PlayerClothesInventoryUpdate } from '../../core/decorators/player';
import { Provider } from '../../core/decorators/provider';
import { Outfit, WardrobeConfig } from '../../shared/cloth';
import { InventoryItem } from '../../shared/inventory';
import { RpcServerEvent } from '../../shared/rpc';
import { AnimationService } from '../animation/animation.service';
import { PlayerService } from './player.service';

@Provider()
export class PlayerClothesProvider {
    @Inject(PlayerService)
    private readonly playerService: PlayerService;

    @Inject(AnimationService)
    private readonly animationService: AnimationService;

    @PlayerClothesInventoryUpdate()
    async onClothesUpdate(items: Record<number, InventoryItem>) {
        const player = this.playerService.getPlayer();
        if (!player) return;

        const baseOutfit: Outfit = player.cloth_config.NakedClothSet;

        for (const item of Object.values(items)) {
            const outfit = this.getItemOutfit(item);
            if (!outfit) continue;

            if (outfit.Components) {
                for (const [componentId, component] of Object.entries(outfit.Components)) {
                    baseOutfit.Components[componentId] = component;
                }
            }

            if (outfit.Props) {
                for (const [propId, prop] of Object.entries(outfit.Props)) {
                    baseOutfit.Props[propId] = prop;
                }
            }
        }

        await this.animationService.playAnimation({
            base: {
                dictionary: 'anim@mp_yacht@shower@male@',
                name: 'male_shower_towel_dry_to_get_dressed',
                duration: 3000,
                blendInSpeed: 8.0,
                blendOutSpeed: -8.0,
                options: {
                    onlyUpperBody: true,
                    enablePlayerControl: true,
                },
            },
        });
        await emitRpc(RpcServerEvent.PLAYER_CLOTHES_UPDATE, baseOutfit);
    }

    private getItemOutfit(item: InventoryItem): Outfit {
        const ZEventOutfit = this.getOutfitFromWardrobeConfig(ZEventClothes, item);
        if (ZEventOutfit) return ZEventOutfit;

        return {
            Components: item.metadata.components,
            Props: item.metadata.props,
        };
    }

    private getOutfitFromWardrobeConfig(config: WardrobeConfig, item: InventoryItem): Outfit | null {
        if (!config) return null;

        const player = this.playerService.getPlayer();
        if (!player) return null;

        const wardrobe = config[player.skin.Model.Hash];
        if (!wardrobe) return null;

        const outfit = wardrobe[item.name];
        if (!outfit) return null;

        return outfit;
    }
}
