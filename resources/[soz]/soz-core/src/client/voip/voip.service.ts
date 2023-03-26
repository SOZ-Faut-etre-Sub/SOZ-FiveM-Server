import { Injectable } from '@public/core/decorators/injectable';

@Injectable()
export class VoipService {
    public mutePlayer(value: boolean) {
        exports['soz-voip'].MutePlayer(value);
    }

    public setPlayerMegaphoneInUse(value: boolean, range: number) {
        exports['soz-voip'].SetPlayerMegaphoneInUse(value, range);
    }
}
