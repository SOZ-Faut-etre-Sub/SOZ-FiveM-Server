import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { wait } from '../../core/utils';
import { Dialog, ScenarioState, Story } from '../../shared/story/story';
import { AudioService } from '../nui/audio.service';
import { PlayerService } from '../player/player.service';
import { TargetOptions } from '../target/target.factory';

@Provider()
export class StoryProvider {
    @Inject(AudioService)
    private audioService: AudioService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    private camera: number | null = null;
    private inCinematic = false;

    public async launchDialog(dialog: Dialog, useCamera = false, x?: number, y?: number, z?: number, w?: number) {
        this.inCinematic = true;
        if (x && y && z && w) {
            TaskGoStraightToCoord(PlayerPedId(), x, y, z, 1.0, 1000, w, 0.0);
            await wait(2000);
            SetEntityHeading(PlayerPedId(), w);
        }
        FreezeEntityPosition(PlayerPedId(), true);

        if (useCamera) {
            await wait(1000);
            this.camera = CreateCam('DEFAULT_SCRIPTED_CAMERA', true);

            SetCamCoord(this.camera, x, y, z);
            SetCamActive(this.camera, true);

            const [cx, cy, cz] = GetOffsetFromEntityInWorldCoords(PlayerPedId(), -2.0, 0.5, 0.0);
            SetCamCoord(this.camera, cx, cy, cz);
            SetCamRot(this.camera, 0, 0, w - 90.0, 0);
            RenderScriptCams(true, true, 500, true, true);
        }

        await this.audioService.playAudio(dialog.audio);
        await this.drawTextDialog(dialog.text, dialog.timing);

        if (DoesCamExist(this.camera)) {
            RenderScriptCams(false, false, 0, true, false);
            DestroyCam(this.camera, false);
        }

        FreezeEntityPosition(PlayerPedId(), false);
        this.inCinematic = false;
    }

    public canInteractForPart(story: string, scenario: string, part: number): boolean {
        const currentScenario = this.playerService.getPlayer().metadata[story]?.[scenario];

        if (part === 0) {
            return currentScenario === undefined;
        }

        if (part === 0 || part === 1) {
            return currentScenario?.[`part${part}`] <= ScenarioState.Running || currentScenario === undefined;
        }

        return currentScenario?.[`part${part}`] === ScenarioState.Running;
    }

    public replayTarget(story: Story, scenario: string, part: number): TargetOptions {
        return {
            label: 'Ré-écouter',
            icon: 'fas fa-comment-dots',
            canInteract: () => this.canInteractForPart('halloween2022', scenario, part + 1),
            action: async () => {
                await this.launchDialog(story.dialog[`part${part}`]);
            },
        };
    }

    private async drawTextDialog(text: string[], timing?: number[]) {
        for (const line of text) {
            let textDuration = line.length * 5;

            if (timing) {
                textDuration = timing[text.indexOf(line)];
            }

            for (let i = 0; i < textDuration; i++) {
                SetTextScale(0.5, 0.5);
                SetTextFont(4);
                SetTextDropshadow(1.0, 0, 0, 0, 255);
                SetTextEdge(1, 0, 0, 0, 255);
                SetTextColour(255, 255, 255, 215);
                SetTextJustification(0);
                SetTextEntry('STRING');
                AddTextComponentString(line);
                DrawText(0.5, 0.95);

                DrawRect(0.25 + 0.5 / 2, 0.94 + 0.05 / 2, 0.5, 0.05, 11, 11, 11, 200);

                await wait(0);
            }
        }
    }

    @Tick(TickInterval.EVERY_FRAME)
    private async onTick() {
        if (this.inCinematic) {
            DisableAllControlActions(0);
        }
    }
}
