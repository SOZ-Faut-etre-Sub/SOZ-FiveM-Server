import { Feature } from '@public/shared/features';

import { Once, OnceStep } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { JobType } from '../../shared/job';
import { Vector3 } from '../../shared/polyzone/vector';
import { AnimationService } from '../animation/animation.service';
import { FeatureProvider } from '../feature/feature.provider';
import { PhoneAppSocietyProvider } from '../phone/apps/phone.app.society.provider';
import { InteractionProvider } from '../quick-interaction/interaction.provider';

type BellProps = {
    coords: Vector3;
    job: JobType;
    number: string;
    location?: string;
};

const BELL_ZONES: BellProps[] = [
    // MISSION ROW
    {
        coords: [439.15, -980.38, 30.9],
        job: JobType.LSPD,
        number: '555-LSPD',
        location: 'Mission Row',
    },
    // VINEWOOD
    {
        coords: [633.66, 7.62, 82.85],
        job: JobType.LSPD,
        number: '555-LSPD',
        location: 'Vinewood',
    },
    // MIRROR PARK
    {
        coords: [1130.18, -489.1, 65.16],
        job: JobType.LSPD,
        number: '555-LSPD',
        location: 'Mirror Park',
    },

    {
        coords: [1853.08, 3687.48, 34.42],
        job: JobType.BCSO,
        number: '555-BCSO',
    },
    {
        coords: [-617.79, -1621.45, 33.05],
        job: JobType.Garbage,
        number: '555-BLUEBIRD',
    },
    {
        coords: [-586.9, -933.61, 24.1],
        job: JobType.News,
        number: '555-NEWS',
    },
    {
        coords: [-1084.25, -247.99, 37.9],
        job: JobType.YouNews,
        number: '555-YOUN',
    },
    {
        coords: [-1885.13, 2058.63, 140.87],
        job: JobType.Food,
        number: '555-MARIUS',
    },
    {
        coords: [-241.41, 6088.71, 31.45],
        job: JobType.Oil,
        number: '555-MTP',
    },
    {
        coords: [363.8, -1416.03, 32.56],
        job: JobType.LSMC,
        number: '555-LSMC',
        location: 'Hopital',
    },
    {
        coords: [1829.47, 3674.55, 34.62],
        job: JobType.LSMC,
        number: '555-LSMC',
        location: 'Clinique',
    },
    {
        coords: [7.18, -692.9, 46.27],
        job: JobType.CashTransfer,
        number: '555-STONK',
    },
    {
        coords: [619.76, 2728.02, 41.85],
        job: JobType.Upw,
        number: '555-UPW',
    },
    {
        coords: [-540.28, 5299.97, 76.25],
        job: JobType.Pawl,
        number: '555-PAWL',
    },
    {
        coords: [-1393.51, -600.42, 30.47],
        job: JobType.Baun,
        number: '555-BAUN',
        location: 'Bahama',
    },
    {
        coords: [130.04, -1287.28, 29.39],
        job: JobType.Baun,
        number: '555-BAUN',
        location: 'Unicorn',
    },
    {
        coords: [719.65, -963.63, 30.45],
        job: JobType.Ffs,
        number: '555-FFS',
    },
    {
        coords: [-555.79, -186.76, 38.35],
        job: JobType.MDR,
        number: '555-MDR',
    },
    {
        coords: [903.72, -158.02, 74.32],
        job: JobType.Taxi,
        number: '555-CARLJR',
    },
    {
        coords: [-549.67, -611.97, 34.98],
        job: JobType.Gouv,
        number: '555-GOUV',
    },
    {
        coords: [2449.5, 4968.37, 46.48],
        job: JobType.FDF,
        number: '555-FDF',
    },
    {
        coords: [1078.02, -1980.91, 31.52],
        job: JobType.DMC,
        number: '555-DMC',
    },
];

const BELL_ZONES_WHAT_IF: BellProps[] = [
    {
        coords: [633.66, 7.62, 82.85],
        job: JobType.LSPD,
        number: '555-SASP',
    },
];

@Provider()
export class JobBellProvider {
    @Inject(InteractionProvider)
    private readonly interactionProvider: InteractionProvider;

    @Inject(AnimationService)
    private readonly animationService: AnimationService;

    @Inject(PhoneAppSocietyProvider)
    private readonly phoneSocietyProvider: PhoneAppSocietyProvider;

    @Inject(FeatureProvider)
    private readonly featureProvider: FeatureProvider;

    private lastCall = GetGameTimer();

    @Once(OnceStep.PlayerLoaded)
    public loadJobBell() {
        for (let bell of BELL_ZONES) {
            if (this.featureProvider.isFeatureEnabled(Feature.WhatIfFirstEpisode)) {
                const overide = BELL_ZONES_WHAT_IF.find(elem => elem.job === bell.job);
                if (overide) {
                    bell = overide;
                }
            }

            this.interactionProvider.createInteractionForCoords(
                bell.coords,
                {
                    label: 'Biper',
                    blackoutGlobal: true,
                    canInteract: () => {
                        return GetGameTimer() - this.lastCall > 15000;
                    },
                    action: () => {
                        this.callSociety(bell.number, bell?.location);
                    },
                },
                1,
                5.0
            );
        }
    }

    private async callSociety(number: string, location: string = undefined) {
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

        let message = "Une personne vous demande à l'accueil";
        if (location) {
            message += ` - ${location}`;
        }

        await this.phoneSocietyProvider.sendMessage({
            anonymous: false,
            number,
            message: message,
            position: true,
        });
    }
}
