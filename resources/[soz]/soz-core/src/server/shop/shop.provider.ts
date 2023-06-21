import { InventoryItemMetadata, ItemType } from '@public/shared/item';

import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { InventoryManager } from '../inventory/inventory.manager';
import { Monitor } from '../monitor/monitor';
import { Notifier } from '../notifier';
import { PlayerMoneyService } from '../player/player.money.service';
import { PlayerService } from '../player/player.service';

type CartElement = {
    name: string;
    label: string;
    description: string;
    weight: number;
    slot: number;
    useable: boolean;
    unique: boolean;
    type: ItemType;
    amount: number;
    metadata?: InventoryItemMetadata;
    shouldClose?: boolean;
    illustrator?: Record<string, string> | string;
    disabled?: boolean; // added by inventory on the fly
    shortcut?: string | null; // added by inventory on the fly
    price: number;
};

@Provider()
export class ShopProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(Monitor)
    private monitor: Monitor;

    @OnEvent(ServerEvent.SHOP_VALIDATE_CART)
    public async onShopMaskBuy(source: number, cartContent: CartElement[]) {
        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        let cartAmount = 0;
        let cartWeight = 0;

        cartContent.map(item => {
            cartAmount = cartAmount + item.amount * item.price;
            cartWeight = cartWeight + item.amount * item.weight;
        });

        const canCarryCart = this.inventoryManager.canCarryItems(source, cartContent);
        TriggerClientEvent(ClientEvent.ANIMATION_GIVE, source);

        if (!canCarryCart) {
            this.notifier.notify(source, 'Vous ne pouvez pas porter cette quantité...', 'error');
            return;
        }

        if (!this.playerMoneyService.remove(source, cartAmount, 'money')) {
            this.notifier.notify(source, "Vous n'avez pas assez d'argent", 'error');
            return;
        }

        cartContent.map(item => {
            if (!item.unique) {
                this.inventoryManager.addItemToInventory(source, item.name, item.amount, item.metadata);
            } else {
                for (let i = 0; i < item.amount; i++) {
                    this.inventoryManager.addItemToInventory(source, item.name, 1, item.metadata);
                }
            }
        });

        this.notifier.notify(source, `Votre achat a bien été validé ! Merci. Prix : ~g~$${cartAmount}`, 'success');

        this.monitor.publish(
            'Shop Buy',
            { player_source: source },
            { cartContent: cartContent, cartPrice: cartAmount }
        );
    }
}
