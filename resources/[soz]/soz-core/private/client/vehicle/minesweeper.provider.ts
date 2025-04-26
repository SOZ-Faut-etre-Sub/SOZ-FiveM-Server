import { Provider } from '@public/core/decorators/provider';

@Provider()
export class MineSweeperRobotProvider {
    public isUsingRobot(): boolean {
        return false;
    }
}
