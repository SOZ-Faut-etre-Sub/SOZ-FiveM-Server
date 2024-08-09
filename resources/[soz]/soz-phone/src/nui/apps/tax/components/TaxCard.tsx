import { Link } from 'react-router-dom';

import getImg from '../utils/getImg';

export const TaxCard = ({ id, taxAmount }: { id: string; taxAmount: number }) => {
    return (
        <Link
            to={`tax/${id}?taxAmount=${taxAmount}`}
            className="transition-all flex flex-col justify-center items-center h-28 shadow-lg rounded-lg p-4 cursor-pointer bg-[#36393f] hover:bg-ios-600 gap-2"
        >
            <img src={getImg(id)} alt="taxes" className="h-12" />
            <span className="font-semibold text-white">{taxAmount}%</span>
        </Link>
    );
};
