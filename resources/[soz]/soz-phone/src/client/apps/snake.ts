import { SnakeEvents } from '../../../typings/snake';
import { sendSnakeEvent } from '../../utils/messages';
import { RegisterNuiProxy } from '../cl_utils';

RegisterNuiProxy(SnakeEvents.GET_HIGHSCORE);
RegisterNuiProxy(SnakeEvents.SET_HIGHSCORE);

onNet(SnakeEvents.UPDATE_HIGHSCORE, (result: number) => {
    sendSnakeEvent(SnakeEvents.UPDATE_HIGHSCORE, result);
});
