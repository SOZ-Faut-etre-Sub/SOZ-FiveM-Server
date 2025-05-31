import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { Monitor } from '@public/server/monitor/monitor';
import { Notifier } from '@public/server/notifier';
import { ServerEvent } from '@public/shared/event';
import { RpcServerEvent } from '@public/shared/rpc';

@Provider()
export class PoliceSecretProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(Monitor)
    private monitor: Monitor;

    private done = false;

    @Rpc(RpcServerEvent.POLICE_SECRET_CHECK)
    public secretCheck(source: number) {
        if (this.done) {
            this.notifier.error(source, "le PC est vérouillé jusqu'à demain");
        }
        return !this.done;
    }

    @OnEvent(ServerEvent.POLICE_SECRET)
    public onSevret(source: number, success: boolean) {
        if (this.done) {
            return;
        }
        this.done = true;

        if (success) {
            this.notifier.notify(
                source,
                "Le dossier contenant les photos nue de O'reilly est atrocement torride, remettant en question votre orientation sexuelle.",
                'success'
            );
        } else {
            this.notifier.notify(
                source,
                "Vous n'avez pas réussit à trouver le mot de passe, le PC s'est vérouillé jusqu'à demain.",
                'error'
            );
        }

        this.monitor.traceEvent('police_secret', {
            player_source: source,
            success,
        });
    }
}
