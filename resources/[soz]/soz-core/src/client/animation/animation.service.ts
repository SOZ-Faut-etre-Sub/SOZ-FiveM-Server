import { Inject, Injectable } from '../../core/decorators/injectable';
import { wait } from '../../core/utils';
import { ResourceLoader } from '../resources/resource.loader';

export type Animation = {
    enter?: AnimationInfo;
    base: AnimationInfo;
    exit?: AnimationInfo;
};

export type AnimationInfo = {
    dictionary: string;
    name: string;
    duration?: number;
};

type AnimationTask = {
    animation: Animation;
    reject: (reason: any) => void;
    resolve: () => void;
};

@Injectable()
export class AnimationService {
    @Inject(ResourceLoader)
    private resourceLoader: ResourceLoader;

    private queue: AnimationTask[] = [];

    private running = false;

    private currentAnimation: AnimationTask | null = null;

    private currentAnimationLoopResolve: () => void;

    private playAnimation(animation: AnimationInfo, forceDuration: boolean): number {
        const duration = animation.duration ? animation.duration : forceDuration ? 1000 : -1;

        TaskPlayAnim(
            PlayerPedId(),
            animation.dictionary,
            animation.name,
            8.0,
            -8.0,
            duration,
            0,
            0.0,
            false,
            false,
            false
        );

        return duration;
    }

    public async loop() {
        this.running = true;

        while (this.running) {
            if (this.queue.length === 0) {
                await wait(100);

                continue;
            }

            const animationPromise = new Promise<void>(resolve => {
                this.currentAnimationLoopResolve = resolve;
            });

            this.currentAnimation = this.queue.shift();

            if (this.currentAnimation.animation.enter) {
                await wait(this.playAnimation(this.currentAnimation.animation.enter, true));
            }

            const duration = this.playAnimation(this.currentAnimation.animation.base, false);

            if (duration !== -1) {
                await wait(duration);
            } else {
                await animationPromise;
            }

            if (this.currentAnimation.animation.exit) {
                await wait(this.playAnimation(this.currentAnimation.animation.exit, true));
            }

            this.currentAnimation.resolve();

            this.currentAnimation = null;
            this.currentAnimationLoopResolve = null;
        }
    }

    public async play(animation: Animation): Promise<void> {
        const promise = new Promise<void>((resolve, reject) => {
            this.queue.push({
                animation,
                reject,
                resolve,
            });
        });

        if (animation.enter?.dictionary) {
            await this.resourceLoader.loadAnimationDictionary(animation.enter.dictionary);
        }

        if (animation.base.dictionary) {
            await this.resourceLoader.loadAnimationDictionary(animation.base.dictionary);
        }

        if (animation.exit?.dictionary) {
            await this.resourceLoader.loadAnimationDictionary(animation.exit.dictionary);
        }

        // Will stop current animation if in loop
        if (this.currentAnimationLoopResolve) {
            this.currentAnimationLoopResolve();
        }

        return promise;
    }

    public async stop() {
        if (this.currentAnimationLoopResolve) {
            this.currentAnimationLoopResolve();
        }
    }

    public destroy() {
        this.running = false;
    }
}
