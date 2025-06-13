import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { wait } from '@public/core/utils';
import { ClientEvent } from '@public/shared/event';
import { getDistance, Vector3 } from '@public/shared/polyzone/vector';

import { Provider } from '../../core/decorators/provider';
import { AudioService } from '../nui/audio.service';
import { ObjectService } from '../object/object.service';

@Provider()
export class ThunderProvider {
    @Inject(ObjectService)
    public objectService: ObjectService;

    @Inject(AudioService)
    public audioService: AudioService;

    @OnEvent(ClientEvent.THUNDER)
    public async thunder(target: number, coords: Vector3) {
        const entity = await this.objectService.createObject({
            id: 'dummy',
            model: GetHashKey('bolts1'),
            position: [coords[0], coords[1], coords[2], 0],
        });
        const playerCoords = GetEntityCoords(PlayerPedId()) as Vector3;
        const dist = getDistance(playerCoords, coords);

        const coef = 1 - dist / 300;
        if (coef > 0) {
            this.audioService.playAudio('audio/lightning.ogg', coef);
        }

        if (target == GetPlayerServerId(PlayerId())) {
            AddExplosion(coords[0], coords[1], coords[2], 0, 1.0, false, false, 5);
        }

        await wait(600);
        DeleteEntity(entity);
    }
}
