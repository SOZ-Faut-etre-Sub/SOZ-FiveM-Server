import classnames from 'classnames';
import { FunctionComponent, ReactNode } from 'react';
import { Link, To, useLocation } from 'react-router-dom';

type MenuProp = {
    icon: ReactNode;
    to?: To;
    onClick?: () => void;
    title: string;
    className?: string;
};

export const MenuLink: FunctionComponent<MenuProp> = ({ to, onClick, icon, title, className }) => {
    const location = useLocation();
    const isCurrentPath = location.pathname == to;

    return (
        <Link
            to={to}
            onClick={onClick}
            className={classnames('flex gap-4 items-center py-3 px-4 rounded-lg', className, {
                'bg-green-500/20 hover:bg-green-600/20': isCurrentPath,
                'hover:bg-[#444c56]/20': !isCurrentPath,
            })}
        >
            {icon} {title}
        </Link>
    );
};
