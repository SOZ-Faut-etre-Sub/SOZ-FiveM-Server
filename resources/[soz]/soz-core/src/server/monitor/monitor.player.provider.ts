import { Gauge } from 'prom-client';

import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick } from '../../core/decorators/tick';
import { ServerStateService } from '../server.state.service';

@Provider()
export class MonitorPlayerProvider {
    @Inject(ServerStateService)
    private serverStateService: ServerStateService;

    private lastPlayers: Record<string, Record<string, any>> = {};

    private playerCount: Gauge<string> = new Gauge({
        name: 'soz_player_count',
        help: 'Number of players connected',
    });

    private playerConnected: Gauge<string> = new Gauge({
        name: 'soz_player_connected',
        help: 'Is player connected',
        labelNames: ['id', 'name', 'license', 'job', 'grade'],
    });

    private playerHealth: Gauge<string> = new Gauge({
        name: 'soz_player_health',
        help: 'Player health',
        labelNames: ['id', 'name', 'license', 'job', 'grade'],
    });

    private playerArmor: Gauge<string> = new Gauge({
        name: 'soz_player_armor',
        help: 'Player armor',
        labelNames: ['id', 'name', 'license', 'job', 'grade'],
    });

    private playerHunger: Gauge<string> = new Gauge({
        name: 'soz_player_hunger',
        help: 'Player hunger',
        labelNames: ['id', 'name', 'license', 'job', 'grade'],
    });

    private playerThirst: Gauge<string> = new Gauge({
        name: 'soz_player_thirst',
        help: 'Player thirst',
        labelNames: ['id', 'name', 'license', 'job', 'grade'],
    });

    private playerOnDuty: Gauge<string> = new Gauge({
        name: 'soz_player_on_duty',
        help: 'Is player on duty',
        labelNames: ['id', 'name', 'license', 'job', 'grade'],
    });

    @Tick(5000, 'monitor:player:metrics')
    public async onTick() {
        const players = this.serverStateService.getPlayers();
        const currentPlayerIds: Record<string, Record<string, any>> = {};

        this.playerCount.set(players.length);

        for (const player of players) {
            const labels = {
                id: player.citizenid,
                name: player.charinfo.firstname + ' ' + player.charinfo.lastname,
                license: player.license,
                job: player.job.id,
                grade: player.job.grade,
            };
            const previousLabels = this.lastPlayers[player.citizenid];

            // If one label changes, we need to remove the old metric and create a new one
            for (const key of Object.keys(labels)) {
                if (previousLabels && previousLabels[key] !== labels[key]) {
                    this.playerConnected.remove(previousLabels);
                    this.playerHealth.remove(previousLabels);
                    this.playerArmor.remove(previousLabels);
                    this.playerHunger.remove(previousLabels);
                    this.playerThirst.remove(previousLabels);
                    this.playerOnDuty.remove(previousLabels);
                    break;
                }
            }

            this.playerConnected.set(labels, 1);
            this.playerHealth.set(labels, player.metadata.health);
            this.playerArmor.set(labels, player.metadata.armor.current);
            this.playerHunger.set(labels, player.metadata.hunger);
            this.playerThirst.set(labels, player.metadata.thirst);
            this.playerOnDuty.set(labels, player.job.onduty ? 1 : 0);

            delete this.lastPlayers[player.citizenid];
            currentPlayerIds[player.citizenid] = labels;
        }

        for (const labels of Object.values(this.lastPlayers)) {
            this.playerConnected.remove(labels);
            this.playerHealth.remove(labels);
            this.playerArmor.remove(labels);
            this.playerHunger.remove(labels);
            this.playerThirst.remove(labels);
            this.playerOnDuty.remove(labels);
        }

        this.lastPlayers = currentPlayerIds;
    }
}
