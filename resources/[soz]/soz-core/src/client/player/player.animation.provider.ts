import { Command } from '../../core/decorators/command';
import { OnEvent, OnNuiEvent } from '../../core/decorators/event';
import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { AnimationConfigItem, MoodConfigItem, WalkConfigItem } from '../../shared/animation';
import { ClientEvent, NuiEvent, ServerEvent } from '../../shared/event';
import { Shortcut } from '../../shared/nui/player';
import { Err, Ok } from '../../shared/result';
import { AnimationService } from '../animation/animation.service';
import { Notifier } from '../notifier';
import { InputService } from '../nui/input.service';
import { NuiDispatch } from '../nui/nui.dispatch';
import { ProgressService } from '../progress.service';
import { PlayerService } from './player.service';

@Provider()
export class PlayerAnimationProvider {
    @Inject(AnimationService)
    private animationService: AnimationService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(InputService)
    private inputService: InputService;

    @Inject(NuiDispatch)
    private nuiDispatch: NuiDispatch;

    @Inject(Notifier)
    private notifier: Notifier;

    @Command('animation_stop', {
        description: "Stop l'animation en cours",
        keys: [
            {
                mapper: 'keyboard',
                key: '',
            },
        ],
    })
    public animationStop() {
        this.animationService.stop();
    }

    @Command('animation_shortcut_01', {
        description: "Lancer l'animation personnalisée 01",
        keys: [
            {
                mapper: 'keyboard',
                key: '',
            },
        ],
    })
    public async animationShortcut01() {
        return this.doAnimationShortcut('animation_shortcut_01');
    }

    @Command('animation_shortcut_02', {
        description: "Lancer l'animation personnalisée 02",
        keys: [
            {
                mapper: 'keyboard',
                key: '',
            },
        ],
    })
    public async animationShortcut02() {
        return this.doAnimationShortcut('animation_shortcut_02');
    }

    @Command('animation_shortcut_03', {
        description: "Lancer l'animation personnalisée 03",
        keys: [
            {
                mapper: 'keyboard',
                key: '',
            },
        ],
    })
    public async animationShortcut03() {
        return this.doAnimationShortcut('animation_shortcut_03');
    }

    @Command('animation_shortcut_04', {
        description: "Lancer l'animation personnalisée 04",
        keys: [
            {
                mapper: 'keyboard',
                key: '',
            },
        ],
    })
    public async animationShortcut04() {
        return this.doAnimationShortcut('animation_shortcut_04');
    }

    @Command('animation_shortcut_05', {
        description: "Lancer l'animation personnalisée 05",
        keys: [
            {
                mapper: 'keyboard',
                key: '',
            },
        ],
    })
    public async animationShortcut05() {
        return this.doAnimationShortcut('animation_shortcut_05');
    }

    @Command('animation_shortcut_06', {
        description: "Lancer l'animation personnalisée 06",
        keys: [
            {
                mapper: 'keyboard',
                key: '',
            },
        ],
    })
    public async animationShortcut06() {
        return this.doAnimationShortcut('animation_shortcut_06');
    }

    @Command('animation_shortcut_07', {
        description: "Lancer l'animation personnalisée 07",
        keys: [
            {
                mapper: 'keyboard',
                key: '',
            },
        ],
    })
    public async animationShortcut07() {
        return this.doAnimationShortcut('animation_shortcut_07');
    }

    @Command('animation_shortcut_08', {
        description: "Lancer l'animation personnalisée 08",
        keys: [
            {
                mapper: 'keyboard',
                key: '',
            },
        ],
    })
    public async animationShortcut08() {
        return this.doAnimationShortcut('animation_shortcut_08');
    }

    @Command('animation_shortcut_09', {
        description: "Lancer l'animation personnalisée 09",
        keys: [
            {
                mapper: 'keyboard',
                key: '',
            },
        ],
    })
    public async animationShortcut09() {
        return this.doAnimationShortcut('animation_shortcut_09');
    }

    @Command('animation_shortcut_10', {
        description: "Lancer l'animation personnalisée 10",
        keys: [
            {
                mapper: 'keyboard',
                key: '',
            },
        ],
    })
    public async animationShortcut10() {
        return this.doAnimationShortcut('animation_shortcut_10');
    }

    public async doAnimationShortcut(key: string) {
        const animationJson = GetResourceKvpString(key);
        let animation = null;

        if (animationJson) {
            try {
                animation = JSON.parse(animationJson) as AnimationConfigItem;
            } catch (e) {
                console.error(e);
            }
        }

        if (!animation) {
            return;
        }

        await this.playAnimation({ animationItem: animation });
    }

    @OnNuiEvent(NuiEvent.PlayerMenuAnimationSetWalk)
    public async setWalkAnimation({ walkItem }: { walkItem: WalkConfigItem }) {
        if (walkItem.type === 'category') {
            return;
        }

        TriggerServerEvent(ServerEvent.PLAYER_SET_CURRENT_WALKSTYLE, walkItem.walk);
    }

