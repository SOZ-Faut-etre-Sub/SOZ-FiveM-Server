import { Once } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { JobType } from '@public/shared/job';
import { BoxZone } from '@public/shared/polyzone/box.zone';
import { Vector4 } from '@public/shared/polyzone/vector';

import { Provider } from '../../core/decorators/provider';
import { PlayerPositionProvider } from '../player/player.position.provider';
import { PlayerService } from '../player/player.service';
import { TargetFactory, TargetOptions } from '../target/target.factory';

enum ElevatorDirection {
    UP = 'upTo',
    DOWN = 'downTo',
}

const ElevatorDirectionDisplay: Record<ElevatorDirection, { label: string; icon: string }> = {
    [ElevatorDirection.UP]: { label: 'Monter ', icon: 'c:elevators/monter.png' },
    [ElevatorDirection.DOWN]: { label: 'Descendre ', icon: 'c:elevators/descendre.png' },
};

type ElevatorFloor = {
    label: string;
    button: BoxZone;
    upTo: ElevatorFloorName[];
    downTo: ElevatorFloorName[];
    spawnPoint: Vector4;
    job?: Partial<Record<JobType, number>>;
};

enum ElevatorFloorName {
    stonk0 = 1,
    stonk1L,
    stonk1R,
    stonk2L,
    stonk2R,
    lsmc0,
    lsmc1,
    lsmc2,
    lspd0,
    lspd1,
    bennys0,
    bennys1,
    fib0,
    fib1,
    admin0,
    adminminus1,
    mtp0,
    mtp1,
    mtp2,
    younews0,
    younews1,
    younews2,
}

