import { AnimationRunner } from '@public/client/animation/animation.factory';

import { OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, NuiEvent } from '../../shared/event';
import { AnimationRunner } from '../animation/animation.factory';
import { AnimationService } from '../animation/animation.service';
import { NuiDispatch } from './nui.dispatch';

@Provider()
export class NuiPanelProvider {
    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(AnimationService)
    private animationService: AnimationService;

    private anim: AnimationRunner = null;

    @OnEvent(ClientEvent.NUI_SHOW_PANEL)
    public showPanel(url: string) {
        this.nuiDispatch.dispatch('panel', 'ShowPanel', url);

        this.anim = this.animationService.playAnimation({
            base: {
                name: 'idle_a',
                dictionary: 'amb@code_human_in_bus_passenger_idles@female@tablet@idle_a',
                options: {
                    repeat: true,
                    onlyUpperBody: true,
                },
            },
            props: [
                {
                    bone: 28422,
                    model: 'prop_cs_tablet',
                    position: [-0.05, 0, 0],
                    rotation: [0, 0, 0],
                },
            ],
        });
    }

    @OnNuiEvent(NuiEvent.PanelClosed)
    public async onPanelClosed() {
        if (!this.anim) {
            return;
        }

        this.anim.cancel();
        this.anim = null;
    }

    @OnEvent(ClientEvent.NUI_HIDE_PANEL)
    public hidePanel() {
        this.nuiDispatch.dispatch('panel', 'HidePanel');
    }
}
