import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { CustomOutfitItem, ShowRoomPricePerSelection } from '../../../shared/cloth';
import { ServerEvent } from '../../../shared/event';
import { ShowRoomFreeElement } from '../../../shared/FightForStyleShowRoom/ffsClothConfig';
import { InventoryManager } from '../../inventory/inventory.manager';
import { Notifier } from '../../notifier';
import { QBCore } from '../../qbcore';

@Provider()
export class FightForStylShowRoomProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(QBCore)
    private qbcore: QBCore;

    @OnEvent(ServerEvent.FFS_SHOW_ROOM_CRAFTING)
    async onShowRoomCrafting(source: number, outfit: CustomOutfitItem, outfitType: string, pedModel: string) {
        const player = this.qbcore.getPlayer(source);

        let costMult = 0;
        Object.keys(outfit.Components).forEach(componentIndex => {
            if (
                !ShowRoomFreeElement[pedModel].Components[componentIndex]?.includes(
                    outfit.Components[componentIndex].Drawable
                )
            ) {
                costMult++;
            }
        });
        Object.keys(outfit.Props).forEach(propIndex => {
            if (!ShowRoomFreeElement[pedModel].Props[propIndex]?.includes(outfit.Props[propIndex].Drawable)) {
                costMult++;
            }
        });

        if (!costMult) {
            this.notifier.notify(source, `Vous n'avez sélectioné aucun élèment sur votre tenue.`, 'info');
            return;
        }

        if (!outfit?.label?.length) {
            this.notifier.notify(source, `La description de la tenue est vide, ajoutez en une.`, 'info');
            return;
        }

        if (!this.inventoryManager.canCarryItem(source, outfitType, 1)) {
            this.notifier.notify(
                source,
                `Vous ne possédez suffisamment pas de place dans votre inventaire pour confectionner ce vêtement.`,
                'error'
            );
            return;
        }

        const total_cost = ShowRoomPricePerSelection * costMult;
        if (!player.Functions.RemoveMoney('money', total_cost)) {
            this.notifier.notify(source, `Vous n'avez pas assez d'argent.`, 'error');
            return;
        }

        this.inventoryManager.addItemToInventory(source, outfitType, 1, outfit);
        this.notifier.notify(source, `Vous avez confectionné la tenue souhaitée. Cela vous a coûté ${total_cost}$`);
    }
}