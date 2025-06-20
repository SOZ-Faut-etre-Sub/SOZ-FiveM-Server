import { Provider } from '@core/decorators/provider';
import { CasinoService } from '@private/client/casino/casino.service';
import { LaserGameProvider } from '@public/client/games/laser/laser.game.provider';
import { VampireGameProvider } from '@public/client/story/vampire.game.provider';
import { VampireGameStateProvider } from '@public/client/story/vampire.game.state.provider';
import { Inject } from '@public/core/decorators/injectable';

@Provider()
export class GamesProvider {
    @Inject(LaserGameProvider)
    private laserGameProvider: LaserGameProvider;

    @Inject(VampireGameStateProvider)
    private vampireGameStateProvider: VampireGameStateProvider;

    @Inject(VampireGameProvider)
    private vampireGameProvider: VampireGameProvider;

    @Inject(CasinoService)
    private casinoService: CasinoService;

    public areAnyGameRunning() {
        return (
            this.laserGameProvider.isGameRunning() ||
            this.vampireGameStateProvider.isGameRunning() ||
            this.casinoService.usingMinigame()
        );
    }

    public async handleOnDeath(): Promise<boolean> {
        if (this.laserGameProvider.isGameRunning()) {
            await this.laserGameProvider.handleOnDeath();
            return true;
        } else if (this.vampireGameStateProvider.isGameRunning()) {
            await this.vampireGameProvider.handleOnDeath();
            return true;
        }

        return false;
    }
}
