import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { RpcServerEvent } from '@public/shared/rpc';

import { Notifier } from '../notifier';
import { RebootProvider } from '../reboot/reboot.provider';
import { SoundService } from '../sound/sound.service';

@Provider()
export class MeteorProvider {
    @Inject(SoundService)
    public soundService: SoundService;

    @Inject(RebootProvider)
    public rebootProvider: RebootProvider;

    @Inject(Notifier)
    public notifier: Notifier;

    @Rpc(RpcServerEvent.ADMIN_METEOR_SIREN)
    public isMeteorSirenRunning() {
        const sound = this.soundService.getGlobal();

        return sound && sound.name == 'system/reboot';
    }

    @OnEvent(ServerEvent.ADMIN_METEOR_SIREN_TOOGLE)
    public toggleMetorSiren(source: number, value: boolean) {
        this.soundService.stopGlobal();
        if (value) {
            this.soundService.playGlobal({
                name: 'system/reboot',
                volume: 0.05,
            });
        }
    }

    @OnEvent(ServerEvent.ADMIN_METEOR_ACTIVATE)
    public activate(source: number) {
        TriggerClientEvent(ClientEvent.METEOR_START, -1);
        this.notifier.notify(source, 'Lancement météorite...');
    }

    @OnEvent(ServerEvent.ADMIN_METEOR_MUSIC_ACTIVATE)
    public activateMusic(source: number, value: boolean) {
        TriggerClientEvent(ClientEvent.METEOR_MUSIC_ACTIVATE, -1, value);
    }

    @OnEvent(ServerEvent.ADMIN_METEOR_KICK_PLAYERS)
    public kickPlayers() {
        this.rebootProvider.kickAll(
            "L'impact de la météorite vous a assommé, vous pourrez vous réveillez dans quelques minutes..."
        );
    }
}
