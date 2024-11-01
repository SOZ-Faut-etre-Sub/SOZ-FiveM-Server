import { Injectable } from '@public/core/decorators/injectable';

@Injectable()
export class BlurService {
    private blurReasons: string[] = [];
    private isBlur = false;

    private update(delay: number) {
        if (this.blurReasons.length > 0 && !this.isBlur) {
            this.isBlur = true;
            TriggerScreenblurFadeIn(delay);
        } else if (this.blurReasons.length == 0 && this.isBlur) {
            if (IsScreenblurFadeRunning()) {
                DisableScreenblurFade();
            } else {
                TriggerScreenblurFadeOut(delay);
            }
            this.isBlur = false;
        }
    }

    public add(reason: string, delay: number): void {
        if (this.blurReasons.indexOf(reason) == -1) {
            this.blurReasons.push(reason);
        }
        this.update(delay);
    }

    public remove(reason: string, delay: number): void {
        if (reason == null) {
            this.blurReasons = [];
        } else {
            const index = this.blurReasons.indexOf(reason);
            if (index > -1) {
                this.blurReasons.splice(index, 1);
            }
        }
        this.update(delay);
    }
}
