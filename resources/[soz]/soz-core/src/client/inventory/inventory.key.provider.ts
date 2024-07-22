import { Provider } from '@core/decorators/provider';
import { HousingPropertyZoneProvider } from '@public/client/housing/housing.property.zone.provider';
import { InventoryManager } from '@public/client/inventory/inventory.manager';
import { NuiDispatch } from '@public/client/nui/nui.dispatch';
import { PlayerService } from '@public/client/player/player.service';
import { OnEvent, OnNuiEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { ClientEvent } from '@public/shared/event/client';
import { InventoryCard, InventoryKey } from '@public/shared/inventory';

import { Command } from '../../core/decorators/command';
import { NuiEvent } from '../../shared/event/nui';
import { ServerEvent } from '../../shared/event/server';
import { CardType } from '../../shared/nui/card';
import { Vector3 } from '../../shared/polyzone/vector';
import { AnimationService } from '../animation/animation.service';
import { Notifier } from '../notifier';
import { PlayerFinderService } from '../player/player.finder.service';

@Provider()
export class InventoryKeyProvider {
    @Inject(InventoryManager)
    public inventoryManager: InventoryManager;

    @Inject(PlayerService)
    public playerService: PlayerService;

    @Inject(HousingPropertyZoneProvider)
    private housingPropertyZoneProvider: HousingPropertyZoneProvider;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(PlayerFinderService)
    private playerFinderService: PlayerFinderService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @OnEvent(ClientEvent.INVENTORY_OPEN_KEYS)
    public openKeys(vehicleKeys: string[]) {
        const apartmentKeys = this.housingPropertyZoneProvider.getPlayerAccess();
        const keys: InventoryKey[] = [];

        for (const key of vehicleKeys) {
            keys.push({
                type: 'vehicle',
                plate: key,
            });
        }

        for (const propertyId of Object.keys(apartmentKeys)) {
            for (const apartmentId of Object.keys(apartmentKeys[propertyId])) {
                keys.push({
                    type: 'apartment',
                    propertyId: parseInt(propertyId, 10),
                    apartmentId: parseInt(apartmentId, 10),
                    label: apartmentKeys[propertyId][apartmentId].label,
                });
            }
        }

        this.nuiDispatch.closeEverything();
        this.nuiDispatch.dispatch('inventory', 'OpenKeychain', {
            keys,
        });
    }

    @OnEvent(ClientEvent.INVENTORY_OPEN_WALLET)
    public openWallet(cards: InventoryCard[]) {
        this.nuiDispatch.closeEverything();
        this.nuiDispatch.dispatch('inventory', 'OpenWallet', {
            cards,
        });
    }
    @Command('openPlayerKeyInventory', {
        description: 'Ouvrir le trousseau de clés',
        keys: [{ mapper: 'keyboard', key: '' }],
    })
    @OnNuiEvent(NuiEvent.InventoryActionOpenKeychain)
    public async onInventoryActionOpenKeychain() {
        TriggerServerEvent(ServerEvent.VEHICLE_OPEN_KEYS);
    }

    @Command('open-wallet', {
        description: 'Ouvrir le portefeuille',
        keys: [{ mapper: 'keyboard', key: '' }],
    })
    @OnNuiEvent(NuiEvent.InventoryActionOpenWallet)
    public async onInventoryActionOpenWallet() {
        TriggerServerEvent(ServerEvent.PLAYER_OPEN_WALLET);
    }

    @OnNuiEvent(NuiEvent.InventoryActionShowCard)
    public async onInventoryActionShowCard({ card }: { card: InventoryCard }) {
        const player = await this.playerFinderService.getPlayerFromMode('screen');

        if (!player || player.entity === PlayerPedId()) {
            await this.showCard(card.type, null, card.iban);
        } else {
            await this.showCard(card.type, player.playerId, card.iban);
        }
    }

    @OnNuiEvent(NuiEvent.InventoryActionLookCard)
    public async onInventoryActionLookCard({ card }: { card: InventoryCard }) {
        await this.seeCard({ type: card.type });
    }

    @OnNuiEvent(NuiEvent.InventoryActionGiveKey)
    public async onInventoryActionGiveKey({ keys, mode }: { keys: InventoryKey[]; mode: 'screen' | 'closest' }) {
        const player = await this.playerFinderService.getPlayerFromMode(mode);

        if (!player) {
            this.notifier.error("Personne n'est à portée de vous.");

            return;
        }

        for (const key of keys) {
            if (key.type === 'vehicle') {
                TriggerServerEvent(ServerEvent.VEHICLE_GIVE_KEY, key.plate, player.playerId);
            } else if (key.type === 'apartment') {
                TriggerServerEvent(
                    ServerEvent.HOUSING_ADD_TEMPORARY_ACCESS,
                    key.propertyId,
                    key.apartmentId,
                    player.playerId
                );
            }
        }
    }

    public async showCard(type: CardType, target: number | null, accountId?: string) {
        const position = GetEntityCoords(PlayerPedId()) as Vector3;
        const players = target ? [target] : this.playerService.getPlayersAround(position, 3.0);

        if (players.length < 1) {
            this.notifier.notify("Personne n'est a portée de vous.", 'error');
            return;
        }

        const player = this.playerService.getId();
        await this.animationService.playAnimation({
            base: {
                dictionary: 'mp_common',
                name: 'givetake2_a',
                blendInSpeed: 8.0,
                blendOutSpeed: 8.0,
                options: {
                    enablePlayerControl: true,
                    onlyUpperBody: true,
                },
            },
        });

        TriggerServerEvent(ServerEvent.PLAYER_SHOW_IDENTITY, type, players, player, accountId);
    }

    public async seeCard({ type }) {
        const player = this.playerService.getId();
        let iban = '';
        if (!player) {
            return;
        }

        if (type === 'bank') {
            iban = player.charinfo.account;
        }

        this.nuiDispatch.dispatch('card', 'addCard', {
            type,
            player,
            iban,
        });
    }
}
