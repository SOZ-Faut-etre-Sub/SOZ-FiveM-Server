import cn from 'classnames';

import { useConfig } from '../../../hooks/usePhone';
import BackBtn from '../components/buttons/BackBtn';
import TransitionTax from '../components/Transition';

const WhatIsTax = () => {
    const config = useConfig();
    return (
        <TransitionTax>
            <BackBtn />
            <div className="flex justify-center mt-8">
                <img src={'media/taxApp/question.webp'} alt="taxes" className="h-16" />
            </div>
            <div className="pt-4 flex justify-center mb-12 py-1">
                <h1
                    className={cn(
                        [
                            {
                                'text-gray-100': config.theme.value === 'dark',
                                'text-gray-700': config.theme.value === 'light',
                            },
                        ],
                        'text-xl font-bold'
                    )}
                >
                    Les taxes, c'est <span className="font-semibold text-green-500 text-xl">quoi?</span>
                </h1>
            </div>
            <div
                className={cn(
                    [
                        {
                            'text-gray-100': config.theme.value === 'dark',
                            'text-gray-700': config.theme.value === 'light',
                        },
                    ],
                    'flex flex-col gap-4 overflow-auto'
                )}
            >
                <section className="flex flex-col gap-4">
                    <span className="font-semibold text-green-500 text-lg">Qu'est-ce qu'une taxe ?</span>
                    <span className="text-m">
                        Une taxe est une contribution financière obligatoire imposée par le gouvernement sur les
                        revenus, les biens, les transactions, et les services. Elle constitue une source de revenus
                        essentielle pour l'État, permettant de financer divers services publics tels que l'éducation, la
                        santé, et les infrastructures.
                    </span>
                </section>
                <section className="flex flex-col gap-4">
                    <span className="font-semibold text-green-500 text-lg">Objectifs des Taxes</span>
                    <span className="text-m">
                        Les taxes servent à plus qu'à financer les services publics. Elles sont également utilisées pour
                        influencer les comportements économiques, comme encourager l'adoption de pratiques écologiques
                        ou décourager la consommation de produits nocifs.
                    </span>
                </section>
            </div>
        </TransitionTax>
    );
};

export default WhatIsTax;
