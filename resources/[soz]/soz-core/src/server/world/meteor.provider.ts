import { Once, OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Rpc } from '@public/core/decorators/rpc';
import { ItemService } from '@public/server/item/item.service';
import { MeteorSubMenuState } from '@public/shared/admin/admin';
import { Music } from '@public/shared/audio';
import { ClientEvent, ServerEvent } from '@public/shared/event';
import { Feature } from '@public/shared/features';
import { RpcServerEvent } from '@public/shared/rpc';

import { FeatureProvider } from '../feature/feature.provider';
import { Notifier } from '../notifier';
import { PermissionService } from '../permission.service';
import { PlayerAppearanceService } from '../player/player.appearance.service';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../player/progress.service';
import { RebootProvider } from '../reboot/reboot.provider';
import { NpcProvider } from '../utils/npc.provider';
import { EarthquakeProvider } from './earthquake.provider';
import { FireProvider } from './fire.provider';
import { OceanProvider } from './ocean.provider';
import { TornadoProvider } from './tornado.provider';

@Provider()
export class MeteorProvider {
    @Inject(PermissionService)
    private permissionService: PermissionService;

    @Inject(RebootProvider)
    public rebootProvider: RebootProvider;

    @Inject(EarthquakeProvider)
    public earthquakeProvider: EarthquakeProvider;

    @Inject(OceanProvider)
    public oceanProvider: OceanProvider;

    @Inject(Notifier)
    public notifier: Notifier;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(ItemService)
    private itemService: ItemService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(PlayerAppearanceService)
    private playerAppearanceService: PlayerAppearanceService;

    @Inject(NpcProvider)
    private npcProvider: NpcProvider;

    @Inject(FeatureProvider)
    private featureProvider: FeatureProvider;

    @Inject(TornadoProvider)
    private tornadoProvider: TornadoProvider;

    @Inject(FireProvider)
    private fireProvider: FireProvider;

    private musics: Record<Music, number> = {
        [Music.Siren]: 0,
        [Music.Chronos]: 0,
        [Music.Ambiance]: 0,
        [Music.SandStorm]: 0,
        [Music.Impact]: 0,
        [Music.DiesIrae]: 0,
        [Music.Cinis]: 0,
        [Music.Obsession]: 0,
    };

    @Once()
    public onStart() {
        this.itemService.setItemUseCallback('full_scarf', this.useFullScarf.bind(this));
    }

    private async useFullScarf(source: number) {
        const progress = await this.progressService.progress(
            source,
            'switch_clothes',
            "Changement d'habits...",
            1000,
            {
                name: 'put_on_mask',
                dictionary: 'mp_masks@on_foot',
                options: {
                    cancellable: false,
                    enablePlayerControl: false,
                },
            },
            {
                disableCombat: true,
                disableMovement: true,
                canCancel: false,
            }
        );

        if (!progress.completed) {
            return;
        }

        const targetPlayer = this.playerService.getPlayer(source);
        targetPlayer.cloth_config.Config.HideMask = false;
        this.playerAppearanceService.setClothConfig(source, targetPlayer.cloth_config, true);

        TriggerClientEvent(ClientEvent.FULL_SCARF_TOGGLE, source);
    }

    @Rpc(RpcServerEvent.ADMIN_METEOR_STATE)
    public getMeteorSate(): MeteorSubMenuState {
        return {
            disableNpc: this.npcProvider.isDisabled(),
            musics: this.musics,
            earthQuake: this.earthquakeProvider.isEarthQuake(),
            highWave: this.oceanProvider.getHighWave(),
            tornado: this.tornadoProvider.isRunning(),
            firePropagation: this.fireProvider.propagationIsEnabled(),
        };
    }

    @OnEvent(ServerEvent.ADMIN_METEOR_ACTIVATE)
    public activate(source: number) {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        TriggerClientEvent(ClientEvent.METEOR_START, -1);
        this.notifier.notify(source, 'Lancement météorite...');
        this.musics[Music.Siren] = 0;
        this.musics[Music.Ambiance] = 0;
    }

    @OnEvent(ServerEvent.ADMIN_METEOR_MUSIC)
    public activateMusic(source: number, music: Music, value: number) {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        this.musics[music] = value;
        TriggerClientEvent(ClientEvent.METEOR_MUSIC, -1, this.musics);
    }

    @OnEvent(ServerEvent.ADMIN_METEOR_KICK_PLAYERS)
    public kickPlayers() {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        let message = "L'impact de la météorite vous a assommé, vous pourrez vous réveiller dans quelques minutes...";

        if (this.featureProvider.isFeatureEnabled(Feature.WhatIfFirstEpisode)) {
            message =
                "Suite à l'impact de la bombe nucléaire, San Andreas et ses habitants se sont évaporés, clôturant ainsi cette première édition du WHAT IF ! Merci à tous les joueurs pour leur participation. ❤️";
        }

        if (this.featureProvider.isFeatureEnabled(Feature.WhatIfSecondEpisode)) {
            message =
                '📜 Journal de Bord — Dernières Pages\n' +
                '\n' +
                '"Ils nous avaient promis le salut. Ils nous ont offert la mort."\n' +
                '\n' +
                'Les Lucioles nous ont trahis. Elles n’ont jamais eu l’intention de nous évacuer. Quand leur avant-garde a posé le pied sur San Andreas, nous pensions enfin voir la lumière au bout de l’enfer. Mais ce fut des balles, pas des promesses, qui ont jailli. Les mitrailleuses ont balayé les foules, fauchant survivants et clans confondus. Une scène d’horreur. Du sang sur le béton, des cris étouffés sous le fracas des armes. Quelques-uns ont fui, se cachant dans les décombres, mais la plupart… n’ont jamais eu cette chance.\n' +
                '\n' +
                'Et le répit n’a duré qu’un souffle. Peu après, le ciel s’est embrasé. Les avions ont bombardé l’île sans relâche, réduisant villes et forêts en cendres. Les camps n’existent plus. Les routes ne mènent plus nulle part. Partout, des cadavres — vivants ou morts, infectés ou non, tous mêlés dans le même charnier. San Andreas est devenue un cimetière à ciel ouvert, une plaie béante où même les corbeaux n’osent plus se poser.\n' +
                '\n' +
                'Cela fait des jours que le feu tombe du ciel. Mon bras est brisé, chaque mouvement m’arrache une douleur que je ne peux plus calmer. Je n’ai plus de médicaments, presque plus de nourriture. Tous les abris ont été rasés. Chaque nuit, je m’enfouis sous les ruines, priant que la prochaine vague de bombes m’oublie. Mais je sais qu’elle finira par me trouver.\n' +
                '\n' +
                'Je ne crois plus qu’il reste beaucoup de temps. Peut-être quelques heures, peut-être un jour de plus. Ce journal s’arrête ici, avec mes derniers mots, avant que le silence ne m’avale à mon tour.\n' +
                '\n' +
                'Adieu, San Andreas.\n' +
                'Je t’aurai aimé… même dans ta laideur, même dans ta cruauté.';
        }

        this.rebootProvider.kickAll(message);
    }

    @OnEvent(ServerEvent.ADMIN_METEOR_DISABLE_NPC)
    public disableNPC(source: number, value: boolean) {
        if (!this.permissionService.isStaff(source)) {
            return;
        }

        this.npcProvider.disableNPC(value);
    }
}
