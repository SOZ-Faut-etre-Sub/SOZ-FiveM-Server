import { Once, OnceStep, OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ServerEvent } from '../../../shared/event/server';
import { getAmount } from '../../../shared/field';
import { JobType } from '../../../shared/job';
import { FoodFields, FoodFieldType } from '../../../shared/job/food';
import { PollutionLevel } from '../../../shared/pollution';
import { toVector3Object, Vector3 } from '../../../shared/polyzone/vector';
import { FieldProvider } from '../../farm/field.provider';
import { InventoryManager } from '../../inventory/inventory.manager';
import { ItemService } from '../../item/item.service';
import { Monitor } from '../../monitor/monitor';
import { Notifier } from '../../notifier';
import { PlayerService } from '../../player/player.service';
import { ProgressService } from '../../player/progress.service';
import { Pollution } from '../../pollution';

@Provider()
export class FoodFieldProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Monitor)
    public monitor: Monitor;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(InventoryManager)
    private inventoryManager: InventoryManager;

    @Inject(FieldProvider)
    private fieldService: FieldProvider;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(Pollution)
    private pollution: Pollution;

    @Once(OnceStep.RepositoriesLoaded)
    public async init() {
        for (const type of Object.keys(FoodFields)) {
            const field = FoodFields[type as FoodFieldType];

            for (const index in field.zones) {
                const identifier = `food-field-${type}-${index}`;

                await this.fieldService.createField({
                    identifier,
                    owner: JobType.Food,
                    item: field.item,
                    capacity: field.capacity.start,
                    maxCapacity: field.capacity.max,
                    refill: {
                        delay: field.refill.delay,
                        amount: field.refill.amount,
                    },
                    harvest: {
                        delay: field.harvest.delay,
                        amount: {
                            min: field.harvest.min,
                            max: field.harvest.max,
                        },
                    },
                });
            }
        }
    }

    @OnEvent(ServerEvent.FOOD_COLLECT)
    public async onFoodCollect(source: number, type: FoodFieldType, index: string) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        const fieldIdentifier = `food-field-${type}-${index}`;
        const field = await this.fieldService.getField(fieldIdentifier);

        if (!field) {
            return;
        }

        // @TODO Show Field health

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const { completed } = await this.progressService.progress(
                source,
                'food-collect-ingredients',
                'Vous récoltez des ingrédients',
                field.harvest.delay,
                {
                    name: 'weed_stand_checkingleaves_kneeling_01_inspector',
                    dictionary: 'anim@amb@business@weed@weed_inspecting_lo_med_hi@',
                },
                {
                    disableMovement: true,
                    disableCarMovement: true,
                    disableMouse: false,
                    disableCombat: false,
                }
            );

            if (!completed) {
                this.notifier.error(player.source, "Vous n'avez pas récolté d'ingrédients");

                return;
            }

            const items = [];

            if (typeof field.item === 'string') {
                const amountToHarvest = getAmount(field.harvest.amount);

                items.push({
                    name: field.item,
                    amount: amountToHarvest,
                });
            } else {
                for (const item of field.item) {
                    const amountToHarvest = getAmount(item.amount);

                    items.push({
                        name: item.name,
                        amount: amountToHarvest,
                    });
                }
            }

            if (!this.inventoryManager.canCarryItems(source, items)) {
                this.notifier.error(player.source, "Vous n'avez pas assez de place dans votre inventaire");

                return;
            }

            const position = GetEntityCoords(GetPlayerPed(source)) as Vector3;

            for (const item of items) {
                const itemData = this.itemService.getItem(item.name);

                this.inventoryManager.addItemToInventory(source, item.name, item.amount);

                if (!(await this.fieldService.harvestField(fieldIdentifier, item.amount))) {
                    this.notifier.error(source, 'Le champ est vide');

                    return;
                } else {
                    this.notifier.notify(source, `Vous avez récolté ${item.amount} ${itemData.label}`);
                }

                this.monitor.traceEvent('job_cm_food_collect', {
                    player_source: source,
                    item_id: item.name,
                    item_label: itemData.label,
                    amount: item.amount,
                    position: toVector3Object(position),
                });
            }
        }

        // @TODO Hide Field health
    }

    @OnEvent(ServerEvent.FOOD_MILK_COLLECT)
    public async onMilkCollect(source: number, hours: number) {
        const player = this.playerService.getPlayer(source);

        if (!player) {
            return;
        }

        // eslint-disable-next-line no-constant-condition
        while (true) {
            const { completed } = await this.progressService.progress(
                source,
                'food-harvest-milk',
                'Vous récupérez des pots de lait',
                10000,
                {
                    name: 'action_a',
                    dictionary: 'anim@mp_radio@garage@low',
                },
                {
                    disableMovement: true,
                    disableCarMovement: true,
                    disableMouse: false,
                    disableCombat: true,
                }
            );

            if (!completed) {
                return;
            }

            const amount = { min: 1, max: 4 };

            if (this.pollution.getPollutionLevel() === PollutionLevel.Low) {
                amount.min = 2;
                amount.max = 5;
            }

            const amountToHarvest = getAmount(amount);
            const hoursTypeItem = Math.floor((hours % 24) / 8);
            let item = 'milk';

            if (hoursTypeItem === 1) {
                item = 'semi_skimmed_milk';
            } else if (hoursTypeItem === 2) {
                item = 'skimmed_milk';
            }

            const { success } = this.inventoryManager.addItemToInventory(source, item, amountToHarvest);

            if (!success) {
                this.notifier.error(player.source, 'Vos poches sont pleines...');

                return;
            }

            const itemData = this.itemService.getItem(item);

            this.notifier.notify(player.source, `Vous avez récolté ${amountToHarvest} ${itemData.label}`);

            this.monitor.traceEvent('job_cm_food_collect', {
                player_source: source,
                item_id: item,
                item_label: itemData.label,
                amount: amountToHarvest,
                position: toVector3Object(GetEntityCoords(GetPlayerPed(source)) as Vector3),
            });
        }
    }
}
