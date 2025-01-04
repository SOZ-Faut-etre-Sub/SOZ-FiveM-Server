import clsx from 'clsx';

import { Button } from '../../../components/Button';
import { useThemeConfig } from '../../config/config.atom';
import { useAlerts } from '../alerts.atom';

export const Alerts = () => {
    const alert = useAlerts();
    const theme = useThemeConfig();

    if (!alert) return null;

    return (
        <div className="absolute flex justify-center items-center z-50 inset-0">
            <div
                className={clsx('w-4/5 rounded-2xl', {
                    'bg-ios-800 bg-opacity-85 text-white': theme === 'dark',
                    'bg-white bg-opacity-85 text-black': theme === 'light',
                })}
            >
                <div className="pt-5 px-5 text-center">
                    <div className="font-bold">{alert.title}</div>
                    <div className="text-[.9rem] py-2">{alert.content}</div>
                    {alert.children && <div className="py-2">{alert.children}</div>}
                </div>

                <div className="flex border-t border-white border-opacity-80 divide-x divide-white divide-opacity-80">
                    {alert.onClose && (
                        <Button className="grow p-2 text-center text-red-500" onClick={alert.onClose}>
                            Annuler
                        </Button>
                    )}
                    <Button className="grow p-2 text-center text-blue-500" onClick={alert.onSubmit}>
                        Valider
                    </Button>
                </div>
            </div>
        </div>
    );
};
