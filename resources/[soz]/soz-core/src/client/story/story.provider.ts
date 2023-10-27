import { Vector4 } from '@public/shared/polyzone/vector';

import { Inject } from '../../core/decorators/injectable';
import { Provider } from '../../core/decorators/provider';
import { Tick, TickInterval } from '../../core/decorators/tick';
import { wait } from '../../core/utils';
import { Dialog, ScenarioOrder, ScenarioState, Story } from '../../shared/story/story';
import { AudioService } from '../nui/audio.service';
import { PlayerService } from '../player/player.service';
import { ResourceLoader } from '../repository/resource.loader';
import { TargetOptions } from '../target/target.factory';

@Provider()
export class StoryProvider {
    @Inject(AudioService)
    private audioService: AudioService;

    @Inject(PlayerService)
    private playerService: PlayerService;

    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    private camera: number | null = null;
    private inCinematic = false;
    private line: string;

    public async launchDialog(
        dialog: Dialog,
        useCamera = false,
        x?: number,
        y?: number,
        z?: number,
        w?: number,
        entity?: number
    ) {
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

        let interval = null;
        if (entity) {
            await this.resourceLoader.loadAnimationDictionary('mp_facial');
            interval = setInterval(() => PlayFacialAnim(entity, 'mic_chatter', 'mp_facial'), 2000);
        }
        this.audioService.playAudio(dialog.audio);
        await this.drawTextDialog(dialog.text, dialog.timing);
        if (entity) {
            clearInterval(interval);
            await this.resourceLoader.loadAnimationDictionary('facials@gen_male@variations@normal');
            PlayFacialAnim(entity, 'mood_normal_1', 'facials@gen_male@variations@normal');
        }

        if (DoesCamExist(this.camera)) {
            RenderScriptCams(false, false, 0, true, false);
            DestroyCam(this.camera, false);
        }

        FreezeEntityPosition(PlayerPedId(), false);
        this.inCinematic = false;
    }

    public canInteractForPart(story: 'halloween2022' | 'halloween2023', scenario: string, part: number): boolean {
        const player = this.playerService.getPlayer();

        const order = ScenarioOrder[story].findIndex(elem => elem === scenario);

        if (order > 0) {
            const prevScenario = player.metadata[story]?.[ScenarioOrder[story][order - 1]];
            if (!prevScenario) {
                return false;
            }
            const parts = Object.keys(prevScenario);
            if (parts.length == 0) {
                return false;
            }
            for (const part of parts) {
                if (prevScenario[part] != ScenarioState.Finished) {
                    return false;
                }
            }
        }

        const currentScenario = player.metadata[story]?.[scenario];

        if (part === 0) {
            return currentScenario === undefined;
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

    public replayYearTarget(
        story: Story,
        year: 'halloween2022' | 'halloween2023',
        scenario: string,
        part: number,
        dialog: string,
        coords: Vector4
    ): TargetOptions {
        return {
            label: 'Ré-écouter',
            icon: 'fas fa-comment-dots',
            canInteract: () => this.canInteractForPart(year, scenario, part + 1),
            action: async entity => {
                await this.launchDialog(story.dialog[dialog], true, coords[0], coords[1], coords[2], coords[3], entity);
            },
        };
    }

    private async drawTextDialog(text: string[], timing?: number[]) {
        this.line = ' ';
        this.drawLineDialogLoop();
        for (const line of text) {
            let textDuration = line.length * 50;

            if (timing && timing.length > 0) {
                textDuration = timing[text.indexOf(line)];
            }

            this.line = line;
            await wait(textDuration);
        }
        this.line = null;
    }

    private async drawLineDialogLoop() {
        while (this.line) {
            SetTextScale(0.5, 0.5);
            SetTextFont(4);
            SetTextDropshadow(1.0, 0, 0, 0, 255);
            SetTextEdge(1, 0, 0, 0, 255);
            SetTextColour(255, 255, 255, 215);
            SetTextJustification(0);
            SetTextEntry('STRING');
            AddTextComponentString(this.line);
            DrawText(0.5, 0.95);

            DrawRect(0.25 + 0.5 / 2, 0.94 + 0.05 / 2, 0.5, 0.05, 11, 11, 11, 200);

            await wait(0);
        }
    }

    @Tick(TickInterval.EVERY_FRAME)
    private async onTick() {
        if (this.inCinematic) {
            DisableAllControlActions(0);
        }
    }
}
