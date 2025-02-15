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
        <AppWrapper className="flex" scrollable>
            <AppContent
                className={clsx({
                    'text-gray-100': theme === 'dark',
                    'text-gray-700': theme === 'light',
                })}
            >
                {tax ? (
                    <div className="grow flex flex-col justify-between mb-10">
                        <div>
                            <div className="flex justify-center">
                                <img
                                    src={getPath(`images/phone/apps/tax/icon/${tax.id}.webp`)}
                                    alt="taxes"
                                    className="h-16"
                                />
                            </div>
                            <div className="pt-2 flex justify-center mb-12 py-1">
                                <h1 className="text-xl font-bold">{taxDescription.title}</h1>
                            </div>
                            <div className="flex flex-col gap-4 ">
                                <section className="flex flex-col gap-4">
                                    <span className="font-semibold text-green-500 text-lg">
                                        Présentation de la taxe
                                    </span>
                                    {taxDescription.description}
                                </section>
                                <section className="flex flex-col gap-4">
                                    <span className="font-semibold text-green-500 text-lg">Qui la modifie?</span>
                                    {taxDescription.whoModifies}
                                </section>
                            </div>
                        </div>

                        <div
                            className={clsx('h-14 font-semibold shadow-lg rounded-lg p-4 flex justify-between', {
                                'bg-ios-700 text-gray-100 ': theme === 'dark',
                                'bg-white text-gray-700 ': theme === 'light',
                            })}
                        >
                            <span>Montant de la taxe</span>
                            <span>{tax.value || 'N/A'}%</span>
                        </div>
                    </div>
                ) : (
                    <span className="text-white mt-14">Tax not found</span>
                )}
            </AppContent>
        </AppWrapper>
    );
};
