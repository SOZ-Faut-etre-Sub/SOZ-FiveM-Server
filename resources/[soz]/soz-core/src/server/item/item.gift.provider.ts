import { Once, OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { Inventory } from '@public/server/inventory/inventory';
import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { ItemService } from '@public/server/item/item.service';
import { Notifier } from '@public/server/notifier';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { InventoryItem } from '@public/shared/inventory';
import { Item } from '@public/shared/item';

@Provider()
export class ItemGiftProvider {
    @Inject(ItemService)
    private item: ItemService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Once()
    public async onInit() {
        this.item.setItemUseCallback('joker_card', this.useJockerCard.bind(this));
        this.item.setItemUseCallback('flower_bouquet', this.useFlowerBouquet.bind(this));
        this.item.setItemUseCallback('tibet_bowl', this.useTibetBowl.bind(this));
        this.item.setItemUseCallback('lucky_token', this.useLuckyToken.bind(this));

        this.item.setItemUseCallback('gift_blue', this.useGift.bind(this));
        this.item.setItemUseCallback('gift_gold', this.useGift.bind(this));
        this.item.setItemUseCallback('gift_green', this.useGift.bind(this));
        this.item.setItemUseCallback('gift_red', this.useGift.bind(this));
    }

    private useJockerCard(source: number, item: Item, inventoryItem: InventoryItem, inventory: Inventory) {
        if (!inventory.removeAtSlot(inventoryItem.slot, 1)) {
            return;
        }

        TriggerClientEvent(ClientEvent.GIFT_PLAY_JOKER_ANIM, source);
    }

    private useFlowerBouquet(source: number, item: Item, inventoryItem: InventoryItem, inventory: Inventory) {
        if (!inventory.removeAtSlot(inventoryItem.slot, 1)) {
            return;
        }

        TriggerClientEvent(ClientEvent.GIFT_PLAY_BOUQUET_ANIM, source);
    }

    private useTibetBowl(source: number, item: Item, inventoryItem: InventoryItem, inventory: Inventory) {
        if (!inventory.removeAtSlot(inventoryItem.slot, 1)) {
            return;
        }

        TriggerClientEvent(ClientEvent.PLAYER_HEALTH_DO_YOGA, source);
    }

    private useLuckyToken(source: number, item: Item, inventoryItem: InventoryItem, inventory: Inventory) {
        if (!inventory.removeAtSlot(inventoryItem.slot, 1)) {
            return;
        }

        TriggerClientEvent(ClientEvent.GIFT_PLAY_TOKEN_ANIM, source);
    }

    public async useGift(source: number, item: Item, inventoryItem: InventoryItem, inventory: Inventory) {
        if (!inventory.hasEnoughItem(item.name, 1)) {
            return;
        }

        TriggerClientEvent(ClientEvent.GIFT_PLAY_GIFT_ANIM, source, inventoryItem.slot, item.name);
    }

    @OnEvent(ServerEvent.GIFT_OPEN_GIFT)
    public async openGift(source: number, slot: number, name: string) {
        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        if (!inventory) {
            return;
        }

        const inventoryItem = inventory.getItemAtSlot(slot);
        const item = this.item.getItem(inventoryItem.name);
        if (!item || inventoryItem.name !== name || !inventory.removeAtSlot(slot, 1)) {
            return;
        }

        const giftedLabel = [];
        inventoryItem.metadata.crateElements.map(gift => {
            inventory.add(gift.name, gift.amount, { ...gift.metadata });
            giftedLabel.push(gift.label);
        });

        let giftLabel = item.label;
        if (inventoryItem.metadata.label) {
            giftLabel = item.label + ' "' + inventoryItem.metadata.label + '"';
        }

        this.notifier.notify(
            source,
            `Vous avez deballé votre ~g~${giftLabel}~s~ ! Surprise, tu as reçu : ~b~${giftedLabel.join('~s~, ~b~')}~s~.`,
            'success'
        );
    }

    @OnEvent(ServerEvent.GIFT_TOSS_COIN)
    public async onGiftTossCoin(source: number, players: number[]) {
        const randNumber = Math.floor(Math.random() * 1000);

        let notif: string;
        if (randNumber === 0 || randNumber === 501) {
            notif = `La personne à côté de toi a lancé sa pièce ! Sur la ~b~Tranche~s~...`;
        } else if (randNumber % 2) {
            notif = `La personne à côté de toi a lancé sa pièce ! Elle a obtenu ~b~Face~s~ !`;
        } else {
            notif = `La personne à côté de toi a lancé sa pièce ! Elle a obtenu ~b~Pile~s~ !`;
        }

        for (const player of players) {
            this.notifier.notify(player, notif);
        }
    }
}
