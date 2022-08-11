import '../styles/index.scss';

import { FunctionComponent } from 'react';

import { MenuApp } from './Menu/MenuApp';

export const App: FunctionComponent = () => {
    return (
        <div className="w-full h-full">
            <MenuApp />
        </div>
    );
};
