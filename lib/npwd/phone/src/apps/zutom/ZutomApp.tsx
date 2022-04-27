import { Transition } from "@headlessui/react";
import {AppWrapper} from "@ui/components";

export const ZutomApp: React.FC = () => {
    return (
        <Transition
            appear={true}
            show={true}
            className="h-full"
            enter="transition-all origin-[60%_20%] duration-500"
            enterFrom="scale-[0.0] opacity-0"
            enterTo="scale-100 opacity-100"
            leave="transition-all origin-[60%_20%] duration-500"
            leaveFrom="scale-100 opacity-100"
            leaveTo="scale-[0.0] opacity-0"
        >
            <AppWrapper>
                <iframe is="x-frame-bypass" src='https://sutom.nocle.fr' style={{width: '100%', height: ' 100%'}} />
            </AppWrapper>
        </Transition>
    );
}
