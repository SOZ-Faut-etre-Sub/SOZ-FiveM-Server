import { Once, OnceStep } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { ServerEvent } from '@public/shared/event';

import { Provider } from '../../core/decorators/provider';
import { TaxType } from '../../shared/bank';
import { PositiveNumberValidator } from '../../shared/nui/input';
import { InputService } from '../nui/input.service';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../progress.service';
import { TaxRepository } from '../repository/tax.repository';
import { TargetFactory } from '../target/target.factory';

const dispenser_eat_price = 9;
const dispenser_drink_price = 9;
const dispenser_cafe_price = 9;

const vending_machine_drink = ['prop_vend_soda_01', 'prop_vend_soda_02', 'prop_watercooler_dark', 'prop_watercooler'];
const vending_machine_food = ['prop_vend_snak_01', 'prop_vend_snak_01_tu'];
const vending_machine_cafe = ['prop_vend_coffe_01'];

@Provider()
export class DispenserProvider {
    @Inject(PlayerService)
    public playerService: PlayerService;

    @Inject(TargetFactory)
    public targetFactory: TargetFactory;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(TaxRepository)
    private taxRepository: TaxRepository;

    @Once(OnceStep.RepositoriesLoaded)
    public onStart() {
        const drinkPrice = this.taxRepository.getPriceWithTax(dispenser_drink_price, TaxType.FOOD);
        const eatPrice = this.taxRepository.getPriceWithTax(dispenser_eat_price, TaxType.FOOD);
        const cafePrice = this.taxRepository.getPriceWithTax(dispenser_cafe_price, TaxType.FOOD);
        const drinkBatchPrice = this.taxRepository.getNotRoundedPriceWithTax(dispenser_drink_price, TaxType.FOOD);
        const eatBatchPrice = this.taxRepository.getNotRoundedPriceWithTax(dispenser_eat_price, TaxType.FOOD);
        const cafeBatchPrice = this.taxRepository.getNotRoundedPriceWithTax(dispenser_cafe_price, TaxType.FOOD);

        this.targetFactory.createForModel(
            vending_machine_drink,
            [
                {
                    label: "Bouteille d'eau ($" + drinkPrice + ')',
                    icon: 'c:food/bouteille.png',
                    category: 'citizen',
                    action: () => {
                        this.buy('Achète à boire ...', 'water_bottle', dispenser_drink_price);
                    },
                },
                {
                    label: `Lot de bouteilles</br>($${drinkBatchPrice} unité)`,
                    icon: 'c:food/bouteilles.png',
                    category: 'citizen',
                    action: async () => {
                        const quantity = await this.inputService.askInput(
                            {
                                title: `Choisir la quantité`,
                                maxCharacters: 4,
                            },
                            PositiveNumberValidator
                        );

                        if (!quantity) {
                            return;
                        }

                        this.buy('Achat de plusieurs bouteilles ...', 'water_bottle', dispenser_drink_price, quantity);
                    },
                },
            ],
            1
        );

        this.targetFactory.createForModel(
            vending_machine_food,
            [
                {
                    label: 'Sandwich ($' + eatPrice + ')',
                    icon: 'c:food/baguette.png',
                    category: 'citizen',
                    action: () => {
                        this.buy('Achète à manger...', 'sandwich', dispenser_eat_price);
                    },
                },
                {
                    label: `Lot de sandwichs</br>($${eatBatchPrice} unité)`,
                    icon: 'c:food/baguettes.png',
                    category: 'citizen',
                    action: async () => {
                        const quantity = await this.inputService.askInput(
                            {
                                title: `Choisir la quantité`,
                                defaultValue: '',
                                maxCharacters: 4,
                            },
                            PositiveNumberValidator
                        );

                        if (!quantity) {
                            return;
                        }

                        this.buy('Achat de plusieurs sandwichs ...', 'sandwich', dispenser_eat_price, quantity);
                    },
                },
                {
                    label: 'Chips barbecue ($' + eatPrice + ')',
                    icon: 'c:food/chips.png',
                    category: 'citizen',
                    action: () => {
                        this.buy('Achète à manger...', 'bbq_chips', dispenser_eat_price);
                    },
                },
                {
                    label: 'Chips oignon ($' + eatPrice + ')',
                    icon: 'c:food/chips.png',
                    category: 'citizen',
                    action: () => {
                        this.buy('Achète à manger...', 'onion_chips', dispenser_eat_price);
                    },
                },
                {
                    label: 'Chips salé ($' + eatPrice + ')',
                    icon: 'c:food/chips.png',
                    category: 'citizen',
                    action: () => {
                        this.buy('Achète à manger...', 'water_chips', dispenser_eat_price);
                    },
                },
                {
                    label: 'Zwix ($' + eatPrice + ')',
                    icon: 'c:food/zwix_candy.png',
                    category: 'citizen',
                    action: () => {
                        this.buy('Achète à manger...', 'zwix_candy', dispenser_eat_price);
                    },
                },
            ],
            1
        );

        this.targetFactory.createForModel(
            vending_machine_cafe,
            [
                {
                    label: `Café ($${cafePrice})`,
                    icon: 'c:food/cafe.png',
                    category: 'citizen',
                    action: () => {
                        this.buy('Achète un Café...', 'coffee', dispenser_cafe_price);
                    },
                },
                {
                    label: `Cafés par lot</br>($${cafeBatchPrice} unité)`,
                    icon: 'c:food/cafes.png',
                    category: 'citizen',
                    action: async () => {
                        const quantity = await this.inputService.askInput(
                            {
                                title: `Choisir la quantité`,
                                maxCharacters: 4,
                            },
                            PositiveNumberValidator
                        );

                        if (!quantity) {
                            return;
                        }

                        this.buy('Achat de plusieurs Cafés ...', 'coffee', dispenser_cafe_price, quantity);
                    },
                },
                {
                    label: 'Chocolat chaud ($' + cafePrice + ')',
                    icon: 'c:food/chocolate.png',
                    category: 'citizen',
                    action: () => {
                        this.buy('Achète un Chocolat...', 'chocolate', dispenser_cafe_price);
                    },
                },
                {
                    label: `Chocolats chauds par lot</br>($${cafeBatchPrice} unité)`,
                    icon: 'c:food/chocolates.png',
                    category: 'citizen',
                    action: async () => {
                        const quantity = await this.inputService.askInput(
                            {
                                title: `Choisir la quantité`,
                                maxCharacters: 4,
                            },
                            PositiveNumberValidator
                        );

                        if (!quantity) {
                            return;
                        }

                        this.buy(
                            'Achat de plusieurs Chocolats chauds ...',
                            'chocolate',
                            dispenser_cafe_price,
                            quantity
                        );
                    },
                },
                {
                    label: 'Thé ($' + cafePrice + ')',
                    icon: 'c:food/tea.png',
                    category: 'citizen',
                    action: () => {
                        this.buy('Achète un Thé...', 'tea', dispenser_cafe_price);
                    },
                },
                {
                    label: `Thés par lot</br>($${cafeBatchPrice} unité)`,
                    icon: 'c:food/teas.png',
                    category: 'citizen',
                    action: async () => {
                        const quantity = await this.inputService.askInput(
                            {
                                title: `Choisir la quantité`,
                                maxCharacters: 4,
                            },
                            PositiveNumberValidator
                        );

                        if (!quantity) {
                            return;
                        }

                        this.buy('Achat de plusieurs Thés ...', 'tea', dispenser_cafe_price, quantity);
                    },
                },
            ],
            1
        );
    }

    private async buy(action: string, item: string, price: number, quantity?: number) {
        const { completed } = await this.progressService.progress(
            'dispenser_buy',
            action,
            5000,
            {
                dictionary: 'mini@sprunk',
                name: 'plyr_buy_drink_pt1',
                flags: 16,
            },
            {
                useAnimationService: true,
                disableMovement: true,
                disableCarMovement: false,
                disableMouse: false,
                disableCombat: true,
            }
        );

        if (!completed) {
            return;
        }

        TriggerServerEvent(ServerEvent.DISPENSER_BUY, price, item, quantity ?? 1);
    }
}
