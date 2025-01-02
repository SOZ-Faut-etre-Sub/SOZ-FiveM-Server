import React, { FunctionComponent, PropsWithChildren } from 'react';

type ActionSheetContainerProps = PropsWithChildren;

export const ActionSheetContainer: FunctionComponent<ActionSheetContainerProps> = ({ children }) => {
    return <ul className="bg-ios-600 bg-opacity-95 rounded-2xl">{children}</ul>;
};
