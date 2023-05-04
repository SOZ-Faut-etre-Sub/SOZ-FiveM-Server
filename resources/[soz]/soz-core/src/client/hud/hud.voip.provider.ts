import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent } from '../../shared/event';
import { VoiceMode } from '../../shared/hud';
import { NuiDispatch } from '../nui/nui.dispatch';

@Provider()
export class HudVoipProvider {
    @Inject(NuiDispatch)
    private readonly nuiDispatch: NuiDispatch;

    @OnEvent(ClientEvent.VOIP_UPDATE_MODE)
    public updateVoipMode(mode: VoiceMode): void {
        this.nuiDispatch.dispatch('hud', 'UpdateVoiceMode', mode);
    }
}
