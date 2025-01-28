import { QuestionMarkCircleIcon } from '@heroicons/react/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

import { TaxType } from '../../../../../../shared/tax';
import { AppContent } from '../../../components/system/AppContent';
import { AppTitle } from '../../../components/system/AppTitle';
import { AppWrapper } from '../../../components/system/AppWrapper';
import { useApp } from '../../../system/apps/hooks/useApp';
import { useAppTitleActionsUpdater } from '../../../system/apps/hooks/useAppTitleActionsUpdater';
import { TaxRow } from '../components/TaxRow';

export const TaxHome = () => {
    const navigate = useNavigate();
    const taxApp = useApp('taxes');

    useAppTitleActionsUpdater([
        {
            display: true,
            icon: <QuestionMarkCircleIcon className="size-5" />,
            onClick: () => navigate('/taxes/about'),
        },
    ]);

    return (
        <AppWrapper scrollable>
            <AppContent>
                <AppTitle app={taxApp} subtitle={format(new Date(), 'dd MMMM', { locale: fr })} />

                <div className="flex flex-col gap-3 grow">
                    {Object.values(TaxType).map(tax => (
                        <TaxRow key={tax} id={tax} />
                    ))}
                </div>
            </AppContent>
        </AppWrapper>
    );
};
