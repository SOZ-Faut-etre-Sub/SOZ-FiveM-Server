import { mainLogger } from '../sv_logger';

export const weatherLogger = mainLogger.child({ module: 'weather' });
