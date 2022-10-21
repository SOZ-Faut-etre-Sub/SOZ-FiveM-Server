import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { NuiDispatch } from './nui.dispatch';

@Provider()
export class AudioService {
    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    public async playAudio(path: string, volume = 0.5): Promise<void> {
        this.nuiDispatch.dispatch('audio', 'PlayAudio', { path, volume });
    }
}
