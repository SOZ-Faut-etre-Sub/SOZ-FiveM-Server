import { Once, OnceStep, OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../../shared/event';
import { Feature, isFeatureEnabled } from '../../../shared/features';
import { PlayerService } from '../../player/player.service';
import { TargetFactory } from '../../target/target.factory';

@Provider()
export class FoodMealsProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    private orderInProgress = false;

    @OnEvent(ClientEvent.FOOD_UPDATE_ORDER)
    public onUpdateOrder(order: boolean) {
        this.orderInProgress = order;
    }

    @Once(OnceStep.PlayerLoaded)
    onPlayerLoaded() {
        if (!isFeatureEnabled(Feature.MyBodySummer)) {
            return;
        }
        TriggerServerEvent(ServerEvent.FOOD_RETRIEVE_STATE);
        this.targetFactory.createForBoxZone(
            'food_meals_provider',
            {
                center: [-1388.57, -744.79, 24.63],
                width: 1.0,
                length: 3.9,
                heading: 37,
                minZ: 23.63,
                maxZ: 26.08,
            },
            [
                {
                    label: 'Commander',
                    icon: 'c:food/order.png',
                    job: 'food',
                    canInteract: () => {
                        return this.playerService.isOnDuty() && !this.orderInProgress;
                    },
                    action: this.doOrderMeals.bind(this),
                },
                {
                    label: 'Récupérer la commande',
                    icon: 'c:food/retrieve-order.png',
                    job: 'food',
                    canInteract: () => {
                        return this.playerService.isOnDuty() && this.orderInProgress;
                    },
                    action: this.doRetrieveOrder.bind(this),
                },
            ]
        );
    }

    private doOrderMeals() {
        TriggerServerEvent(ServerEvent.FOOD_ORDER_MEALS);
    }

    private doRetrieveOrder() {
        TriggerServerEvent(ServerEvent.FOOD_RETRIEVE_ORDER);
    }
}
