import { FunctionComponent } from 'react';

type HealthCardProps = {
    account: string;
    name: string;
};

export const BankCard: FunctionComponent<HealthCardProps> = ({ name, account }) => {
    return (
        <div
            style={{
                backgroundImage: `url(/public/images/identity/bank.webp)`,
            }}
            className="transition bg-cover bg-no-repeat aspect-[855/539] h-[340px]"
        >
            <div className="flex pt-[33%] pl-[3.3vh] text-2xl uppercase text-[#4fd954] font-kreditblack">
                {account?.replace(/([A-Z\d]{4})/g, '$1 ') ?? ' '}
            </div>
            <p className="pl-[3.3vh] pt-[12%] uppercase italic font-bold text-white font-kreditback">{name}</p>
        </div>
    );
};
