import { createContext } from 'react';

import { Game, init } from '../game/Game';

export const Context = createContext<Game>(init());
