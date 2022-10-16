import { Injectable } from '../core/decorators/injectable';

@Injectable()
export class SoundService {
    public playAround(name: string, distance: number, duration: number) {
        TriggerServerEvent('InteractSound_SV:PlayWithinDistance', distance, name, duration);
    }
}
