import React, {forwardRef} from 'react';

export const Alert: React.FC<any> = forwardRef((props, ref) => {
    return (
        <div {...props} ref={ref}>
            <div >{props.children}</div>
        </div>
    );
});

export default Alert;
