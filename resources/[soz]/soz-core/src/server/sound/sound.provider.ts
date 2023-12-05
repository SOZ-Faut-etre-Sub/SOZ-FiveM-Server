import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { ServerEvent } from '@public/shared/event';

import { SoundService } from './sound.service';

@Provider()
export class SoundProvider {
    @Inject(SoundService)
    public soundService: SoundService;

    @OnEvent(ServerEvent.SOUND_GLOBAL_INIT)
    public globalCheck(source: number) {
        this.soundService.playGlobalForPlayer(source);
    }
}
