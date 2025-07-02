import { OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, NuiEvent, ServerEvent } from '../../shared/event';
import { AnimationService } from '../animation/animation.service';
import { NuiDispatch } from './nui.dispatch';

@Provider()
export class NuiPanelProvider {
    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(AnimationService)
    private animationService: AnimationService;

    private zpadInventorySlot: number = null;

    @OnEvent(ClientEvent.NUI_SHOW_PANEL)
    public showPanel(url: string, zpadInventorySlot: number) {
        this.nuiDispatch.dispatch('panel', 'ShowPanel', url);

        this.zpadInventorySlot = zpadInventorySlot;

        this.animationService.playAnimation({
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
        this.animationService.stop();

        if (this.zpadInventorySlot) {
            TriggerServerEvent(ServerEvent.PANEL_UPDATE_ITEM_URL, this.zpadInventorySlot, '');
            this.zpadInventorySlot = null;
        }
    }

    @OnNuiEvent(NuiEvent.PanelUpdateItemUrl)
    public async onPanelUpdate(url: string) {
        if (!this.zpadInventorySlot) return;

        TriggerServerEvent(ServerEvent.PANEL_UPDATE_ITEM_URL, this.zpadInventorySlot, url);
        this.zpadInventorySlot = null;
    }

    @OnEvent(ClientEvent.NUI_HIDE_PANEL)
    public hidePanel() {
        this.nuiDispatch.dispatch('panel', 'HidePanel');
    }
}
