import { Once, OnceStep, OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { AnimationService } from '../animation/animation.service';
import { NuiDispatch } from '../nui/nui.dispatch';
import { ItemService } from './item.service';

@Provider()
export class ItemProvider {
    @Inject(ItemService)
    private item: ItemService;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @Once(OnceStep.NuiLoaded)
    async onStart(): Promise<void> {
        this.nuiDispatch.dispatch('item', 'SetItems', this.item.getItems());
    }

    @OnEvent(ClientEvent.ITEM_UMBRELLA_TOGGLE)
    async onUmbrellaToggle(): Promise<void> {
        this.animationService.toggleAnimation({
            base: {
                dictionary: 'amb@world_human_drinking@coffee@male@base',
                name: 'base',
                options: {
                    repeat: true,
                    freezeLastFrame: true,
                    onlyUpperBody: true,
                    enablePlayerControl: true,
                },
            },
            props: [
                {
                    bone: 57005,
                    model: 'p_amb_brolly_01',
                    position: [0.12, 0.005, 0.0],
                    rotation: [280.0, 10.0, 350.0],
                },
            ],
        });
    }
}
