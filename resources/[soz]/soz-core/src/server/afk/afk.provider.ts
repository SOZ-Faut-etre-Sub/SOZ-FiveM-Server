import { Command } from '../../core/decorators/command';
import { On } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ServerEvent } from '../../shared/event';
import { Notifier } from '../notifier';
import { Store } from '../store/store';

@Provider()
export class AfkProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Inject('Store')
    private store: Store;

    @On(ServerEvent.AFK_KICK)
    async kickPlayerForAFK(source: string): Promise<void> {
        DropPlayer(source, 'Tu as été AFK trop longtemps...');
    }

    @Command('afk', { role: 'admin' })
    setAFK(source: number, status?: string): void {
        const disableAFK = status === 'off' || status === 'false';
        this.store.dispatch.global.update({ disableAFK });

        this.notifier.notify(
            source,
            `Mise a jour de l'AFK global: ${disableAFK ? '~r~Désactivé' : '~g~Activé'}`,
            'info'
        );
    }
}
