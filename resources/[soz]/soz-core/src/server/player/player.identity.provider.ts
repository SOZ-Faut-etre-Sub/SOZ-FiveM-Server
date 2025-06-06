import { PlayerData } from '@public/shared/player';

import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { InventoryCard } from '../../shared/inventory';
import { CardType } from '../../shared/nui/card';
import { PlayerService } from './player.service';

@Provider()
export class PlayerIdentityProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @OnEvent(ServerEvent.PLAYER_SHOW_IDENTITY)
    public showIdentity(source, type: CardType, targets: number[], player: PlayerData, accountId?: string) {
        for (const target of targets) {
            if (target !== source) {
                TriggerClientEvent(ClientEvent.PLAYER_SHOW_IDENTITY, target, type, player, accountId);
            }
        }
    }

    @OnEvent(ServerEvent.PLAYER_OPEN_WALLET)
    public async openPlayerWallet(source: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const cards: InventoryCard[] = [
            {
                type: 'identity',
                label: "Carte d'identité",
                description: "Votre carte d'identité au sein de l'état de San Andreas. Ne la perdez pas !",
            },
            {
                type: 'license',
                label: 'Permis',
                description: 'Votre permis de conduire, faites attention et ne perdez pas vos points..',
            },
            {
                type: 'health',
                label: 'Carte de santé',
                description: 'Votre carte de santé à présenter au centre médical de San Andreas.',
            },
            {
                type: 'bank',
                label: 'Carte bancaire',
                description: 'Votre carte bancaire STONK personnelle.',
                iban: player.charinfo.account,
            },
        ];

        if (player.metadata.casino_vip_premium_subscription_expire_at > Date.now()) {
            cards.push({
                type: 'casino_premium',
                label: 'VIP Premium',
                description: 'Votre carte VIP Premium',
                expiration: player.metadata.casino_vip_premium_subscription_expire_at,
                point: player.metadata.casino_vip_point ?? 0,
            });
        } else if (player.metadata.casino_vip_standard_subscription_expire_at > Date.now()) {
            cards.push({
                type: 'casino_standard',
                label: 'VIP Basique',
                description: 'Votre carte VIP Basique',
                expiration: player.metadata.casino_vip_standard_subscription_expire_at,
                point: player.metadata.casino_vip_point ?? 0,
            });
        }

        TriggerClientEvent(ClientEvent.INVENTORY_OPEN_WALLET, source, cards);
    }
}
