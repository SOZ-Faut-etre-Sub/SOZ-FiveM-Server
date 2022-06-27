import { On, Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { OnceLoader } from '../../core/loader/once.loader';
import { wait } from '../../core/utils';

@Provider()
export class PlayerProvider {
    @Inject(OnceLoader)
    private onceLoader: OnceLoader;

    @On('QBCore:Client:OnPlayerLoaded')
    playerLoaded(): void {
        this.onceLoader.trigger(OnceStep.PlayerLoaded);
    }

    @Once()
    async onStart(): Promise<void> {
        if (LocalPlayer.state.isLoggedIn) {
            await wait(0);

            this.onceLoader.trigger(OnceStep.PlayerLoaded);
        }
    }
}
