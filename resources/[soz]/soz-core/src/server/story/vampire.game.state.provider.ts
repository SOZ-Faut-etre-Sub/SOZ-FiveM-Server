import { Provider } from '@public/core/decorators/provider';
import { Vector3, Vector4 } from '@public/shared/polyzone/vector';
import PCancelable from 'p-cancelable';
import { Gauge } from 'prom-client';

import { VampireGameCollection, VampireGameRole } from '../../shared/halloween';

@Provider()
export class VampireGameStateProvider {
    public started = false;
    public timer = null;

    public excludedPlayers: Set<string> = new Set<string>();
    public playerRoles = new Map<string, VampireGameRole>();

    public originalPlayerPositions = new Map<string, Vector4>();

    public mortalObjectivePart1 = new Map<VampireGameCollection, Vector3[]>();
    public mortalObjectivePart2 = {
        battery: { finished: false, players: new Set<string>() },
        dam: { finished: false, players: new Set<string>() },
        vampire: { finished: false, players: new Set<string>() },
        weapon: { finished: false, players: new Set<string>() },
    };
    public mortalObjectivePart3 = null;

    public autoRespawn = new Map<string, PCancelable<void>>();

    public gauges = {
        [VampireGameRole.Vampire]: new Gauge({
            name: 'soz_halloween_vampire_count',
            help: 'Number of Vampire in halloween game',
        }),
        [VampireGameRole.Ghoul]: new Gauge({
            name: 'soz_halloween_ghoul_count',
            help: 'Number of Ghoul in halloween game',
        }),
        [VampireGameRole.Hunter]: new Gauge({
            name: 'soz_halloween_hunter_count',
            help: 'Number of Hunter in halloween game',
        }),
        [VampireGameRole.Mortal]: new Gauge({
            name: 'soz_halloween_mortal_count',
            help: 'Number of Mortal in halloween game',
        }),
        [VampireGameRole.Squire]: new Gauge({
            name: 'soz_halloween_squire_count',
            help: 'Number of Squire in halloween game',
        }),
        [VampireGameRole.Alchemist]: new Gauge({
            name: 'soz_halloween_alchemist_count',
            help: 'Number of Alchemist in halloween game',
        }),
    };

    public objectiveGauges = {
        part1: new Gauge({
            name: 'soz_halloween_objective_part1_count',
            help: 'Number of Remaining Mortal Objective Part 1',
            labelNames: ['objective', 'total'],
        }),
        part2: new Gauge({
            name: 'soz_halloween_objective_part2_count',
            help: 'Number of active player on Mortal Objective Part 2',
            labelNames: ['objective', 'total'],
        }),
    };

    public isGameStarted() {
        return this.started;
    }
}
