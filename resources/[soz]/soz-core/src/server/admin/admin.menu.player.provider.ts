import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../shared/event';
import { PlayerMetadata } from '../../shared/player';
import { Notifier } from '../notifier';
import { PlayerService } from '../player/player.service';

@Provider()
export class AdminMenuPlayerProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @OnEvent(ServerEvent.ADMIN_SET_METADATA)
    public onSetHealthMetadata(source: number, target: number, key: keyof PlayerMetadata, value: number) {
        this.playerService.setPlayerMetadata(target, key, value);
    }

    @OnEvent(ServerEvent.ADMIN_SET_STAMINA)
    public onSetStamina(source: number, target: number, value: number) {
        this.playerService.setPlayerMetadata(target, 'last_max_stamina_update', new Date().toUTCString());
        this.playerService.incrementMetadata(target, 'max_stamina', value, 60, 150);
    }

    @OnEvent(ServerEvent.ADMIN_SET_STRESS_LEVEL)
    public onSetStressLevel(source: number, target: number, value: number) {
        this.playerService.setPlayerMetadata(target, 'last_stress_level_update', new Date().toUTCString());
        this.playerService.incrementMetadata(target, 'stress_level', value, 0, 100);
    }

    @OnEvent(ServerEvent.ADMIN_SET_STRENGTH)
    public onSetStrength(source: number, target: number, value: number) {
        this.playerService.setPlayerMetadata(target, 'last_strength_update', new Date().toUTCString());
        this.playerService.incrementMetadata(target, 'strength', value, 60, 150);
        this.playerService.updatePlayerMaxWeight(target);
    }

    @OnEvent(ServerEvent.ADMIN_SET_AIO)
    public onSetAIO(source: number, target: number, value: 'min' | 'max') {
        this.onSetStamina(source, target, value === 'min' ? -1000 : 1000);
        this.onSetStressLevel(source, target, value === 'min' ? -1000 : 1000);
        this.onSetStrength(source, target, value === 'min' ? -1000 : 1000);

        const nutritionValue = value === 'min' ? 0 : 25;
        this.playerService.incrementMetadata(target, 'fiber', nutritionValue, 0, 25);
        this.playerService.incrementMetadata(target, 'sugar', nutritionValue, 0, 25);
        this.playerService.incrementMetadata(target, 'protein', nutritionValue, 0, 25);
        this.playerService.incrementMetadata(target, 'lipid', nutritionValue, 0, 25);
        const newHealthLevel = this.playerService.incrementMetadata(
            target,
            'health_level',
            value === 'min' ? 0 : 100,
            0,
            100
        );

        if (newHealthLevel !== null) {
            let maxHealth = 200;

            if (newHealthLevel < 20) {
                maxHealth = 120;
            } else if (newHealthLevel < 40) {
                maxHealth = 160;
            }

            this.playerService.setPlayerMetadata(target, 'max_health', maxHealth);
        }
    }

    @OnEvent(ServerEvent.ADMIN_RESET_SKIN)
    public async onResetSkin(source: number, target: number) {
        TriggerClientEvent(ClientEvent.CHARACTER_REQUEST_CHARACTER_WIZARD, target);
        this.notifier.notify(source, 'Le skin du joueur a été reset.');
    }

    @OnEvent(ServerEvent.ADMIN_RESET_HALLOWEEN)
    public async onResetHalloween(source: number, target: number) {
        this.playerService.setPlayerMetadata(target, 'halloween2022', {
            scenario1: null,
        });
        this.notifier.notify(source, `La progression du joueur a été réinitialisée.`, 'info');
    }
}
