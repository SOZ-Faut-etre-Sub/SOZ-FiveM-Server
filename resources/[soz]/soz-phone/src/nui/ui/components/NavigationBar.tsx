import { FunctionComponent, memo } from 'react';
import { Link } from 'react-router-dom';

export const NavigationBar: FunctionComponent = memo(() => {
    return (
        <div className="absolute flex bottom-0 left-0 right-0 w-full justify-center h-5 z-40">
            <Link to="/" className="bg-white bg-opacity-70 rounded w-2/4 h-[0.52rem] cursor-pointer" />
        </div>
    );
});
