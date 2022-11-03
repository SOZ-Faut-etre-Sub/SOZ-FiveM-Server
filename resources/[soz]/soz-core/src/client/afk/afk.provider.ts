import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { wait } from '../../core/utils';
import { AFKWordList } from '../../shared/afk';
import { ServerEvent } from '../../shared/event';
import { Vector3 } from '../../shared/polyzone/vector';
import { Ok } from '../../shared/result';
import { Notifier } from '../notifier';
import { InputService } from '../nui/input.service';
import { PhoneService } from '../phone/phone.service';
import { PlayerService } from '../player/player.service';
import { ProgressService } from '../progress.service';
import { TalkService } from '../talk.service';

const AFK_SECONDS_UNTIL_KICK = 900;
const AFK_SECONDS_UNTIL_WARNING = 300;
const AFK_RETRY_ATTEMPTS = 3;
const MP_PAUSE_MENU_HASH = GetHashKey('FE_MENU_VERSION_MP_PAUSE');

@Provider()
export class AfkProvider {
    private previousPosition: Vector3 = [0, 0, 0];
    private afkTimer = AFK_SECONDS_UNTIL_KICK;
    private afkAttempts = 1;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(Notifier)
    private notifier: Notifier;

    @Inject(ProgressService)
    private progressService: ProgressService;

    @Inject(PhoneService)
    private phoneService: PhoneService;

    @Inject(TalkService)
    private talkService: TalkService;

    @Inject(InputService)
    private inputService: InputService;

    @Tick(TickInterval.EVERY_FRAME)
    async verificationLoop() {
        const player = this.playerService.getPlayer();

        if (!player || player.metadata.godmode || GlobalState.disableAFK) {
            return;
        }

        if (this.afkTimer > AFK_SECONDS_UNTIL_WARNING) {
            return;
        }

        if (this.afkAttempts > AFK_RETRY_ATTEMPTS) {
            return;
        }

        do {
            const afkWord = AFKWordList[Math.floor(Math.random() * AFKWordList.length)];

            if (this.phoneService.isPhoneVisible()) {
                this.phoneService.setPhoneFocus(false);
            }

            if (this.talkService.isRadioOpen()) {
                this.talkService.setRadioOpen(false);
            }

            if (GetPauseMenuState() != 0) {
                ActivateFrontendMenu(MP_PAUSE_MENU_HASH, false, -1);
            }

            const word = await this.inputService.askInput(
                {
                    title: `Anti-AFK - Taper le mot suivant: ${afkWord}`,
                    maxCharacters: 50,
                    defaultValue: '',
                },
                () => {
                    return Ok(true);
                }
            );

            if (word?.toLowerCase() === afkWord) {
                this.afkAttempts = 1;
                this.afkTimer = AFK_SECONDS_UNTIL_KICK;

                if (this.phoneService.isPhoneVisible()) {
                    this.phoneService.setPhoneFocus(true);
                }

                this.notifier.notify("Vous n'êtes plus AFK", 'info');
                break;
            }

            this.notifier.notify(
                `Mot invalide, vous avez ${AFK_RETRY_ATTEMPTS - this.afkAttempts} essais restants`,
                'error'
            );
            this.afkAttempts++;

            await wait(1000);
        } while (this.afkAttempts < AFK_RETRY_ATTEMPTS);

        await wait(500);
    }

    @Tick(TickInterval.EVERY_SECOND)
    conformityLoop(): void {
        const player = this.playerService.getPlayer();
        const currentPosition: Vector3 = [0, 0, 0];

        if (!player || player.metadata.godmode || GlobalState.disableAFK) {
            return;
        }

        GetEntityCoords(PlayerPedId(), true).forEach(
            (coord, index) => (currentPosition[index] = Number(coord.toFixed(2)))
        );

        if (currentPosition.join() == this.previousPosition.join()) {
            if (this.afkTimer >= 0) {
                if (!this.progressService.isDoingAction()) {
                    this.afkTimer--;
                }
            } else {
                emitNet(ServerEvent.AFK_KICK);
            }
        } else {
            this.afkAttempts = 1;
            this.afkTimer = AFK_SECONDS_UNTIL_KICK;
        }

        this.previousPosition = currentPosition;
    }
}
