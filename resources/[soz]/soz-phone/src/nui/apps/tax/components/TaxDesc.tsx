import cn from 'classnames';

import { useConfig } from '../../../hooks/usePhone';
import getImg from '../utils/getImg';

type TaxDescType = {
    title: string;
    description: string;
    consequences: string;
    taxAmount: number;
    whoModifies: string;
    id: string;
};

const TaxDesc = ({ tax, taxAmount }: { tax: TaxDescType; taxAmount?: string }) => {
    const config = useConfig();

    const getText = (text: string) => {
        return (
            <div
                className={cn(
                    [
                        {
                            'text-gray-100': config.theme.value === 'dark',
                            'text-gray-700': config.theme.value === 'light',
                        },
                    ],
                    'text-sm'
                )}
            >
                {text}
            </div>
        );
    };
    return (
        <>
            <div className="flex justify-center">
                <img src={getImg(tax.id)} alt="taxes" className="h-16" />
            </div>
            <div className="pt-2 flex justify-center mb-12 py-1">
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
                    {tax.title}
                </h1>
            </div>
            <div className="flex flex-col gap-4 ">
                <section className="flex flex-col gap-4">
                    <span className="font-semibold text-green-500 text-lg">Présentation de la taxe</span>
                    {getText(tax.description)}
                </section>
                <section className="flex flex-col gap-4">
                    <span className="font-semibold text-green-500 text-lg">Qui la modifie?</span>
                    {getText(tax.whoModifies)}
                </section>
                <section className="flex flex-col gap-4">
                    <span className="font-semibold text-green-500 text-lg">Quelles sont les conséquences?</span>
                    {getText(tax.consequences)}
                </section>
            </div>
            <div className="h-14 bg-white shadow-lg rounded-lg p-4 flex justify-between mt-14">
                <span className="text-black font-semibold">Montant de la taxe</span>
                <span className="text-black font-semibold">{taxAmount || 'N/A'}%</span>
            </div>
        </>
    );
};

export default TaxDesc;
