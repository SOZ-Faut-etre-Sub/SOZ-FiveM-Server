import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Once } from '@public/core/decorators/event';
import { InventoryManager } from '@public/server/inventory/inventory.manager';
import { ItemService } from '@public/server/item/item.service';
import { Notifier } from '@public/server/notifier';
import { PlayerService } from '@public/server/player/player.service';
import { ClientEvent } from '@public/shared/event';
import { InventoryItem, Item } from '@public/shared/item';

@Provider()
export class LSMCItemProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ItemService)
    private item: ItemService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Once()
    public async onInit() {
        this.item.setItemUseCallback('tissue', this.useTissue.bind(this));
        this.item.setItemUseCallback('antibiotic', this.useAntibiotic.bind(this));
        //this.item.setItemUseCallback('pommade', this.usePommade.bind(this));
        this.item.setItemUseCallback('ifaks', this.useIfaks.bind(this));
        this.item.setItemUseCallback('painkiller', this.usePainkiller.bind(this));
    }

    private async useTissue(source: number, _item: Item, inventoryItem: InventoryItem) {
        const player = this.playerService.getPlayer(source);

        if (this.inventoryManager.removeInventoryItem(source, inventoryItem)) {
            if (player.metadata.disease == 'rhume') {
                this.notifier.notify(source, 'Vous utilisez un mouchoir et vous vous sentez mieux !');
                this.playerService.setPlayerDisease(source, false);
            } else {
                this.notifier.notify(source, 'Vous utilisez un mouchoir, mais rien ne sort !');
            }
        }
    }

    private async useAntibiotic(source: number, _item: Item, inventoryItem: InventoryItem) {
        const player = this.playerService.getPlayer(source);

        if (this.inventoryManager.removeInventoryItem(source, inventoryItem)) {
            if (player.metadata.disease == 'intoxication') {
                this.notifier.notify(source, 'Vous utilisez un antibiotique et vous vous sentez mieux !');
                this.playerService.setPlayerDisease(source, false);
            } else {
                this.notifier.notify(source, 'Vous utilisez un antibiotique, mais rien ne change !');
            }
        }
    }

    private async usePainkiller(source: number, _item: Item, inventoryItem: InventoryItem) {
        const player = this.playerService.getPlayer(source);

        if (this.inventoryManager.removeInventoryItem(source, inventoryItem)) {
            if (player.metadata.disease == 'backpain') {
                this.notifier.notify(source, 'Vous utilisez un anti-douleur et vous vous sentez mieux !');
                this.playerService.setPlayerDisease(source, false);
            } else {
                this.notifier.notify(source, 'Vous utilisez un anti-douleur, mais rien ne change !');
            }
        }
    }

    private async useIfaks(source: number) {
        TriggerClientEvent(ClientEvent.LSMC_HEAL, source, 25);
    }
}
