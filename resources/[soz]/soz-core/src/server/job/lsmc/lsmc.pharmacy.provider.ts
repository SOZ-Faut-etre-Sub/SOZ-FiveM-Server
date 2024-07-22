import { OnEvent } from '@core/decorators/event';
import { Inject } from '@core/decorators/injectable';
import { Provider } from '@core/decorators/provider';
import { BankService } from '@public/server/bank/bank.service';
import { InventoryFactory } from '@public/server/inventory/inventory.factory';
import { Monitor } from '@public/server/monitor/monitor';
import { Notifier } from '@public/server/notifier';
import { PlayerMoneyService } from '@public/server/player/player.money.service';
import { PlayerService } from '@public/server/player/player.service';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { JobType } from '@public/shared/job';
import { PHARMACY_PRICES } from '@public/shared/job/lsmc';
import { Vector3 } from '@public/shared/polyzone/vector';

import { TaxType } from '../../../shared/bank';
import { PriceService } from '../../bank/price.service';

@Provider()
export class LSMCPharmacyProvider {
    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerMoneyService)
    private playerMoneyService: PlayerMoneyService;

    @Inject(BankService)
    private bankService: BankService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(Monitor)
    private monitor: Monitor;

    @Inject(PriceService)
    private priceService: PriceService;

    @OnEvent(ServerEvent.LSMC_NPC_HEAL)
    public async onLsmcHeal(source: number) {
        const price = PHARMACY_PRICES.heal;
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        if (await this.playerMoneyService.buy(source, price, TaxType.SERVICE)) {
            await this.bankService.addAccountMoney('safe_' + JobType.LSMC, Math.round(price / 2));
            if (player.metadata.disease == 'grippe') {
                this.playerService.setPlayerDisease(player.source, false);
                this.notifier.notify(player.source, 'Vous êtes guéri!');
            }

            TriggerClientEvent(ClientEvent.LSMC_HEAL, source, 100);

            this.monitor.traceEvent('job_lsmc_npc_heal', {
                player_source: source,
                position: GetEntityCoords(GetPlayerPed(player.source)) as Vector3,
            });
        } else {
            this.notifier.notify(
                source,
                `T'as cru que je faisais ça par passion ? Il faut payer ~r~$${await this.priceService.getPrice(
                    price,
                    TaxType.SERVICE
                )}~s~.`,
                'error'
            );
        }
    }

    @OnEvent(ServerEvent.LSMC_BUY_ITEM)
    public async onLsmcBuyItem(source: number, item: string) {
        const price = PHARMACY_PRICES[item];
        const inventory = await this.inventoryFactory.getPlayerInventory(source);

        if (price) {
            if (this.playerMoneyService.remove(source, price)) {
                this.notifier.notify(source, `Merci pour ton achat !`);
                inventory.add(item, 1);
            } else {
                this.notifier.notify(
                    source,
                    `T'as cru que je faisais ça par passion ? Il faut payer ~r~$${price}~s~.`,
                    'error'
                );
            }
        } else {
            this.notifier.notify(source, `Je ne peux pas te vendre ça !`, 'error');
        }
    }
}
