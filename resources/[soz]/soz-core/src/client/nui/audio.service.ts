import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { uuidv4 } from '../../core/utils';
import { Audio } from '../../shared/audio';
import { ClientEvent } from '../../shared/event';
import { NuiDispatch } from './nui.dispatch';

@Provider()
export class AudioService {
    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    public playAudio(path: string, volume = 0.5): string {
        const id = uuidv4();
        this.nuiDispatch.dispatch('audio', 'PlayAudio', { path, volume, id });

        return id;
    }

    @OnEvent(ClientEvent.AUDIO_STOP)
    public stopAudio(id: string): void {
        this.nuiDispatch.dispatch('audio', 'StopAudio', id);
    }

    @OnEvent(ClientEvent.AUDIO_PLAY)
    public startAudio(audio: Audio): void {
        this.nuiDispatch.dispatch('audio', 'PlayAudio', audio);
    }
}
