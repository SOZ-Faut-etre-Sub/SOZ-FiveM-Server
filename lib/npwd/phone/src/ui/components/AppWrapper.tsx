import React from 'react';
import {AppWrapperTypes} from '../interface/InterfaceUI';
import {Grow} from "@mui/material";

export const AppWrapper: React.FC<AppWrapperTypes> = ({
    children,
    style,
    handleClickAway,
    ...props
}) => {

    return (
        <Grow in={true} style={{transformOrigin: `50% 50%`}}>
            <div
                {...props}
                style={{
                    padding: 0,
                    margin: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    position: 'relative',
                    flexDirection: 'column',
                    minHeight: '720px',
                    ...style,
                }}
            >
                {children}
            </div>
        </Grow>
    );
};
