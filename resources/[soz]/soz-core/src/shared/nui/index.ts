import { NuiMenuEventMap } from './menu';

export interface NuiMethodMap {
    menu: NuiMenuEventMap;
}

// declare function dispatch<K extends keyof NuiMethodMap, M extends keyof NuiMethodMap[K]>(
//     app: K,
//     method: M,
//     event: NuiMethodMap[K][M]
// );
