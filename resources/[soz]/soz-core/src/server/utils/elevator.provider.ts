import { OnEvent } from '@public/core/decorators/event';
import { Inject } from '@public/core/decorators/injectable';
import { Provider } from '@public/core/decorators/provider';
import { Tick } from '@public/core/decorators/tick';
import { DynamicElevator, DynamicElevatorConfigs, DynamicElevatorParams } from '@public/shared/elevators';
import { ServerEvent } from '@public/shared/event';
import { getRandomItem } from '@public/shared/random';

import { ElevatorRepository } from '../repository/elevator.repository';

@Provider()
export class ElevatorProvider {
    @Inject(ElevatorRepository)
    public elevatorRepository: ElevatorRepository;

    @OnEvent(ServerEvent.ELEVATOR_CALL)
    public async onElevatorMove(source: number, elevator: DynamicElevator, floor: number) {
        const elevatorState = await this.elevatorRepository.find(elevator);
        if (!elevatorState.next.includes(floor)) {
            elevatorState.next.push(floor);
        }
    }

    @Tick(500)
    public async elevatorTick() {
        const elevators = await this.elevatorRepository.raw();
        const now = Date.now();
        for (const id of Object.values(DynamicElevator)) {
            const elevator = elevators[id];
            if (now < elevator.timer) {
                continue;
            }

            if (elevator.inmotion) {
                elevator.doorState = true;
                elevator.inmotion = false;
                elevator.timer = now + 8_000;
                continue;
            }

            if (elevator.doorState) {
                elevator.doorState = false;
                elevator.timer = now + 4_000;
                continue;
            }

            if (elevator.next.length > 0) {
                const current = elevator.current;
                elevator.current = elevator.next.shift();
                if (current == elevator.current) {
                    elevator.doorState = true;
                    elevator.timer = now + 8_000;
                    continue;
                }

                const config = DynamicElevatorConfigs[id];
                const delta = config.floors[current].z - config.floors[elevator.current].z;

                elevator.timer = now + (Math.abs(delta) / DynamicElevatorParams.speed) * 1000 - delta * 600 + 2200;
                elevator.inmotion = true;
                elevator.music = getRandomItem(['elevator_music1', 'elevator_music2']);
            }
        }
    }
}
