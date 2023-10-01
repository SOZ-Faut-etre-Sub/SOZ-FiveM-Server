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
import { PlayerService } from '../../player/player.service';
import { TargetFactory } from '../../target/target.factory';

@Provider()
export class NewsTwitchProvider {
    @Inject(TargetFactory)
    private targetFactory: TargetFactory;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(BlipFactory)
    private blipFactory: BlipFactory;

    @Inject(Notifier)
    private notifier: Notifier;

    private currentZone: Vector4 = null;

    @Once(OnceStep.PlayerLoaded)
    public async onTwitchNewsLoad() {
        this.blipFactory.create('jobs:news', {
            coords: { x: -589.86, y: -930.61, z: 23.82 },
            name: 'Twitch News',
            sprite: 590,
            scale: 1.0,
        });

        this.targetFactory.createForModel(
            ['prop_ld_greenscreen_01', 'prop_tv_cam_02', 'prop_kino_light_01', 'v_ilev_fos_mic'],
            [
                {
                    label: 'Récupérer',
                    color: 'news',
                    icon: 'c:jobs/recuperer.png',
                    event: 'job:client:RemoveObject', // @TODO in core
                    job: JobType.News,
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
    }

    @OnEvent(ClientEvent.NEWS_NEWSPAPER_SELL)
    public async onNewspaperSell() {
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
                    color: 'news',
                    icon: 'c:news/livrer.png',
                    action: () => {
                        TriggerServerEvent(ServerEvent.NEWS_NEWSPAPER_SOLD);
                    },
                    canInteract: () => {
                        return this.playerService.isOnDuty();
                    },
                    job: JobType.News,
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
