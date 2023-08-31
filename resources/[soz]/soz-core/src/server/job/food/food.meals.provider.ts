import { OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../../shared/event';
import { isOk } from '../../../shared/result';
import { BankService } from '../../bank/bank.service';
import { InventoryManager } from '../../inventory/inventory.manager';
import { Notifier } from '../../notifier';
import { ProgressService } from '../../player/progress.service';

@Provider()
export class FoodMealsProvider {
    private readonly LIMIT_OF_ORDERS = 12;

    private readonly MEAL_BOXES_PER_ORDER = 12;

    private readonly MEAL_BOX_ITEM = 'meal_box';

    private readonly ORDER_PRICE = 3000;

    private orderedMeals = 0;

    private orderInProgress = false;

    private orderReadyDate: Date;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(BankService)
    private bankService: BankService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @OnEvent(ServerEvent.FOOD_RETRIEVE_STATE)
    onRetrieveState(source: number) {
        TriggerClientEvent(ClientEvent.FOOD_UPDATE_ORDER, source, this.orderInProgress);
    }

    @OnEvent(ServerEvent.FOOD_ORDER_MEALS)
    public async onOrderMeals(source: number) {
        if (this.orderedMeals >= this.LIMIT_OF_ORDERS) {
            this.notifier.notify(source, `Désolé nos chefs sont occupés pour la journée. Revenez ~r~demain~s~.`);
            return;
        }
        if (this.orderInProgress) {
            this.notifier.notify(source, 'Une commande est déjà en cours.');
            return;
        }

        const { completed } = await this.progressService.progress(
            source,
            'food_meal',
            'Vous passez une commande...',
            10000,
            {
                name: 'base',
                dictionary: 'missheistdockssetup1clipboard@base',
                flags: 1,
            },
            {
                disableMovement: true,
                disableCarMovement: true,
                disableMouse: false,
                disableCombat: true,
                firstProp: {
                    model: 'prop_notepad_01',
                    bone: 18905,
                    coords: { x: 0.1, y: 0.02, z: 0.08 },
                    rotation: { x: -80.0, y: 0.0, z: 0.0 },
                },
                secondProp: {
                    model: 'prop_pencil_01',
                    bone: 58866,
                    coords: { x: 0.12, y: -0.02, z: 0.001 },
                    rotation: { x: -150.0, y: 0.0, z: 0.0 },
                },
            }
        );

        if (!completed) {
            return false;
        }

        const transferred = await this.bankService.transferBankMoney('food', 'farm_food', this.ORDER_PRICE);
        if (isOk(transferred)) {
            const date = new Date();
            date.setTime(date.getTime() + 60 * 60 * 1000); // One hour later...
            this.orderReadyDate = date;
            this.orderedMeals++;

            this.updateOrderInProgress(true);

            this.notifier.notify(
                source,
                `Merci pour votre commande ! Cela fera ~r~${this.ORDER_PRICE.toLocaleString()}$~s~. Celle-ci sera prête dans ~g~une heure~s~.`
            );
        } else {
            this.notifier.notify(
                source,
                `Il te manque ~r~${this.ORDER_PRICE.toLocaleString()}$~s~ sur le compte de l'entreprise.`
            );
        }
    }

    @OnEvent(ServerEvent.FOOD_RETRIEVE_ORDER)
    public async onRetrieveOrder(source: number) {
        if (!this.orderInProgress) {
            this.notifier.notify(source, 'Aucune commande en cours.');
            return;
        }

        const { completed } = await this.progressService.progress(
            source,
            'food_meal',
            'Vous récupérer une commande...',
            10000,
            {
                dictionary: 'oddjobs@bailbond_hobohang_out_street_b',
                name: 'idle_b',
                options: { repeat: true },
            },
            {
                disableMovement: true,
                disableCarMovement: true,
                disableMouse: false,
                disableCombat: true,
            }
        );

        if (!completed) {
            return false;
        }

        if (this.orderReadyDate.getTime() > new Date().getTime()) {
            const minutesLeft = Math.round(
                ((this.orderReadyDate.getTime() - (new Date().getTime() % 86400000)) % 3600000) / 60000
            );
            this.notifier.notify(
                source,
                `Votre commande n'est pas encore prête ! Revenez dans ~r~${minutesLeft} minute${
                    minutesLeft > 1 ? 's' : ''
                }~s~.`
            );
            return;
        } else if (!this.inventoryManager.canCarryItem(source, this.MEAL_BOX_ITEM, this.MEAL_BOXES_PER_ORDER)) {
            this.notifier.notify(source, `Vous n'avez ~r~pas assez de place~s~ dans votre inventaire.`);
            return;
        }
        this.inventoryManager.addItemToInventory(source, this.MEAL_BOX_ITEM, this.MEAL_BOXES_PER_ORDER);
        this.notifier.notify(source, `Vous avez ~g~récupéré~s~ votre commande. Bon appétit !`);

        this.updateOrderInProgress(false);
    }

    private updateOrderInProgress(newValue: boolean) {
        this.orderInProgress = newValue;
        TriggerClientEvent(ClientEvent.FOOD_UPDATE_ORDER, -1, this.orderInProgress);
    }
}
