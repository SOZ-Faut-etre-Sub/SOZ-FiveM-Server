import Divider from './Divider';

const Header = ({ divider }: { divider?: boolean }) => (
    <>
        <div className="pt-2 flex justify-center h-28 items-center">
            <img src={'media/taxApp/gouvIco.webp'} alt="taxes" className="h-24" />
        </div>
        {divider && <Divider />}
    </>
);

export default Header;
