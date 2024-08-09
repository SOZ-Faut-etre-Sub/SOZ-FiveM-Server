import { Link } from 'react-router-dom';

const BackBtn = () => (
    <Link to={'/tax'} className={'text-white mb-8'}>
        <span className={'font-semibold'}>Retour</span>
    </Link>
);

export default BackBtn;
