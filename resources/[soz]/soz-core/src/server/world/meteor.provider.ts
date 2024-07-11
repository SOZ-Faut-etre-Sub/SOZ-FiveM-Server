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

    private siren = 0;
    private music = 0;

    @Rpc(RpcServerEvent.ADMIN_METEOR_SIREN)
    public isMeteorSirenRunning() {
        return [this.siren, this.music];
    }

    @OnEvent(ServerEvent.ADMIN_METEOR_SIREN)
    public toggleMetorSiren(source: number, value: number) {
        this.siren = value;
        TriggerClientEvent(ClientEvent.METEOR_SIREN, -1, value);
    }

    @OnEvent(ServerEvent.ADMIN_METEOR_ACTIVATE)
    public activate(source: number) {
        TriggerClientEvent(ClientEvent.METEOR_START, -1);
        this.notifier.notify(source, 'Lancement météorite...');
        this.music = 0;
        this.siren = 0;
    }

    @OnEvent(ServerEvent.ADMIN_METEOR_MUSIC)
    public activateMusic(source: number, value: number) {
        this.music = value;
        TriggerClientEvent(ClientEvent.METEOR_MUSIC, -1, value);
    }

    @OnEvent(ServerEvent.ADMIN_METEOR_KICK_PLAYERS)
    public kickPlayers() {
        this.rebootProvider.kickAll(
            "L'impact de la météorite vous a assommé, vous pourrez vous réveiller dans quelques minutes..."
        );
    }
}
