import cn from 'classnames';
import { FunctionComponent, ReactNode } from 'react';
import { Link, To, useLocation } from 'react-router-dom';

import { useHudColor } from '../../Hud/hooks/useHudColor';

type MenuProp = {
    icon?: ReactNode;
    to?: To;
    onClick?: () => void;
    title: string;
    className?: string;
};

export const MenuLink: FunctionComponent<MenuProp> = ({ to, onClick, icon, title, className }) => {
    const { glassmorphismColors } = useHudColor();

    const location = useLocation();
    const isCurrentPath = location.pathname == to;

    const currentBorderColor = glassmorphismColors.border;

    return (
        <div className="relative">
            <Link
                to={to}
                onClick={onClick}
                className={cn('relative flex gap-4 items-center py-3 px-4 rounded-xl hover:bg-black/10', className)}
                style={{
                    backgroundColor: isCurrentPath ? glassmorphismColors.background : null,
                }}
            >
                {icon} {title}
            </Link>
            {isCurrentPath && (
                <div
                    className="absolute inset-0 transition-all duration-1000 border-2 border-transparent rounded-xl"
                    style={{
                        background: `linear-gradient(-40deg, ${currentBorderColor}FC 0%, ${currentBorderColor}1A 25%, ${currentBorderColor}1A 75%, ${currentBorderColor}FC 100%) border-box`,
                        WebkitMask: `linear-gradient(${currentBorderColor} 0 0) padding-box, linear-gradient(${currentBorderColor} 0 0) border-box`,
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                    }}
                />
            )}
        </div>
    );
};
