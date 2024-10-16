import { Link } from 'react-router-dom';

const BackBtn = () => {
    return (
        <Link to={'/tax'} className={'mb-8 text-green-500'}>
            <span className={'font-semibold'}>Retour</span>
        </Link>
    );
};

export default BackBtn;
