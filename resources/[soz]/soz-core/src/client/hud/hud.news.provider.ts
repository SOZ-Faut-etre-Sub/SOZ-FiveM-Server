import { OnEvent } from '../../core/decorators/event';
import { Exportable } from '../../core/decorators/exports';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { NuiDispatch } from '../nui/nui.dispatch';

@Provider()
export class HudNewsProvider {
    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @Exportable('EnableTwitchNewsOverlay')
    public enableTwitchNewsOverlay(): void {
        this.nuiDispatch.dispatch('hud', 'SetTwitchNewsOverlay', true);
    }

    @Exportable('DisableTwitchNewsOverlay')
    public disableTwitchNewsOverlay(): void {
        this.nuiDispatch.dispatch('hud', 'SetTwitchNewsOverlay', false);
    }

    @OnEvent(ClientEvent.NEWS_DRAW)
    public drawNews(type: string, message: string, reporter: string, job: string): void {
        this.nuiDispatch.dispatch('hud', 'AddNews', {
            type,
            message,
            reporter,
            job,
        });
    }
}
