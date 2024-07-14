import { Injectable } from '@public/core/decorators/injectable';

@Injectable()
export class BlurService {
    private blurRaisons: string[] = [];
    private isBlur = false;

    private update(delay: number) {
        if (this.blurRaisons.length > 0 && !this.isBlur) {
            this.isBlur = true;
            TriggerScreenblurFadeIn(delay);
        } else if (this.blurRaisons.length == 0 && this.isBlur) {
            if (IsScreenblurFadeRunning()) {
                DisableScreenblurFade();
            } else {
                TriggerScreenblurFadeOut(delay);
            }
            this.isBlur = false;
        }
    }

    public add(icon: string, delay: number): void {
        if (this.blurRaisons.indexOf(icon) == -1) {
            this.blurRaisons.push(icon);
        }
        this.update(delay);
    }

    public remove(icon: string, delay: number): void {
        if (icon == null) {
            this.blurRaisons = [];
        } else {
            const index = this.blurRaisons.indexOf(icon);
            if (index > -1) {
                this.blurRaisons.splice(index, 1);
            }
        }
        this.update(delay);
    }
}
