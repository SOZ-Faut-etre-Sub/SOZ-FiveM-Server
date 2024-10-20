import { Command } from '../../core/decorators/command';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { isErr } from '../../shared/result';
import { ItemService } from '../item/item.service';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';
import { InventoryFactory } from './inventory.factory';

/**
 * Exposition of some methods from the InventoryManager to the clients
 */
@Provider()
export class InventoryCommandProvider {
    @Inject(InventoryFactory)
    private inventoryFactory: InventoryFactory;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Command('clearinv', {
        description: 'Clear Players Inventory (Admin Only)',
        arguments: [{ name: 'id', help: 'Player Id' }],
        role: 'admin',
    })
    public async clearInventory(source: number, target: number) {
        const inventory = await this.inventoryFactory.getPlayerInventory(target);

        if (!inventory) {
            this.notifier.error(source, 'Joueur introuvable');

            return;
        }

        inventory.clear();
        await inventory.observe();
    }

    @Command('giveitem', {
        description: 'Give An Item',
        arguments: [
            { name: 'id', help: 'Player ID' },
            { name: 'item', help: 'Name of the item' },
            { name: 'amount', help: 'Amount of items' },
            { name: 'metadata', help: 'Metadata of the item, in the form key=value, can be repeated' },
        ],
        role: 'admin',
    })
    public async giveItem(source: number, target: number, item: string, amount: number = 1, ...metadatas: string[]) {
        const player = this.playerService.getPlayer(target);
        const inventory = await this.inventoryFactory.getPlayerInventory(target);

        if (!inventory || !player) {
            this.notifier.error(source, 'Joueur introuvable');

            return;
        }

        const itemObject = this.itemService.getItem(item);

        if (!itemObject) {
            this.notifier.error(source, `Objet introuvable ${item}`);

            return;
        }

        const metadata = {};

        for (const meta of metadatas) {
            const splitted = meta.split('=');

            if (splitted.length !== 2) {
                this.notifier.error(
                    source,
                    `Mauvais format de métadonnée ${meta}, ce doit être sous la forme key=value`
                );

                return;
            }

            const [key, value] = splitted;

            if (parseInt(value, 10).toString() === value) {
                metadata[key] = parseInt(value, 10);
            } else {
                metadata[key] = value;
            }
        }

        const result = inventory.add(item, amount, metadata);

        if (isErr(result)) {
            this.notifier.error(source, `Impossible de rajouter l'objet: ${result.err}`);

            return;
        }

        this.notifier.notify(
            source,
            `Vous avez donné ~o~${amount} ~b~${itemObject.label} ~o~"${item}"~s~ à ~b~${player.charinfo.firstname} ${player.charinfo.lastname}`
        );

        await inventory.observe();
    }

    @Command('setinv', {
        description: 'Force player inventory weight (Admin Only)',
        arguments: [
            { name: 'id', help: 'Player ID' },
            { name: 'weight', help: 'New weight for the inventory' },
        ],
        role: 'admin',
    })
    public async setInventoryWeight(source: number, target: string, weight: string) {
        let inventory = await this.inventoryFactory.getPlayerInventory(parseInt(target, 10));

        if (!inventory) {
            inventory = await this.inventoryFactory.get(target);
        }

        if (!inventory) {
            this.notifier.error(source, 'Joueur introuvable ou inventaire inexistant');

            return;
        }

        inventory.updateConfiguration({
            maxWeight: parseInt(weight, 10),
        });

        await inventory.observe();
    }
}
