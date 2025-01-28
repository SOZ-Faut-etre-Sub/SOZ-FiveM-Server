import clsx from 'clsx';
import { useNavigate, useParams } from 'react-router-dom';

import { RepositoryType } from '../../../../../../shared/repository';
import { TaxType } from '../../../../../../shared/tax';
import { useAssetPath } from '../../../../../hook/assets';
import { useRepository } from '../../../../../hook/repository';
import { AppContent } from '../../../components/system/AppContent';
import { AppWrapper } from '../../../components/system/AppWrapper';
import { useAppTitleGetBackUpdater } from '../../../system/apps/hooks/useAppTitleGetBackUpdater';
import { useThemeConfig } from '../../../system/config/config.atom';
import { TaxesDescription } from '../constants';

export const TaxPage = () => {
    const navigate = useNavigate();
    const theme = useThemeConfig();
    const { id } = useParams();

    const { getPath } = useAssetPath();

    const taxes = useRepository(RepositoryType.Tax);
    const tax = taxes[id as TaxType] ?? { id, value: 11 };
    const taxDescription = TaxesDescription[id];

    useAppTitleGetBackUpdater(() => navigate(-1));

    return (
        <AppWrapper scrollable>
            <AppContent>
                {tax ? (
                    <>
                        <div className="flex justify-center">
                            <img
                                src={getPath(`images/phone/apps/tax/icon/${tax.id}.webp`)}
                                alt="taxes"
                                className="h-16"
                            />
                        </div>
                        <div className="pt-2 flex justify-center mb-12 py-1">
                            <h1
                                className={clsx(
                                    {
                                        'text-gray-100': theme === 'dark',
                                        'text-gray-700': theme === 'light',
                                    },
                                    'text-xl font-bold'
                                )}
                            >
                                {taxDescription.title}
                            </h1>
                        </div>
                        <div className="flex flex-col gap-4 ">
                            <section className="flex flex-col gap-4">
                                <span className="font-semibold text-green-500 text-lg">Présentation de la taxe</span>
                                {taxDescription.description}
                            </section>
                            <section className="flex flex-col gap-4">
                                <span className="font-semibold text-green-500 text-lg">Qui la modifie?</span>
                                {taxDescription.whoModifies}
                            </section>
                        </div>
                        <div className="h-14 bg-white shadow-lg rounded-lg p-4 flex justify-between mt-14">
                            <span className="text-black font-semibold">Montant de la taxe</span>
                            <span className="text-black font-semibold">{tax.value || 'N/A'}%</span>
                        </div>
                    </>
                ) : (
                    <span className="text-white mt-14">Tax not found</span>
                )}
            </AppContent>
        </AppWrapper>
    );
};
