import { NuiMethodMap } from '../../../../shared/nui/';

export const eventNameFactory = <App extends keyof NuiMethodMap, Method extends keyof NuiMethodMap[App]>(
    app: App,
    method: Method
): string => `${String(app)}:${String(method)}`;
