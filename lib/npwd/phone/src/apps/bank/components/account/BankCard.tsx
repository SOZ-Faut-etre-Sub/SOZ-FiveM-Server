import React from 'react';
import card from '../../assets/carte_de_credit_soz.png';

export const BankCard = (props) => {
    return (
        <div className="relative px-5">
            <h2 className="absolute bottom-20 mb-1 left-12 card-text text-[#4fd954] text-xl">
                {props.account.replace(/([A-Z\d]{4})/g, "$1 ")}
            </h2>
            <h3 className="absolute bottom-4 left-12 card-text text-white text-2xl">{props.name}</h3>
            <img src={card} alt=""/>
        </div>
    );
};
