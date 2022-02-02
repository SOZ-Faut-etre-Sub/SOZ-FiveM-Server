import React from 'react';
import {AppWrapperTypes} from '../interface/InterfaceUI';
import {useRouteMatch} from "react-router-dom";

export const AppWrapper: React.FC<AppWrapperTypes> = ({
    children,
}) => {
    const {isExact} = useRouteMatch('/');

    return (
        <div className={`p-0 m-0 relative flex flex-col h-full w-full min-h-[720px]`}>
            {/*${ !isExact && 'bg-red-500'}*/}
            {children}
        </div>
    );
};
