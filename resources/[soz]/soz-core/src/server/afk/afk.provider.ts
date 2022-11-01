import { Command } from '../../core/decorators/command';
import { On, Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ServerEvent } from '../../shared/event';
import { Notifier } from '../notifier';

@Provider()
export class AfkProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Once()
    onStart(): void {
        GlobalState.disableAFK ||= false;
    }

    @On(ServerEvent.AFK_KICK)
    async kickPlayerForAFK(source: string): Promise<void> {
        DropPlayer(source, 'Tu as été AFK trop longtemps...');
    }

    @Command('afk', { role: 'admin' })
    setAFK(source: number, status?: string): void {
        GlobalState.disableAFK = status === 'off' || status === 'false';

        this.notifier.notify(
            source,
            `Mise a jour de l'AFK global: ${GlobalState.disableAFK ? '~r~Désactivé' : '~g~Activé'}`,
            'info'
        );
    }
}
