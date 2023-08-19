import React from 'react';

import { Game, init } from '../game/Game';
export const Context = React.createContext<Game>(init());
