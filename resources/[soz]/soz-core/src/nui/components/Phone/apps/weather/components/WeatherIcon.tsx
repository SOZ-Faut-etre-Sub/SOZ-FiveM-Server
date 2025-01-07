import { FunctionComponent } from 'react';

import { useIcon } from '../hooks/useIcon';

interface WeatherIconProps {
    icon: string;
    size: string;
    className?: string;
}

export const WeatherIcon: FunctionComponent<WeatherIconProps> = ({ icon, size, className }) => {
    const Icon = useIcon(icon);
    if (!Icon) return null;

    return <Icon className={className} height={size} width={size} />;
};
