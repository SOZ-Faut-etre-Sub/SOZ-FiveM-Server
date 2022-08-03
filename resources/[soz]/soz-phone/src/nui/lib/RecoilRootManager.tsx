import React, { PropsWithChildren } from 'react';
import { RecoilRoot } from 'recoil';

// Because how both recoil functions and how our store works, we need
// to use *somewhat* of a hack for resetting the global state. In this case,
// we just increment a counter every time we change characters in order to force
// a refresh
// This is liable to memory leaky behavior in extreme cases.

export const RecoilRootManager: React.FC<PropsWithChildren> = ({ children }) => {
    return <RecoilRoot>{children}</RecoilRoot>;
};
