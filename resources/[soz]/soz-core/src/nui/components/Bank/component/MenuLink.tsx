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
            className={classnames('relative flex gap-4 items-center py-3 px-4 rounded-lg', className, {
                'text-teal-400 bg-white/5 before:absolute before:top-0 before:-left-2.5 before:h-full before:w-1 before:rounded-l-md before:bg-teal-800':
                    isCurrentPath,
                'hover:bg-white/10': !isCurrentPath,
            })}
        >
            {icon} {title}
        </Link>
    );
};
