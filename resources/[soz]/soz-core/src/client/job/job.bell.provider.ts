import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { uuidv4 } from '../../core/utils';
import { JobType } from '../../shared/job';
import { Zone } from '../../shared/polyzone/box.zone';
import { AnimationService } from '../animation/animation.service';
import { TargetFactory } from '../target/target.factory';

type BellProps = {
    job: JobType;
    number: string;
    location?: string;
};

const BELL_ZONES: Zone<BellProps>[] = [
    {
        center: [633.66, 7.62, 82.63],
        length: 0.2,
        width: 0.4,
        heading: 326,
        minZ: 82.5,
        maxZ: 83.0,
        data: {
            job: JobType.LSPD,
            number: '555-LSPD',
        },
    },
    {
        center: [1853.08, 3687.48, 34.27],
        length: 0.4,
        width: 0.2,
        heading: 292,
        minZ: 34.0,
        maxZ: 34.5,
        data: {
            job: JobType.BCSO,
            number: '555-BCSO',
        },
    },
    {
        center: [-616.73, -1621.55, 33.01],
        length: 0.25,
        width: 0.35,
        heading: 355,
        minZ: 33.0,
        maxZ: 33.1,
        data: {
            job: JobType.Garbage,
            number: '555-BLUEBIRD',
        },
    },
    {
        center: [-586.9, -933.61, 23.82],
        length: 0.25,
        width: 0.35,
        heading: 33,
        minZ: 24.0,
        maxZ: 24.1,
        data: {
            job: JobType.News,
            number: '555-NEWS',
        },
    },
    {
        center: [-1082.59, -246.58, 37.76],
        length: 1.6,
        width: 5.2,
        heading: 27.89,
        minZ: 36.76,
        maxZ: 38.76,
        data: {
            job: JobType.YouNews,
            number: '555-YOUN',
        },
    },
    {
        center: [-1884.4, 2063.0, 159.0],
        length: 0.5,
        width: 0.5,
        heading: 159.0,
        minZ: 141.0,
        maxZ: 141.25,
        data: {
            job: JobType.Food,
            number: '555-MARIUS',
        },
    },
    {
        center: [-241.39, 6088.71, 31.39],
        length: 0.35,
        width: 0.25,
        heading: 315.0,
        minZ: 30.39,
        maxZ: 33.39,
        data: {
            job: JobType.Oil,
            number: '555-MTP',
        },
    },
    {
        center: [363.8, -1416.03, 32.46],
        length: 0.3,
        width: 0.4,
        heading: 51.56,
        minZ: 32.46,
        maxZ: 32.56,
        data: {
            job: JobType.LSMC,
            number: '555-LSMC',
        },
    },
    {
        center: [7.18, -692.9, 46.22],
        length: 0.4,
        width: 0.4,
        heading: 0,
        minZ: 46.12,
        maxZ: 46.32,
        data: {
            job: JobType.CashTransfer,
            number: '555-STONK',
        },
    },
    {
        center: [619.76, 2728.02, 41.86],
        length: 0.2,
        width: 0.3,
        heading: 4,
        minZ: 41.71,
        maxZ: 41.91,
        data: {
            job: JobType.Upw,
            number: '555-UPW',
        },
    },
    {
        center: [-540.28, 5299.97, 76.37],
        length: 0.2,
        width: 0.3,
        heading: 326,
        minZ: 76.07,
        maxZ: 76.27,
        data: {
            job: JobType.Pawl,
            number: '555-PAWL',
        },
    },
    {
        center: [-1393.51, -600.42, 30.32],
        length: 0.35,
        width: 0.25,
        heading: 120,
        minZ: 30.32,
        maxZ: 30.47,
        data: {
            job: JobType.Baun,
            number: '555-BAUN',
            location: "Bahama",
        },
    },
    {
        center: [130.04, -1287.28, 29.28],
        length: 0.25,
        width: 0.35,
        heading: 325,
        minZ: 29.28,
        maxZ: 29.43,
        data: {
            job: JobType.Baun,
            number: '555-BAUN',
            location: "Unicorn",
        },
    },
    {
        center: [719.65, -963.63, 30.38],
        length: 0.3,
        width: 0.2,
        heading: 63,
        minZ: 30.4,
        maxZ: 30.5,
        data: {
            job: JobType.Ffs,
            number: '555-FFS',
        },
    },
    {
        center: [-555.79, -186.76, 38.26],
        length: 0.25,
        width: 0.35,
        heading: 33,
        minZ: 38.11,
        maxZ: 38.42,
        data: {
            job: JobType.MDR,
            number: '555-MDR',
        },
    },
    {
        center: [903.72, -158.02, 74.17],
        length: 0.2,
        width: 0.4,
        heading: 37,
        minZ: 73.97,
        maxZ: 74.37,
        data: {
            job: JobType.Taxi,
            number: '555-CARLJR',
        },
    },
    {
        center: [-555.61, -602.12, 34.68],
        length: 0.4,
        width: 0.4,
        heading: 80,
        minZ: 34.38,
        maxZ: 34.68,
        data: {
            job: JobType.Gouv,
            number: '555-GOUV',
        },
    },
    {
        center: [2449.5, 4968.37, 46.57],
        length: 0.3,
        width: 0.4,
        heading: 251.91,
        minZ: 46.37,
        maxZ: 46.57,
        data: {
            job: JobType.FDF,
            number: '555-FDF',
        },
    },
    {
        center: [1078.02, -1980.91, 31.37],
        length: 0.55,
        width: 0.5,
        heading: 338,
        minZ: 31.72,
        maxZ: 31.87,
        data: {
            job: JobType.DMC,
            number: '555-DMC',
        },
    },
];

@Provider()
export class JobBellProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(AnimationService)
    private animationService: AnimationService;

    private lastCall = GetGameTimer();

    @Once(OnceStep.PlayerLoaded)
    public loadJobBell() {
        for (const index in BELL_ZONES) {
            const zone = BELL_ZONES[index];

            this.targetFactory.createForBoxZone(`bell:${zone.data.job}:${index}`, zone, [
                {
                    label: 'Biper',
                    icon: 'c:jobs/biper.png',
                    blackoutGlobal: true,
                    canInteract: () => {
                        return GetGameTimer() - this.lastCall > 15000;
                    },
                    action: () => {
                        this.callSociety(zone.data.number, zone.data?.location);
                    },
                },
            ]);
        }
    }

    private callSociety(number: string, location: string = undefined) {
        this.lastCall = GetGameTimer();
        this.animationService.playAnimation({
            base: {
                dictionary: 'mp_doorbell',
                name: 'ring_bell_a',
                duration: 3000,
                options: {
                    onlyUpperBody: true,
                    enablePlayerControl: true,
                },
            },
        });

        let message = "Une personne vous demande à l'accueil"
        if (!location) {
            message += ` - ${location}`
        }

        TriggerServerEvent('phone:sendSocietyMessage', 'phone:sendSocietyMessage:' + uuidv4(), {
            anonymous: false,
            number,
            message: message,
            position: true,
        });
    }
}
