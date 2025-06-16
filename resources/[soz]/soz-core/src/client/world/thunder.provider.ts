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
    public async thunder(target: number, coords: Vector3, v2: boolean) {
        const playerCoords = GetEntityCoords(PlayerPedId()) as Vector3;
        const dist = getDistance(playerCoords, coords);

        const coef = 1 - dist / 300;
        if (coef > 0) {
            this.audioService.playAudio('audio/lightning.mp3', coef * 0.3);
        }

        await wait(500);
        const entities: number[] = [];
        if (!v2) {
            entities.push(
                await this.objectService.createObject({
                    id: 'dummy1',
                    model: GetHashKey('nibthor_beam'),
                    position: [coords[0], coords[1], coords[2] - 1, 0],
                })
            );
        } else {
            entities.push(
                await this.objectService.createObject({
                    id: 'dummy2',
                    model: GetHashKey('nibthor_bolts1'),
                    position: [coords[0] - 0.3, coords[1] - 0.3, coords[2] - 1, 0],
                })
            );
            entities.push(
                await this.objectService.createObject({
                    id: 'dummy3',
                    model: GetHashKey('nibthor_bolts2'),
                    position: [coords[0] + 0.5, coords[1], coords[2] - 1, 0],
                    rotation: [0, 0, -75],
                })
            );
            entities.push(
                await this.objectService.createObject({
                    id: 'dummy4',
                    model: GetHashKey('nibthor_bolts3'),
                    position: [coords[0], coords[1] + 0.5, coords[2] - 1, 0],
                    rotation: [0, 0, 75],
                })
            );
            entities.push(
                await this.objectService.createObject({
                    id: 'dummy5',
                    model: GetHashKey('nibthor_bolts_resultrays'),
                    position: [coords[0], coords[1], coords[2] - 0.9, 0],
                })
            );
        }

        if (target == GetPlayerServerId(PlayerId())) {
            AddExplosion(coords[0], coords[1], coords[2], 6, 1.0, false, false, 5);
        }

        await wait(600);
        for (const entity of entities) {
            DeleteEntity(entity);
        }
    }
}
