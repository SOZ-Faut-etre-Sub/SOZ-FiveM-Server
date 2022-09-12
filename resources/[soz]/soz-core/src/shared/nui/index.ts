import { NuiFfsRecipeBookMethodMap } from './ffs_recipe_book';
import { NuiHealthBookMethodMap } from './health_book';
import { NuiInputMethodMap } from './input';
import { NuiMenuMethodMap } from './menu';

export interface NuiMethodMap {
    menu: NuiMenuMethodMap;
    input: NuiInputMethodMap;
    health_book: NuiHealthBookMethodMap;
    ffs_recipe_book: NuiFfsRecipeBookMethodMap;
}

export const eventNameFactory = <App extends keyof NuiMethodMap, Method extends keyof NuiMethodMap[App]>(
    app: App,
    method: Method
): string => `${String(app)}:${String(method)}`;
