import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { wait } from '@public/core/utils';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { Parade } from '@public/shared/story/parade';

import { Provider } from '../../core/decorators/provider';
import { Notifier } from '../notifier';
import { PermissionService } from '../permission.service';
import { SoundService } from '../sound/sound.service';

const musicfile = 'https://cfx-nui-soz-sounds/parade/parade.mp3';

@Provider()
export class ParadeProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(SoundService)
    private soundService: SoundService;

    @Inject(PermissionService)
    private permissionService: PermissionService;

    private running = false;
    private stopped = false;

    @OnEvent(ServerEvent.ADMIN_PARADE_START)
    public async parade(source: number, start: boolean) {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        if (!start) {
            if (this.running) {
                this.notifier.notify(source, "Parade en cours d'arrêt");
            } else {
                this.notifier.notify(source, 'Arrët de la parade');
            }
            this.stopped = true;
            TriggerClientEvent(ClientEvent.PARADE_DELETE, -1);
            this.soundService.stop(-1, musicfile);

            return;
        }

        if (this.running) {
            this.notifier.error(source, 'Une parade est déjà en cours');
            return;
        }

        this.running = true;
        this.stopped = false;

        TriggerClientEvent(ClientEvent.PARADE_INIT, -1);

        await wait(5000);

        this.soundService.play(-1, musicfile, 0.1);
        for (let i = 0; i < Parade.blocks.length; i++) {
            if (Parade.blocks[i].delay) {
                await wait(Parade.blocks[i].delay);
                if (this.stopped) {
                    this.notifier.notify(source, 'Arrët de la parade');
                    this.running = false;
                    this.stopped = false;
                    return;
                }
            }
            TriggerClientEvent(ClientEvent.PARADE_SPAWN, -1, i);
        }
        this.running = false;
        this.stopped = false;
    }
}
