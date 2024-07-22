import { Inject } from '@public/core/decorators/injectable';
import { Tick } from '@public/core/decorators/tick';
import { Control } from '@public/shared/input';

import { PlayerInventoryUpdate } from '../../core/decorators/player';
import { Provider } from '../../core/decorators/provider';
import { getItemsWeight, InventoryConfiguration, InventoryItem } from '../../shared/inventory';
import { ItemService } from '../item/item.service';
import { Notifier } from '../notifier';
import { PlayerWalkstyleProvider } from '../player/player.walkstyle.provider';
import { VampireGameStateProvider } from '../story/vampire.game.state.provider';

@Provider()
export class InventoryOverloadProvider {
    @Inject(PlayerWalkstyleProvider)
    private playerWalkstyleProvider: PlayerWalkstyleProvider;

    @Inject(VampireGameStateProvider)
    private vampireGameStateProvider: VampireGameStateProvider;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ItemService)
    private itemService: ItemService;

    private overloaded = false;
    private interval: NodeJS.Timer;

    @PlayerInventoryUpdate()
    public async onOverload(items: Record<number, InventoryItem>, configuration: InventoryConfiguration) {
        const maxWeight = configuration.maxWeight;
        const currentWeight = getItemsWeight(Object.values(items), this.itemService.getItem.bind(this.itemService));

        this.overloaded = currentWeight > maxWeight;

        if (this.vampireGameStateProvider.isGameRunning()) {
            return;
        }

        await this.playerWalkstyleProvider.updateWalkStyle('overloaded', this.overloaded ? 'move_heist_lester' : null);

        if (!this.overloaded && this.interval) {
            clearInterval(this.interval);
        }

        if (this.overloaded && !this.interval) {
            this.interval = setInterval(
                () =>
                    this.notifier.notify(
                        'Tu as mal au dos ! Ouille, ouille ouille ! Débarrasse toi des objets en trop.',
                        'warning'
                    ),
                60000
            );
        }
    }

    @Tick()
    public onOverloadedTick() {
        if (this.vampireGameStateProvider.isGameRunning()) {
            return;
        }

        if (this.overloaded) {
            DisableControlAction(0, Control.Jump, true);
            DisableControlAction(0, Control.Sprint, true);
            DisableControlAction(0, Control.Duck, true);
        }
    }
}
