import { Vector3 } from '../../shared/polyzone/vector';
import { LightState, LightStateAnimation, LightStateTransition } from '../../shared/spotlight';

type CurrentTransition = {
    started_at: number;
    end_at: number;
    initial: LightState;
    transition: LightStateTransition;
};

type CurrentAnimation = {
    animation: LightStateAnimation;
    transitionIndex: number;
    currentCycle: number;
};

export class LightObject {
    public readonly initialState: LightState;

    private currentState: LightState;

    private animation: CurrentAnimation = null;

    private transition: CurrentTransition = null;

    public readonly object: number;

    constructor(object: number) {
        const position = GetEntityCoords(object, false) as Vector3;
        const direction = GetEntityRotation(object, 2) as Vector3;

        const state: LightState = {
            position,
            direction,
            color: [0, 0, 0],
            enabled: false,
        };

        this.object = object;
        this.initialState = state;

        this.doApplyState(state);
    }

    reset() {
        this.applyState({
            ...this.initialState,
        });
    }

    blink(duration: number, cycle?: number) {
        this.applyAnimation({
            loop: !cycle,
            cycle,
            transitions: [
                {
                    duration: duration,
                    next: {
                        ...this.currentState,
                        enabled: false,
                    },
                },
                {
                    duration: duration,
                    next: {
                        ...this.currentState,
                        enabled: true,
                    },
                },
            ],
        });
    }

    applyState(state: Partial<LightState>) {
        this.transition = null;
        this.animation = null;

        this.doApplyState({
            ...this.currentState,
            ...state,
        });
    }

    applyTransition(transition: LightStateTransition) {
        this.animation = null;
        this.doApplyTransition(transition);
    }

    applyAnimation(animation: LightStateAnimation) {
        this.animation = {
            animation,
            transitionIndex: 0,
            currentCycle: 0,
        };

        this.transition = null;
    }

    update() {
        if (this.transition) {
            const { started_at, end_at, transition, initial } = this.transition;
            const now = GetGameTimer();

            const progress = Math.min(1, (now - started_at) / (end_at - started_at));
            const state = calculateState(initial, transition.next, progress);

            this.doApplyState(state);

            if (progress >= 1) {
                this.transition = null;
            }
        }

        if (this.animation && !this.transition) {
            const { animation, transitionIndex } = this.animation;
            const transition = animation.transitions[transitionIndex];

            this.doApplyTransition(transition);
            this.animation.transitionIndex++;

            if (this.animation.transitionIndex === animation.transitions.length) {
                this.animation.currentCycle++;

                if (this.animation.animation.loop) {
                    this.animation.transitionIndex = 0;
                } else if (
                    this.animation.animation.cycle &&
                    this.animation.currentCycle < this.animation.animation.cycle
                ) {
                    this.animation.transitionIndex = 0;
                } else {
                    this.animation = null;
                }
            }
        }
    }

    private doApplyTransition(transition: LightStateTransition) {
        const start_at = GetGameTimer();
        const end_at = start_at + transition.duration;

        this.transition = {
            started_at: start_at,
            end_at: end_at,
            initial: {
                position: [...this.currentState.position],
                direction: [...this.currentState.direction],
                color: [...this.currentState.color],
                enabled: this.currentState.enabled,
            },
            transition,
        };
    }

    private doApplyState(state: LightState) {
        if (!DoesEntityExist(this.object)) {
            console.log('Entity does not exist', this.object);

            return;
        }

        if (!IsEntityVisible(this.object)) {
            console.log('Entity is not visible', this.object);
            return;
        }

        this.currentState = state;

        SetEntityCoords(
            this.object,
            state.position[0],
            state.position[1],
            state.position[2],
            false,
            false,
            false,
            false
        );
        SetEntityRotation(this.object, state.direction[0], state.direction[1], state.direction[2], 2, false);

        const color = state.enabled ? state.color : [0, 0, 0];

        SetObjectLightColor(this.object, true, color[0], color[1], color[2]);
    }
}

const calculateState = (initial: LightState, target: LightState, progress: number): LightState => {
    const positionX = calculateProgress(initial.position[0], target.position[0], progress);
    const positionY = calculateProgress(initial.position[1], target.position[1], progress);
    const positionZ = calculateProgress(initial.position[2], target.position[2], progress);

    const directionX = calculateProgress(initial.direction[0], target.direction[0], progress);
    const directionY = calculateProgress(initial.direction[1], target.direction[1], progress);
    const directionZ = calculateProgress(initial.direction[2], target.direction[2], progress);

    // @TODO do better for color
    const colorR = calculateProgress(initial.color[0], target.color[0], progress);
    const colorG = calculateProgress(initial.color[1], target.color[1], progress);
    const colorB = calculateProgress(initial.color[2], target.color[2], progress);

    const enabled = target.enabled;

    return {
        position: [positionX, positionY, positionZ],
        direction: [directionX, directionY, directionZ],
        color: [colorR, colorG, colorB],
        enabled,
    };
};

const calculateProgress = (a: number, b: number, p: number) => a + (b - a) * p;
