import { Link } from 'react-router-dom';

const WhatIsTaxBtn = () => (
    <Link
        to={'whatIs'}
        className={
            'transition-all hover:bg-ios-600 h-14 shadow-lg rounded-lg p-4 cursor-pointer bg-[#36393f] text-white flex justify-center gap-4 items-center'
        }
    >
        <img src={'media/taxApp/question.webp'} alt="taxes" className="h-8" />
        <span className={'font-semibold'}>Les taxes, c&apos;est quoi?</span>
    </Link>
);

export default WhatIsTaxBtn;
