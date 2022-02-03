import React from 'react';
import {AppContentTypes} from '../interface/InterfaceUI';
import {LoadingSpinner} from '@ui/components/LoadingSpinner';

export const AppContent: React.FC<any> = ({
    children,
    paperStyle,
    backdrop,
    disableSuspenseHandler,
    onClickBackdrop,
    ...props
}) => {

    const ChildElements = () => (
        <>
            <div onClick={onClickBackdrop}/>
            <div >
                {children}
            </div>
        </>
    );

    return (
        <div className="mt-4" {...props} style={backdrop ? {overflow: 'hidden'} : {overflow: 'auto'}}>
            {!disableSuspenseHandler ? (
                <React.Suspense fallback={<LoadingSpinner/>}>
                    <ChildElements/>
                </React.Suspense>
            ) : (
                <ChildElements/>
            )}
        </div>
    );
};
