import cn from 'classnames';
import { useParams, useSearchParams } from 'react-router-dom';

import BackBtn from '../components/buttons/BackBtn';
import TaxDesc from '../components/TaxDesc';
import TransitionTax from '../components/Transition';
import { TaxeDescription } from '../utils/constants';

const TaxPage = () => {
    const params = useParams();

    const [searchParams] = useSearchParams();
    const paramValue = searchParams.get('taxAmount');

    const DOMToRender = () => {
        if (!params || !params.id) {
            return <span className="text-white mt-14">Tax not found</span>;
        } else {
            const tax = TaxeDescription.find((tax) => tax.id === params.id);
            if (!tax) {
                return <span>Tax not found</span>;
            }
            return <TaxDesc tax={tax} taxAmount={paramValue} />;
        }
    };

    return (
        <TransitionTax>
            {
                <div className={cn('w-full h-full flex flex-col m-auto overflow-auto')}>
                    <BackBtn />
                    {DOMToRender()}
                </div>
            }
        </TransitionTax>
    );
};

export default TaxPage;
