import { Provider } from '../../core/decorators/provider';

@Provider()
export class VoipService {
    public mutePlayer(value: boolean) {
        exports['soz-voip'].MutePlayer(value);
    }
}
