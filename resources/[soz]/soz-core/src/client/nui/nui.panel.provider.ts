import { OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, NuiEvent } from '../../shared/event';
import { Vector3 } from '../../shared/polyzone/vector';
import { AnimationService } from '../animation/animation.service';
import { NuiDispatch } from './nui.dispatch';

@Provider()
export class NuiPanelProvider {
    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(AnimationService)
    private animationService: AnimationService;

    private tablet = null;

    @OnEvent(ClientEvent.NUI_SHOW_PANEL)
    public showPanel(url: string) {
        this.nuiDispatch.dispatch('panel', 'ShowPanel', url);

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

        const ped = PlayerPedId();
        const playerPosition = GetEntityCoords(ped, true) as Vector3;

        this.tablet = CreateObject(
            GetHashKey('prop_cs_tablet'),
            playerPosition[0],
            playerPosition[1],
            playerPosition[2],
            true,
            true,
            true
        );

        const netId = ObjToNet(this.tablet);
        SetNetworkIdCanMigrate(netId, false);
        AttachEntityToEntity(
            this.tablet,
            ped,
            GetPedBoneIndex(PlayerPedId(), 28422),
            -0.05,
            0.0,
            0.0,
            0.0,
            0.0,
            0.0,
            true,
            true,
            false,
            true,
            0,
            true
        );
    }

    @OnNuiEvent(NuiEvent.PanelClosed)
    public async onPanelClosed() {
        if (!this.tablet) {
            return;
        }

        DeleteEntity(this.tablet);
        this.tablet = null;
        this.animationService.stop();
    }

    @OnEvent(ClientEvent.NUI_HIDE_PANEL)
    public hidePanel() {
        this.nuiDispatch.dispatch('panel', 'HidePanel');
    }
}
