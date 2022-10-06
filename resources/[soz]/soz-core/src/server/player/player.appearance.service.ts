import { OnEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Outfit } from '../../shared/cloth';
import { ServerEvent } from '../../shared/event';
import { QBCore } from '../qbcore';
import { ProgressService } from './progress.service';

@Provider()
export class PlayerAppearanceService {
    @Inject(QBCore)
    private QBCore: QBCore;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @OnEvent(ServerEvent.PLAYER_APPEARANCE_SET_JOB_OUTFIT)
    public async setJobOutfit(source: number, outfit: Outfit, apply = true, progress = true) {
        const player = this.QBCore.getPlayer(source);

        if (player) {
            const config = player.PlayerData.cloth_config;
            config.JobClothSet = outfit;
            config.TemporaryClothSet = null;

            if (apply && progress) {
                await this.progressService.progress(
                    source,
                    'switch_clothes',
                    "Changement d'habits...",
                    5000,
                    {
                        name: 'male_shower_towel_dry_to_get_dressed',
                        dictionary: 'anim@mp_yacht@shower@male@',
                        options: {
                            cancellable: false,
                            enablePlayerControl: false,
                        },
                    },
                    {
                        disableCombat: true,
                        disableMovement: true,
                    }
                );
            }

            player.Functions.SetClothConfig(config, !apply);
        }
    }

    @OnEvent(ServerEvent.PLAYER_APPEARANCE_REMOVE_JOB_OUTFIT)
    public async removeJobOutfit(source: number, apply = true, progress = true) {
        const player = this.QBCore.getPlayer(source);

        if (player) {
            const config = player.PlayerData.cloth_config;
            config.JobClothSet = null;

            if (apply && progress) {
                await this.progressService.progress(
                    source,
                    'switch_clothes',
                    "Changement d'habits...",
                    5000,
                    {
                        name: 'male_shower_towel_dry_to_get_dressed',
                        dictionary: 'anim@mp_yacht@shower@male@',
                        options: {
                            cancellable: false,
                            enablePlayerControl: false,
                        },
                    },
                    {
                        disableCombat: true,
                        disableMovement: true,
                    }
                );
            }

            player.Functions.SetClothConfig(config, !apply);
        }
    }

    @OnEvent(ServerEvent.PLAYER_APPEARANCE_SET_TEMP_OUTFIT)
    public async setTempOutfit(source: number, outfit: Outfit, apply = true, progress = true) {
        const player = this.QBCore.getPlayer(source);

        if (player) {
            const config = player.PlayerData.cloth_config;
            config.TemporaryClothSet = outfit;

            if (apply && progress) {
                await this.progressService.progress(
                    source,
                    'switch_clothes',
                    "Changement d'habits...",
                    5000,
                    {
                        name: 'male_shower_towel_dry_to_get_dressed',
                        dictionary: 'anim@mp_yacht@shower@male@',
                        options: {
                            cancellable: false,
                            enablePlayerControl: false,
                        },
                    },
                    {
                        disableCombat: true,
                        disableMovement: true,
                    }
                );
            }

            player.Functions.SetClothConfig(config, !apply);
        }
    }

    @OnEvent(ServerEvent.PLAYER_APPEARANCE_REMOVE_TEMP_OUTFIT)
    public async removeTempOutfit(source: number, apply = true, progress = true) {
        const player = this.QBCore.getPlayer(source);

        if (player) {
            const config = player.PlayerData.cloth_config;
            config.TemporaryClothSet = null;

            if (apply && progress) {
                await this.progressService.progress(
                    source,
                    'switch_clothes',
                    "Changement d'habits...",
                    5000,
                    {
                        name: 'male_shower_towel_dry_to_get_dressed',
                        dictionary: 'anim@mp_yacht@shower@male@',
                        options: {
                            cancellable: false,
                            enablePlayerControl: false,
                        },
                    },
                    {
                        disableCombat: true,
                        disableMovement: true,
                    }
                );
            }

            player.Functions.SetClothConfig(config, !apply);
        }
    }
}