    @OnNuiEvent(NuiEvent.PlayerMenuAnimationSetMood)
    public async setMoodAnimation({ moodItem }: { moodItem: MoodConfigItem }) {
        TriggerServerEvent('QBCore:Server:SetMetaData', 'mood', moodItem.mood);
    }

    @OnNuiEvent(NuiEvent.PlayerMenuAnimationFavorite)
    public async favoriteAnimation({ animationItem }: { animationItem: AnimationConfigItem }) {
        const input = await this.inputService.askInput(
            {
                title: 'Entrer le numéro du raccourci voulu (entre 1 et 10), laissez vide pour annuler',
                defaultValue: '',
                maxCharacters: 2,
            },
            value => {
                const number = parseInt(value, 10);

                if (number < 1 || number > 10) {
                    return Err('Le numéro doit être compris entre 1 et 10');
                }

                return Ok(number);
            }
        );

        if (!input) {
            return;
        }

        const number = parseInt(input, 10);
        const key = `animation_shortcut_${number.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false,
        })}`;

        const animationJson = JSON.stringify(animationItem);

        SetResourceKvp(key, animationJson);
        this.dispatchShortcuts();
    }

    @OnNuiEvent(NuiEvent.PlayerMenuAnimationFavoriteDelete)
    public async deleteFavoriteAnimation({ key }: { key: string }) {
        DeleteResourceKvp(key);
        this.dispatchShortcuts();
    }

    private dispatchShortcuts() {
        this.nuiDispatch.dispatch('player', 'UpdateAnimationShortcuts', this.getShortcuts());
    }

    public getShortcuts(): Record<string, Shortcut> {
        const shortcuts = {};

        for (let i = 1; i <= 10; i++) {
            const key = `animation_shortcut_${i.toLocaleString('en-US', {
                minimumIntegerDigits: 2,
                useGrouping: false,
            })}`;

            const animationJson = GetResourceKvpString(key);
            let animation = null;

            if (animationJson) {
                try {
                    animation = JSON.parse(animationJson) as AnimationConfigItem;
                } catch (e) {
                    console.error(e);
                }
            }

            shortcuts[key] = {
                name: `${i.toLocaleString('en-US', {
                    minimumIntegerDigits: 2,
                    useGrouping: false,
                })} - ${animation?.name || 'Aucune'}`,
                animation,
            };
        }

        return shortcuts;
    }

    @OnNuiEvent(NuiEvent.PlayerMenuAnimationPlay)
    public async playAnimation({ animationItem }: { animationItem: AnimationConfigItem }) {
        const player = this.playerService.getPlayer();

        if (!player) {
            return false;
        }

        const ped = PlayerPedId();
        const state = this.playerService.getState();

        if (
            IsPedSittingInAnyVehicle(ped) ||
            state.isEscorted ||
            state.isEscorting ||
            state.isInHospital ||
            player.metadata.isdead ||
            player.metadata.inlaststand ||
            IsPedRagdoll(ped)
        ) {
            return false;
        }

        if (this.progressService.isDoingAction()) {
            this.notifier.notify('Une action est déjà en cours.', 'error');

            return false;
        }

        if (animationItem.type === 'category') {
            return false;
        }

        if (animationItem.type === 'event') {
            TriggerEvent(animationItem.event);

            return true;
        }

        if (animationItem.type === 'animation') {
            this.animationService.toggleAnimation(animationItem.animation);

            return true;
        }

        if (animationItem.type === 'scenario') {
            this.animationService.toggleScenario(animationItem.scenario);

            return true;
        }

        return false;
    }

    @OnEvent(ClientEvent.ANIMATION_SURRENDER)
    public async playBustedAnimation() {
        const ped = PlayerPedId();

        if (IsEntityPlayingAnim(ped, 'random@arrests@busted', 'idle_a', 3)) {
            await this.animationService.playAnimation({
                base: {
                    dictionary: 'random@arrests@busted',
                    name: 'exit',
                    duration: 3000,
                    options: {
                        freezeLastFrame: true,
                    },
                },
            });

            await this.animationService.playAnimation({
                base: {
                    dictionary: 'random@arrests',
                    name: 'kneeling_arrest_get_up',
                },
            });
        } else {
            await this.animationService.playAnimation({
                base: {
                    dictionary: 'random@arrests',
                    name: 'idle_2_hands_up',
                    duration: 4000,
                    options: {
                        freezeLastFrame: true,
                    },
                },
            });
            await this.animationService.playAnimation({
                base: {
                    dictionary: 'random@arrests',
                    name: 'kneeling_arrest_idle',
                    duration: 500,
                    options: {
                        freezeLastFrame: true,
                    },
                },
            });
            await this.animationService.playAnimation({
                base: {
                    dictionary: 'random@arrests@busted',
                    name: 'enter',
                    duration: 1000,
                    options: {
                        freezeLastFrame: true,
                    },
                },
            });

            this.animationService.playAnimation({
                base: {
                    dictionary: 'random@arrests@busted',
                    name: 'idle_a',
                    options: {
                        repeat: true,
                    },
                },
            });
        }
    }
}
