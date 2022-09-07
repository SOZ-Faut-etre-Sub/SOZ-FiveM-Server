import { Command } from '../../core/decorators/command';
import { Once } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Notifier } from '../notifier';

@Provider()
export class AfkProvider {
    @Inject(Notifier)
    private notifier: Notifier;

    @Once()
    onStart(): void {
        GlobalState.disableAFK ||= false;
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
