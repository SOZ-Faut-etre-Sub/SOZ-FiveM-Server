import { Injectable } from '@core/decorators/injectable';
import { Vector3 } from '@public/shared/polyzone/vector';

type GlobalSound = {
    name: string;
    location: Vector3;
    maxDistance: number;
    volume?: number;
};

@Injectable()
export class SoundService {
    private globalSound: GlobalSound;

    public playGlobal(sound: GlobalSound) {
        this.globalSound = sound;
        TriggerClientEvent(
            'InteractSound_CL:PlayWithinDistanceRatioLoop',
            -1,
            sound.location,
            sound.maxDistance,
            sound.name,
            sound.volume
        );
    }

    public stopGlobal() {
        this.globalSound = null;
        TriggerClientEvent('InteractSound_CL:Stoploop', -1);
    }

    public playGlobalForPlayer(source: number) {
        if (this.globalSound) {
            TriggerClientEvent(
                'InteractSound_CL:PlayWithinDistanceRatioLoop',
                source,
                this.globalSound.location,
                this.globalSound.maxDistance,
                this.globalSound.name,
                this.globalSound.volume
            );
        }
    }

    public play(source: number, name: string, volume: number) {
        TriggerClientEvent('InteractSound_CL:PlayOnOne', source, name, volume);
    }

    public playAround(source: number, name: string, distance: number, volume: number) {
        TriggerEvent('InteractSound_SV:PlayWithinDistance', distance, name, volume);
    }
}
