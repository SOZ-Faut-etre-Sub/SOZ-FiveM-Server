import { SOZ_CORE_IS_PRODUCTION } from '../../../../../../globals';

export const isEnvBrowser = (): boolean => !SOZ_CORE_IS_PRODUCTION && !(window as any).invokeNative;
