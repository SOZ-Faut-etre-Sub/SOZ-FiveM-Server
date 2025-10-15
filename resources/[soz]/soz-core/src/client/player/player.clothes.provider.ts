import { emitRpc } from '@public/core/rpc';

import { Inject } from '../../core/decorators/injectable';
import { PlayerClothesInventoryUpdate } from '../../core/decorators/player';
import { Provider } from '../../core/decorators/provider';
import { Outfit } from '../../shared/cloth';
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

        const outfit: Outfit = player.cloth_config.NakedClothSet;

        for (const item of Object.values(items)) {
            if (item.metadata.components) {
                for (const [componentId, component] of Object.entries(item.metadata.components)) {
                    outfit.Components[componentId] = component;
                }
            }

            if (item.metadata.props) {
                for (const [propId, prop] of Object.entries(item.metadata.props)) {
                    outfit.Props[propId] = prop;
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
        await emitRpc(RpcServerEvent.PLAYER_CLOTHES_UPDATE, outfit);
    }
}
