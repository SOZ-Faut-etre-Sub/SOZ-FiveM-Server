import { Once, OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { GarageList } from '@public/config/garage';
import { PrismaService } from '@public/server/database/prisma.service';
import { FeatureProvider } from '@public/server/feature/feature.provider';
import { Inventory } from '@public/server/inventory/inventory';
import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { ItemService } from '@public/server/item/item.service';
import { Notifier } from '@public/server/notifier';
import { PlayerService } from '@public/server/player/player.service';
import { VehicleService } from '@public/server/vehicle/vehicle.service';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { Feature } from '@public/shared/features';
import { InventoryItem } from '@public/shared/inventory';
import { Item } from '@public/shared/item';
import { PlayerVehicleState } from '@public/shared/vehicle/player.vehicle';

const ZRT_BLIZZARD_MODEL = 'zrtblizzard';

@Provider()
export class ItemGiftProvider {
    @Inject(ItemService)
    private item: ItemService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PrismaService)
    private prismaService: PrismaService;

    @Inject(VehicleService)
    private vehicleService: VehicleService;

    @Once()
    public async onInit() {
        this.item.setItemUseCallback('joker_card', this.useJockerCard.bind(this));
        this.item.setItemUseCallback('flower_bouquet', this.useFlowerBouquet.bind(this));
        this.item.setItemUseCallback('tibet_bowl', this.useTibetBowl.bind(this));
        this.item.setItemUseCallback('lucky_token', this.useLuckyToken.bind(this));
        this.item.setItemUseCallback('zrt_blizzard', this.useZRTBlizzard.bind(this));

        this.item.setItemUseCallback('gift_blue', this.useGift.bind(this));
        this.item.setItemUseCallback('gift_gold', this.useGift.bind(this));
        this.item.setItemUseCallback('gift_green', this.useGift.bind(this));
        this.item.setItemUseCallback('gift_red', this.useGift.bind(this));
        this.item.setItemUseCallback('gift_zt', this.useGift.bind(this));
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

    private async useZRTBlizzard(source: number) {
        if (!this.featureProvider.isFeatureEnabled(Feature.Winter)) {
            this.notifier.error(source, "L'hiver est fini !");
            return;
        }

        const player = this.playerService.getPlayer(source);
        if (!player) {
            return;
        }

        const playerVeh = await this.prismaService.playerVehicle.count({
            where: {
                vehicle: ZRT_BLIZZARD_MODEL,
                citizenid: player.citizenid,
                state: { notIn: [PlayerVehicleState.Missing, PlayerVehicleState.Destroyed] },
            },
        });

        if (playerVeh > 0) {
            this.notifier.error(source, `Tu possèdes déjà une ~g~ZRT Blizzard~s~, ça ne te suffit pas ?`);
            return;
        }

        TriggerClientEvent(ClientEvent.GIFT_PLAY_ZRT_BLIZZARD_ANIM, source);
    }

    @OnEvent(ServerEvent.GIFT_GIVE_ZRT_BLIZZARD)
    public async onGiveZRTBlizzard(source: number) {
        if (!this.featureProvider.isFeatureEnabled(Feature.Winter)) {
            this.notifier.error(source, "L'hiver est fini !");
            return;
        }

        const inventory = await this.inventoryFactory.getPlayerInventory(source);
        const player = this.playerService.getPlayer(source);
        if (!inventory || !player) {
            return;
        }

        if (!inventory.remove('zrt_blizzard', 1)) {
            return;
        }

        const garage = 'bell_farms';
        await this.prismaService.playerVehicle.create({
            data: {
                license: player.license,
                citizenid: player.citizenid,
                vehicle: ZRT_BLIZZARD_MODEL,
                hash: GetHashKey(ZRT_BLIZZARD_MODEL).toString(),
                plate: await this.vehicleService.generatePlate(),
                garage: garage,
                category: 'Motorcycles',
                state: 1,
                boughttime: Math.floor(new Date().getTime() / 1000),
                parkingtime: Math.floor(new Date().getTime() / 1000),
            },
        });

        const garageConfig = GarageList[garage];
        this.notifier.notify(
            source,
            `Une ~g~ZRT Blizzard~s~ a été envoyé au garage ~b~${garageConfig.name}~s~. Profite bien de la neige !`,
            'success'
        );
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
