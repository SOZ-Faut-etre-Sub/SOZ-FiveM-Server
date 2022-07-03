import React from 'react';
import { Route } from 'react-router-dom';

export const AppRoute = ({ component: Component, ...rest }) => {
    return <Route {...rest} render={() => <Component />} />;
};
