import cn from 'classnames';
import { Link } from 'react-router-dom';

import { useConfig } from '../../../../hooks/usePhone';

const BackBtn = () => {
    const config = useConfig();

    return (
        <Link to={'/tax'} className={'mb-8 text-green-500'}>
            <span className={'font-semibold'}>Retour</span>
        </Link>
    );
};

export default BackBtn;
