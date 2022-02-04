import React, {useContext} from 'react';
import {DialInputCtx} from '../context/InputContext';
import {BackspaceIcon, PhoneIcon} from "@heroicons/react/solid";

interface ButtonItemProps {
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    label: string | JSX.Element | number;
    className?: string;
}

const ButtonItem: React.FC<ButtonItemProps> = ({label, onClick, className}) => {
    return (
        <button className={`flex justify-center items-center w-20 aspect-square m-2 bg-[#333333] hover:bg-[#444444] rounded-full cursor-pointer ${className}`} onClick={onClick}>
            <span>{label}</span>
        </button>
    );
};

export const DialGrid = () => {
    const {add, removeOne, clear} = useContext(DialInputCtx);

    return (
        <div className="text-white">
            <div className="grid grid-cols-3 justify-items-center mx-8">
                <ButtonItem label={1} onClick={() => add(1)}/>
                <ButtonItem label={2} onClick={() => add(2)}/>
                <ButtonItem label={3} onClick={() => add(3)}/>
                <ButtonItem label={4} onClick={() => add(4)}/>
                <ButtonItem label={5} onClick={() => add(5)}/>
                <ButtonItem label={6} onClick={() => add(6)}/>
                <ButtonItem label={7} onClick={() => add(7)}/>
                <ButtonItem label={8} onClick={() => add(8)}/>
                <ButtonItem label={9} onClick={() => add(9)}/>
                <ButtonItem label="-" onClick={() => add('-')}/>
                <ButtonItem label={0} onClick={() => add(0)}/>
                <ButtonItem label={<BackspaceIcon className="h-8 w-8" />} onClick={removeOne}/>
                <ButtonItem label={<PhoneIcon className="h-8 w-8" />} className="col-start-2 bg-[#2DD158] hover:bg-[#21B147]"/>
            </div>
        </div>
    );
};

export default DialGrid;
