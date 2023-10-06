import { Once, OnceStep, OnEvent } from '../../../core/decorators/event';
import { Inject } from '../../../core/decorators/injectable';
import { Provider } from '../../../core/decorators/provider';
import { ClientEvent, ServerEvent } from '../../../shared/event';
import { JobType } from '../../../shared/job';
import { NewsDeliveryZones } from '../../../shared/job/news';
import { Vector4 } from '../../../shared/polyzone/vector';
import { getRandomItem } from '../../../shared/random';
import { BlipFactory } from '../../blip';
import { Notifier } from '../../notifier';
import { ObjectProvider } from '../../object/object.provider';
import { PlayerService } from '../../player/player.service';
import { TargetFactory } from '../../target/target.factory';

@Provider()
export class NewsProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ObjectProvider)
    private objectProvider: ObjectProvider;

    private currentZone: Vector4 = null;

    @Once(OnceStep.PlayerLoaded)
    public async onTwitchNewsLoad() {
        this.blipFactory.create('jobs:news', {
            coords: { x: -589.86, y: -930.61, z: 23.82 },
            name: 'Twitch News',
            sprite: 590,
            scale: 0.9,
        });

        this.blipFactory.create('jobs-you-news', {
            coords: { x: -1081.28, y: -261.62, z: 37.8 },
            name: 'You News',
            sprite: 733,
            scale: 0.9,
        });

        this.targetFactory.createForModel(
            ['prop_ld_greenscreen_01', 'prop_tv_cam_02', 'prop_kino_light_01', 'v_ilev_fos_mic'],
            [
                {
                    label: 'Récupérer',
                    color: 'news',
                    icon: 'c:jobs/recuperer.png',
                    job: JobType.News,
                    action: object => {
                        this.objectProvider.collectObject(object);
                    },
                },
            ]
        );

        this.targetFactory.createForModel(
            ['prop_ld_greenscreen_01', 'prop_tv_cam_02', 'prop_kino_light_01', 'v_ilev_fos_mic'],
            [
                {
                    label: 'Récupérer',
                    color: 'you-news',
                    icon: 'c:jobs/recuperer.png',
                    job: JobType.YouNews,
                    action: object => {
                        this.objectProvider.collectObject(object);
                    },
                },
            ]
        );

        this.targetFactory.createForBoxZone(
            'jobs:news:farm',
            {
                center: [-564.09, -917.33, 33.34],
                length: 1,
                width: 1,
                minZ: 32.34,
                maxZ: 33.5,
            },
            [
                {
                    label: 'Imprimer',
                    color: 'news',
                    icon: 'c:news/imprimer.png',
                    action: () => {
                        TriggerServerEvent(ServerEvent.NEWS_NEWSPAPER_FARM);
                    },
                    job: JobType.News,
                    canInteract: () => {
                        return this.playerService.isOnDuty();
                    },
                },
            ]
        );

        this.targetFactory.createForBoxZone(
            'jobs:you-news:farm',
            {
                center: [-1056.23, -244.2, 44.02],
                heading: 207.41,
                length: 6.6,
                width: 16.6,
                minZ: 43.02,
                maxZ: 45.02,
            },
            [
                {
                    label: 'Imprimer',
                    color: 'you-news',
                    icon: 'c:news/imprimer.png',
                    action: () => {
                        TriggerServerEvent(ServerEvent.NEWS_NEWSPAPER_FARM);
                    },
                    job: JobType.YouNews,
                    canInteract: () => {
                        return this.playerService.isOnDuty();
                    },
                },
            ]
        );
    }

    @OnEvent(ClientEvent.NEWS_NEWSPAPER_SELL)
    public async onNewspaperSell() {
        const player = this.playerService.getPlayer();

        if (!player) {
            return;
        }

        if (this.currentZone) {
            this.clearSell();
            this.notifier.notify('Vous avez annulé la livraison de journaux', 'info');

            return;
        }

        this.currentZone = getRandomItem(NewsDeliveryZones);
        this.targetFactory.createForBoxZone(
            'news:sell:zone',
            {
                center: [this.currentZone[0], this.currentZone[1], this.currentZone[2]],
                length: 1,
                width: 1,
                minZ: this.currentZone[2] - 1.5,
                maxZ: this.currentZone[2] + 1.5,
                heading: this.currentZone[3],
            },
            [
                {
                    label: 'Livrer',
                    color: player.job.id,
                    icon: 'c:news/livrer.png',
                    action: () => {
                        TriggerServerEvent(ServerEvent.NEWS_NEWSPAPER_SOLD);
                    },
                    job: player.job.id,
                    canInteract: () => {
                        return this.playerService.isOnDuty();
                    },
                },
            ]
        );
        this.blipFactory.create('news:sell:blip', {
            name: 'Livraison de journaux',
            coords: { x: this.currentZone[0], y: this.currentZone[1], z: this.currentZone[2] },
            route: true,
        });

        this.notifier.notify('Une station a besoin de journaux. Sa position est sur ton ~y~GPS', 'info');
    }

    @OnEvent(ClientEvent.NEWS_NEWSPAPER_SOLD)
    public async onNewspaperSold() {
        if (!this.currentZone) {
            return;
        }

        this.clearSell();
    }

    public clearSell() {
        this.currentZone = null;
        this.blipFactory.remove('news:sell:blip');
        this.targetFactory.removeBoxZone('news:sell:zone');
    }
}
