import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { AdminPlayer } from '../../shared/admin/admin';
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
    public onSetHealthMetadata(source: number, player: AdminPlayer, key: keyof PlayerMetadata, value: number) {
        this.playerService.setPlayerMetadata(player.id, key, value);
    }

    @OnEvent(ServerEvent.ADMIN_SET_STAMINA)
    public onSetStamina(source: number, player: AdminPlayer, value: number) {
        this.playerService.setPlayerMetadata(player.id, 'last_max_stamina_update', new Date().toUTCString());
        this.playerService.setPlayerMetadata(player.id, 'max_stamina', value);
    }

    @OnEvent(ServerEvent.ADMIN_SET_STRESS_LEVEL)
    public onSetStressLevel(source: number, player: AdminPlayer, value: number) {
        this.playerService.setPlayerMetadata(player.id, 'last_stress_level_update', new Date().toUTCString());
        this.playerService.setPlayerMetadata(player.id, 'stress_level', value);
    }

    @OnEvent(ServerEvent.ADMIN_SET_STRENGTH)
    public onSetStrength(source: number, player: AdminPlayer, value: number) {
        this.playerService.setPlayerMetadata(player.id, 'last_strength_update', new Date().toUTCString());
        this.playerService.setPlayerMetadata(player.id, 'strength', value);
        this.playerService.updatePlayerMaxWeight(player.id);
    }

    @OnEvent(ServerEvent.ADMIN_SET_AIO)
    public onSetAIO(source: number, player: AdminPlayer, value: 'min' | 'max') {
        this.onSetStamina(source, player, value === 'min' ? -1000 : 1000);
        this.onSetStressLevel(source, player, value === 'min' ? -1000 : 1000);
        this.onSetStrength(source, player, value === 'min' ? -1000 : 1000);

        const nutritionValue = value === 'min' ? 0 : 25;
        this.playerService.setPlayerMetadata(player.id, 'fiber', nutritionValue);
        this.playerService.setPlayerMetadata(player.id, 'sugar', nutritionValue);
        this.playerService.setPlayerMetadata(player.id, 'protein', nutritionValue);
        this.playerService.setPlayerMetadata(player.id, 'lipid', nutritionValue);
        const newHealthLevel = this.playerService.incrementMetadata(
            player.id,
            'health_level',
            value === 'min' ? -100 : 100,
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

            this.playerService.setPlayerMetadata(player.id, 'max_health', maxHealth);
        }
    }

    @OnEvent(ServerEvent.ADMIN_RESET_SKIN)
    public async onResetSkin(source: number, target: number) {
        TriggerClientEvent(ClientEvent.CHARACTER_REQUEST_CHARACTER_WIZARD, target);
        this.notifier.notify(source, 'Le skin du joueur a été reset.');
    }

    @OnEvent(ServerEvent.ADMIN_RESET_HALLOWEEN)
    public async onResetHalloween(source: number, target: number, year: '2022', scenario: 'scenario1' | 'scenario2') {
        this.playerService.setPlayerMetadata(target, `halloween2022`, {
            ...this.playerService.getPlayer(target).metadata.halloween2022,
            [scenario]: null,
        });
        this.notifier.notify(
            source,
            `La progression du joueur ~b~Halloween ${year} (${scenario})~s~ a été réinitialisée.`,
            'info'
        );
    }
}
