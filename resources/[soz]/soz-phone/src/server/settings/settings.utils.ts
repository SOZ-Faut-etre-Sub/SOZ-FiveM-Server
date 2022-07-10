import { mainLogger } from '../sv_logger';

export const settingsLogger = mainLogger.child({ module: 'settings' });
