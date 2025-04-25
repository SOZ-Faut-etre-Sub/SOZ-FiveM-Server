import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { ServerEvent } from '@public/shared/event';
import { writeFile } from 'fs/promises';

import { PlayerService } from '../player/player.service';

@Provider()
export class PropImageProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @OnEvent(ServerEvent.SCREENSHOT)
    public async onScreenShot(source: number, name: string, data: string) {
        const player = this.playerService.getPlayer(source);
        if (player?.role !== 'admin') {
            return;
        }

        data = data.replace('data:image/webp;base64,', '');
        const image = Buffer.from(data, 'base64');

        await writeFile(name + '.webp', image);
    }
}
