import { OnEvent } from '@public/core/decorators/event';
import { Exportable } from '@public/core/decorators/exports';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Tick } from '@public/core/decorators/tick';
import { wait } from '@public/core/utils';
import { ClientEvent } from '@public/shared/event';
import { Control } from '@public/shared/input';

import { ResourceLoader } from '../repository/resource.loader';
import { PlayerService } from './player.service';

@Provider()
export class PlayerProneProvider {
    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ResourceLoader)
    private readonly resourceLoader: ResourceLoader;

    private isProne = false;
    private isCrawling = false;
    private isSwitching = false;

    private async playAnimOnce(
        ped,
        animDict,
        animName,
        blendInSpeed?: number,
        blendOutSpeed?: number,
        duration?: number,
        startTime?: number
    ) {
        await this.resourceLoader.loadAnimationDictionary(animDict);
        TaskPlayAnim(
            ped,
            animDict,
            animName,
            blendInSpeed || 2.0,
            blendOutSpeed || 2.0,
            duration || -1,
            0,
            startTime || 0.0,
            false,
            false,
            false
        );
        RemoveAnimDict(animDict);
    }

    private async changeHeadingSmooth(playerPed, amount, time) {
        const times = Math.abs(amount);
        const test = amount / times;
        const timeToWait = time / times;

        for (let i = 1; i < times; i++) {
            await wait(timeToWait);

            SetEntityHeading(playerPed, GetEntityHeading(playerPed) + test);
        }
    }

    private shouldPlayerDiveToCrawl(playerPed) {
        return IsPedRunning(playerPed) || IsPedSprinting(playerPed);
    }

    private async playExitCrawlAnim(forceEnd) {
        if (!forceEnd) {
            const playerPed = PlayerPedId();

            this.playAnimOnce(
                playerPed,
                'get_up@directional@transition@prone_to_knees@crawl',
                'front',
                null,
                null,
                780
            );
            await wait(780);
            this.playAnimOnce(
                playerPed,
                'get_up@directional@movement@from_knees@standard',
                'getup_l_0',
                null,
                null,
                1300
            );
            await wait(1300);
        }
    }

    private canPlayerCrawl(playerPed) {
        if (
            !IsPedOnFoot(playerPed) ||
            IsPedJumping(playerPed) ||
            IsPedFalling(playerPed) ||
            IsPedInjured(playerPed) ||
            IsPedInMeleeCombat(playerPed) ||
            IsPedRagdoll(playerPed) ||
            IsPedHurt(playerPed) ||
            !this.playerService.canDoAction()
        ) {
            return false;
        }

        return true;
    }

    private Crawl(playerPed, direction) {
        this.isCrawling = true;

        TaskPlayAnim(
            playerPed,
            'move_crawl',
            'onfront_' + direction,
            8.0,
            -8.0,
            -1,
            2 + 1073741824,
            0.0,
            false,
            false,
            false
        );

        const time = {
            ['fwd']: 820,
            ['bwd']: 990,
        };

        setTimeout(() => {
            this.isCrawling = false;
        }, time[direction]);
    }

    @Tick()
    private async crawlLoop() {
        const playerPed = PlayerPedId();
        let forceEnd = false;

        if (this.isProne) {
            if (!this.canPlayerCrawl(playerPed) || IsEntityInWater(playerPed)) {
                ClearPedTasks(playerPed);
                forceEnd = true;
                this.isSwitching = true;
            }
        }

        if (!this.isProne && this.isSwitching) {
            if (GetPedStealthMovement(playerPed)) {
                SetPedStealthMovement(playerPed, false, 'DEFAULT_ACTION');
                await wait(100);
            }

            await this.resourceLoader.loadAnimationDictionary('move_crawl');
            await this.resourceLoader.loadAnimationDictionary('move_crawlprone2crawlfront');

            if (this.shouldPlayerDiveToCrawl(playerPed)) {
                this.playAnimOnce(playerPed, 'explosions', 'react_blown_forwards', null, 3.0);
                await wait(1200);
            } else {
                this.playAnimOnce(playerPed, 'amb@world_human_sunbathe@male@front@enter', 'enter');
                await wait(3000);
            }

            this.isProne = true;
            this.isSwitching = false;
        } else if (this.isProne && this.isSwitching) {
            await this.playExitCrawlAnim(forceEnd);
            this.isSwitching = false;
            this.isProne = false;
            this.resourceLoader.unloadAnimationDictionary('move_crawl');
            this.resourceLoader.unloadAnimationDictionary('move_crawlprone2crawlfront');
        } else if (this.isProne) {
            const forward = IsControlPressed(0, Control.MoveUpOnly);
            const backward = IsControlPressed(0, Control.MoveDownOnly);

            if (!this.isCrawling) {
                if (forward) {
                    this.Crawl(playerPed, 'fwd');
                } else if (backward) {
                    this.Crawl(playerPed, 'bwd');
                } else {
                    if (!IsEntityPlayingAnim(playerPed, 'move_crawl', 'onfront_fwd', 3)) {
                        this.playIdleCrawlAnimation(playerPed, null, 3.0);
                    }
                }
            }

            if (IsControlPressed(0, Control.MoveLeftOnly)) {
                if (this.isCrawling) {
                    const headingDiff = forward ? 1.0 : -1.0;

                    SetEntityHeading(playerPed, GetEntityHeading(playerPed) + headingDiff);
                } else {
                    TaskPlayAnim(
                        playerPed,
                        'move_crawlprone2crawlfront',
                        'front_armsdown',
                        8.0,
                        8.0,
                        -1,
                        2 + 1073741824,
                        0.5,
                        false,
                        false,
                        false
                    );
                    await this.changeHeadingSmooth(playerPed, 45.0, 300);
                    await wait(250);
                }
            } else if (IsControlPressed(0, Control.MoveRightOnly)) {
                if (this.isCrawling) {
                    const headingDiff = backward ? 1.0 : -1.0;
                    SetEntityHeading(playerPed, GetEntityHeading(playerPed) + headingDiff);
                } else {
                    TaskPlayAnim(
                        playerPed,
                        'move_crawlprone2crawlfront',
                        'front_armsdown',
                        8.0,
                        8.0,
                        -1,
                        2 + 1073741824,
                        0.5,
                        false,
                        false,
                        false
                    );
                    await this.changeHeadingSmooth(playerPed, -45.0, 300);
                    await wait(250);
                }
            }
        }
    }

    private playIdleCrawlAnimation = (playerPed, heading?: number, blendInSpeed?: number) => {
        TaskPlayAnim(playerPed, 'move_crawl', 'onfront_fwd', blendInSpeed, 2.0, -1, 2, 1.0, false, false, false);
    };

    @OnEvent(ClientEvent.TOGGLE_CRAWLING)
    public async startCrawling() {
        if (this.isSwitching) {
            return;
        }

        const playerPed = PlayerPedId();
        if (!this.canPlayerCrawl(playerPed) || IsEntityInWater(playerPed) || !IsPedHuman(playerPed)) {
            return;
        }
        this.isSwitching = true;
    }

    @Exportable('IsPlayerProne')
    public isPlayerProne(): boolean {
        return this.isProne;
    }
}
