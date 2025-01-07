import { AppContainer } from '../../components/system/AppContainer';
import { AppWrapper } from '../../components/system/AppWrapper';

export const ZutomApp = () => {
    return (
        <AppContainer disableBackground forceControlColor="light">
            <div className="absolute inset-0 bg-[#2b2b2b] -z-10" />
            <AppWrapper>
                <iframe className="h-full w-full" src="https://sutom.nocle.fr" />
            </AppWrapper>
        </AppContainer>
    );
};
