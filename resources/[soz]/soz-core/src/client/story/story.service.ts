import { Inject, Injectable } from '../../core/decorators/injectable';
import { wait } from '../../core/utils';
import { Dialog } from '../../shared/story/story';
import { AudioService } from '../nui/audio.service';

@Injectable()
export class StoryService {
    @Inject(AudioService)
    private audioService: AudioService;

    public async launchDialog(dialog: Dialog) {
        await this.audioService.playAudio(dialog.audio);
        await this.drawTextDialog(dialog.text);
    }

    private async drawTextDialog(text: string[]) {
        for (const line of text) {
            const textDuration = line.length * 3;

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
}
