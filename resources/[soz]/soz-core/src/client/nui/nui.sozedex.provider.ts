import { OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, NuiEvent } from '../../shared/event';
import { AnimationService } from '../animation/animation.service';
import { NuiDispatch } from './nui.dispatch';

@Provider()
export class NuiSozedexProvider {
    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(AnimationService)
    private animationService: AnimationService;

    @OnEvent(ClientEvent.NUI_SHOW_SOZEDEX)
    public showSozedex() {
        // TODO : Get player sozedex completion
        const playerCompletion = [];

        this.nuiDispatch.dispatch('sozedex', 'ShowSozedex', playerCompletion);

        this.animationService.playAnimation({
            base: {
                name: 'idle_a',
                dictionary: 'amb@code_human_in_bus_passenger_idles@female@tablet@idle_a',
                options: {
                    repeat: true,
                    onlyUpperBody: true,
                },
            },
        });
    }

    @OnNuiEvent(NuiEvent.SozedexClosed)
    public async onSozedexClosed() {
        this.animationService.stop();
    }

    @OnEvent(ClientEvent.NUI_HIDE_SOZEDEX)
    public hideSozedex() {
        this.nuiDispatch.dispatch('sozedex', 'HideSozedex');
    }
}
