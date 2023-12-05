import { Injectable } from '../core/decorators/injectable';
import { uuidv4 } from '../core/utils';
import { ClientEvent } from '../shared/event';

@Injectable()
export class AudioService {
    public playAudio(source: number, path: string, volume = 0.5): string {
        const id = uuidv4();
        TriggerClientEvent(ClientEvent.AUDIO_PLAY, source, { path, volume, id });

        return id;
    }

    public stopAudio(source: number, id: string): void {
        TriggerClientEvent(ClientEvent.AUDIO_STOP, source, id);
    }
}
