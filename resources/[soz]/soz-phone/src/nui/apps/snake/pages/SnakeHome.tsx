import React, { memo } from 'react';

import SnakeBoard from '../components/SnakeBoard';

export const SnakeHome = memo(() => {
    return (
        <div>
            <SnakeBoard />
        </div>
    );
});
