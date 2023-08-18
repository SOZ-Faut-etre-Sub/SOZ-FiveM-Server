import React from 'react';

import { Game, init } from '../components/Game';
export const Context = React.createContext<Game>(init());
