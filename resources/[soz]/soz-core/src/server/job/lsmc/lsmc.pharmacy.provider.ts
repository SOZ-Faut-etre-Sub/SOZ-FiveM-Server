import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event';
import { PHARMACY_PRICES } from '../../../shared/job/lsmc';
import { InventoryManager } from '../../item/inventory.manager';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';
import { QBCore } from '../../qbcore';

@Provider()
export class LSMCPharmacyProvider {
    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(QBCore)
    private QBCore: QBCore;

    @Inject(Notifier)
    private notifier: Notifier;

    @OnEvent(ServerEvent.LSMC_HEAL)
    public async onLsmcHeal(source: number) {
        const price = PHARMACY_PRICES.heal;

        if (this.QBCore.getPlayer(source).Functions.RemoveMoney('money', price)) {
            TriggerEvent(ServerEvent.LSMC_REVIVE, source);
        } else {
            this.notifier.notify(
                source,
                `T'as cru que je faisais ça par passion ? Il faut payer ~r~$${price}~s~.`,
                'error'
            );
        }
    }

    @OnEvent(ServerEvent.LSMC_BUY_ITEM)
    public async onLsmcBuyItem(source: number, item: string) {
        const price = PHARMACY_PRICES[item];
        if (price) {
            if (this.QBCore.getPlayer(source).Functions.RemoveMoney('money', price)) {
                this.notifier.notify(source, `Merci pour ton achat !`);
                this.inventoryManager.addItemToInventory(source, item, 1);
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