const Elevators: Record<ElevatorFloorName, ElevatorFloor> = {
    //Stonk
    [ElevatorFloorName.stonk0]: {
        label: 'Sous-sol',
        button: new BoxZone([11.99, -668.57, 33.48], 0.1, 0.35, { minZ: 33.48, maxZ: 34.05, heading: 6.3 }),
        upTo: [ElevatorFloorName.stonk1L, ElevatorFloorName.stonk2L],
        downTo: [],
        spawnPoint: [10.53, -671.79, 32.45, 359.77],
    },
    [ElevatorFloorName.stonk1L]: {
        // Level 1, Left-side (facing elevators from outside)
        label: 'Coffre',
        button: new BoxZone([15.79, -689.22, 40.6], 0.1, 0.35, { minZ: 40.6, maxZ: 41.1, heading: 24.38 }),
        upTo: [ElevatorFloorName.stonk2L],
        downTo: [ElevatorFloorName.stonk0],
        spawnPoint: [17.27, -690.0, 39.73, 23.0],
    },
    [ElevatorFloorName.stonk1R]: {
        // Level 1, Right-side (facing elevators from outside)
        label: 'Coffre',
        button: new BoxZone([13.05, -690.47, 40.6], 0.1, 0.35, { minZ: 40.6, maxZ: 41.1, heading: 24.38 }),
        upTo: [ElevatorFloorName.stonk2R],
        downTo: [ElevatorFloorName.stonk0],
        spawnPoint: [14.59, -691.35, 39.73, 23.0],
    },
    [ElevatorFloorName.stonk2L]: {
        // Level 2, Left-side (facing elevators from outside)
        label: 'Niveau principal',
        button: new BoxZone([15.75, -689.18, 45.9], 0.1, 0.35, { minZ: 45.9, maxZ: 46.4, heading: 24.38 }),
        upTo: [],
        downTo: [ElevatorFloorName.stonk1L, ElevatorFloorName.stonk0],
        spawnPoint: [17.3, -689.98, 45.01, 23.0],
    },
    [ElevatorFloorName.stonk2R]: {
        // Level 2, Right-side (facing elevators from outside)
        label: 'Niveau principal',
        button: new BoxZone([13.09, -690.53, 45.9], 0.1, 0.35, { minZ: 45.9, maxZ: 46.4, heading: 24.38 }),
        upTo: [],
        downTo: [ElevatorFloorName.stonk1R, ElevatorFloorName.stonk0],
        spawnPoint: [14.58, -691.15, 45.01, 26.12],
    },
    //LSMC
    [ElevatorFloorName.lsmc0]: {
        label: 'Rez-de-chaussée',
        button: new BoxZone([362.97, -1427.64, 32.91], 0.4, 0.2, { minZ: 32.91, maxZ: 33.31, heading: 227.56 }),
        upTo: [ElevatorFloorName.lsmc1, ElevatorFloorName.lsmc2],
        downTo: [],
        spawnPoint: [364.94, -1426.28, 32.51, 228.85],
    },
    [ElevatorFloorName.lsmc1]: {
        label: '1er Etage',
        button: new BoxZone([362.62, -1427.32, 38.44], 0.2, 0.8, { minZ: 38.44, maxZ: 38.79, heading: 318.33 }),
        upTo: [ElevatorFloorName.lsmc2],
        downTo: [ElevatorFloorName.lsmc0],
        spawnPoint: [365.18, -1426.5, 37.98, 228.85],
    },
    [ElevatorFloorName.lsmc2]: {
        label: 'Toit',
        button: new BoxZone([337.45, -1432.94, 46.85], 0.2, 0.8, { minZ: 46.85, maxZ: 47.25, heading: 320 }),
        upTo: [],
        downTo: [ElevatorFloorName.lsmc0, ElevatorFloorName.lsmc1],
        spawnPoint: [336.3, -1431.05, 46.52, 140.67],
    },
    //LSPD
    [ElevatorFloorName.lspd0]: {
        label: 'Rez-de-chaussée',
        button: new BoxZone([609.72, -0.13, 69.63], 0.9, 0.1, { minZ: 69.63, maxZ: 72.08, heading: 350 }),
        upTo: [ElevatorFloorName.lspd1],
        downTo: [],
        spawnPoint: [611.07, -1.55, 70.63, 86.33],
    },
    [ElevatorFloorName.lspd1]: {
        label: 'Toit',
        button: new BoxZone([565.19, 4.88, 102.23], 1.45, 0.4, { minZ: 102.23, maxZ: 104.63, heading: 0 }),
        upTo: [],
        downTo: [ElevatorFloorName.lspd0],
        spawnPoint: [565.96, 4.89, 103.23, 271.47],
    },
    //BENNY'S
    [ElevatorFloorName.bennys0]: {
        label: 'Rez-de-chaussée',
        button: new BoxZone([-173.83, -1272.33, 32.6], 0.2, 0.1, { minZ: 32.6, maxZ: 33.0, heading: 0 }),
        upTo: [ElevatorFloorName.bennys1],
        downTo: [],
        spawnPoint: [-172.57, -1273.25, 32.6, 86.66],
    },
    [ElevatorFloorName.bennys1]: {
        label: 'Toit',
        button: new BoxZone([-171.17, -1274.1, 48.0], 0.2, 0.1, { minZ: 48.0, maxZ: 48.2, heading: 0 }),
        upTo: [],
        downTo: [ElevatorFloorName.bennys0],
        spawnPoint: [-172.49, -1273.3, 47.9, 270.31],
    },
    //FIB
    [ElevatorFloorName.fib0]: {
        label: 'Rez-de-chaussée',
        button: new BoxZone([138.08, -763.93, 45.45], 0.05, 3.35, { minZ: 45.45, maxZ: 46.35, heading: 340 }),
        upTo: [ElevatorFloorName.fib1],
        downTo: [],
        spawnPoint: [136.14, -761.89, 45.75, 162.03],
    },
    [ElevatorFloorName.fib1]: {
        label: 'Étage',
        button: new BoxZone([136.64, -763.4, 241.9], 0.05, 0.35, { minZ: 241.9, maxZ: 242.75, heading: 340 }),
        upTo: [],
        downTo: [ElevatorFloorName.fib0],
        spawnPoint: [135.99, -761.77, 242.15, 161.57],
    },
    //Admin
    [ElevatorFloorName.admin0]: {
        label: 'Surface',
        button: new BoxZone([1982.81, 3026.07, 46.91], 1.4, 0.1, { minZ: 46.91, maxZ: 49.31, heading: 59 }),
        upTo: [],
        downTo: [ElevatorFloorName.adminminus1],
        spawnPoint: [1983.47, 3027.05, 47.34, 330.03],
    },
    [ElevatorFloorName.adminminus1]: {
        label: 'Sous-Sol',
        button: new BoxZone([2154.9, 2919.62, -81.28], 0.2, 0.05, { minZ: -81.28, maxZ: -80.78, heading: 91 }),
        upTo: [ElevatorFloorName.admin0],
        downTo: [],
        spawnPoint: [2154.62, 2920.95, -81.08, 272.4],
        job: { [JobType.FBI]: 0, [JobType.LSPD]: 0, [JobType.BCSO]: 0, [JobType.SASP]: 0, [JobType.Gouv]: 0 },
    },
    //MTP
    [ElevatorFloorName.mtp0]: {
        label: 'Rez-de-chaussée',
        button: new BoxZone([-247.31, 6082.99, 30.39], 0.2, 0.4, { minZ: 30.39, maxZ: 33.39, heading: 315 }),
        upTo: [ElevatorFloorName.mtp1, ElevatorFloorName.mtp2],
        downTo: [],
        spawnPoint: [-247.59, 6081.25, 30.39, 313.56],
    },
    [ElevatorFloorName.mtp1]: {
        label: 'Étage',
        button: new BoxZone([-247.31, 6082.99, 39.57], 0.1, 0.4, { minZ: 39.57, maxZ: 42.57, heading: 315 }),
        upTo: [ElevatorFloorName.mtp2],
        downTo: [ElevatorFloorName.mtp0],
        spawnPoint: [-247.32, 6081.62, 39.57, 328.02],
    },
    [ElevatorFloorName.mtp2]: {
        label: 'Toit',
        button: new BoxZone([-244.09, 6076.16, 50.22], 0.1, 0.4, { minZ: 50.22, maxZ: 53.22, heading: 315 }),
        upTo: [],
        downTo: [ElevatorFloorName.mtp1, ElevatorFloorName.mtp0],
        spawnPoint: [-244.1, 6074.65, 50.22, 310.85],
    },
    //You News
    [ElevatorFloorName.younews0]: {
        label: 'Rez-de-chaussée',
        button: new BoxZone([-1074.48, -253.17, 37.86], 0.4, 0.2, { minZ: 37.86, maxZ: 38.06, heading: 315 }),
        upTo: [ElevatorFloorName.younews1, ElevatorFloorName.younews2],
        downTo: [],
        spawnPoint: [-1075.63, -252.99, 36.96, 30.87],
    },
    [ElevatorFloorName.younews1]: {
        label: 'Bureau',
        button: new BoxZone([-1074.57, -253.02, 44.12], 0.2, 0.2, { minZ: 44.12, maxZ: 44.37, heading: 27.18 }),
        upTo: [ElevatorFloorName.younews2],
        downTo: [ElevatorFloorName.younews0],
        spawnPoint: [-1075.45, -252.97, 43.22, 31.92],
    },
    [ElevatorFloorName.younews2]: {
        label: 'Toit',
        button: new BoxZone([-1073.21, -246.92, 53.01], 1.0, 1.2, { minZ: 53.01, maxZ: 55.01, heading: 315 }),
        upTo: [],
        downTo: [ElevatorFloorName.younews1, ElevatorFloorName.younews0],
        spawnPoint: [-1072.38, -246.64, 53.21, 302.0],
    },
};

@Provider()
export class ElevatorProvider {
    @Inject(PlayerService)
    public playerService: PlayerService;

    @Inject(TargetFactory)
    public targetFactory: TargetFactory;

    @Inject(PlayerPositionProvider)
    private playerPositionProvider: PlayerPositionProvider;

    @Once()
    public onStart() {
        for (const [id, value] of Object.entries(Elevators)) {
            this.targetFactory.createForBoxZone('Elevator:' + id, value.button, this.createTargetOptions(value), 1.5);
        }
    }

    private createTargetOptions(elevator: ElevatorFloor) {
        const options: TargetOptions[] = [];
        for (const direction of Object.values(ElevatorDirection)) {
            const destinations = elevator[direction];

            for (const destination of destinations) {
                if (destination) {
                    const display = ElevatorDirectionDisplay[direction];
                    const destinationFloor = Elevators[destination];
                    options.push({
                        icon: display.icon,
                        label: display.label + destinationFloor.label,
                        action: () => {
                            this.playerPositionProvider.teleportAdminToPosition(destinationFloor.spawnPoint);
                        },
                        job: destinationFloor.job,
                    });
                }
            }
        }

        return options;
    }
}
