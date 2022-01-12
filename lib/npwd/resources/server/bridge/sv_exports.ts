import { generateUniquePhoneNumber } from '../misc/generateUniquePhoneNumber';
import { bridgeLogger } from './bridge.utils';
import { config } from '../server';
import { PlayerAddData } from '../players/player.interfaces';
import { playerLogger } from '../players/player.utils';
import PlayerService from '../players/player.service';
import { PhoneEvents } from '../../../typings/phone';

const exp = global.exports;

const logExport = (exportName: string, msg: string) => {
  bridgeLogger.debug(`[${exportName}] ${msg}`);
};

// Will generate and return a unique phone number
exp('generatePhoneNumber', async () => {
  const num = await generateUniquePhoneNumber();
  logExport('generatePhoneNumber', num);
  return num;
});
