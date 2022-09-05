import { Inject, Injectable } from '../../core/decorators/injectable';
import { PlayerService } from '../player/player.service';

@Injectable()
export class InventoryManager {
    @Inject(PlayerService)
    private playerService: PlayerService;

    public hasEnoughItem(itemId: string, amount?: number): boolean {
        const items = this.playerService.getPlayer().items;

        if (Array.isArray(items)) {
            for (const item of items) {
                if (item.name === itemId) {
                    if (amount) {
                        return item.amount >= amount;
                    }

                    return true;
                }
            }
        } else {
            for (const slot of Object.keys(items)) {
                const item = items[slot];

                if (item.name === itemId) {
                    if (amount) {
                        return item.amount >= amount;
                    }

                    return true;
                }
            }
        }
        return false;
    }
}
