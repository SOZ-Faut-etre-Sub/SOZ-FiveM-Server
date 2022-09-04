import '../styles/index.scss';

import { FunctionComponent } from 'react';

import { HealthBookApp } from './HealthBook/HealthBookApp';
import { InputApp } from './Input/InputApp';
import { MenuApp } from './Menu/MenuApp';

export const App: FunctionComponent = () => {
    return (
        <div className="w-full h-full">
            <MenuApp />
            <HealthBookApp />
            <InputApp />
        </div>
    );
};
