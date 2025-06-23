import { FunctionComponent, useState } from 'react';

import { VoiceDebugInfo } from '../../../shared/voip';
import { useNuiEvent } from '../../hook/nui';

export const DebugVoip: FunctionComponent = () => {
    const [debugVoip, setDebugVoip] = useState<VoiceDebugInfo | null>(null);
    useNuiEvent('hud', 'VoipDebug', setDebugVoip);

    if (!debugVoip) {
        return null;
    }

    const listeners = debugVoip.listeners;

    return (
        <div className="bg-black/25 absolute right-5 top-5">
            <div>Proximity: {debugVoip.proximity}</div>
            <div>Net Proximity: {debugVoip.networkProximity}</div>
            <div>VoiceMode: {debugVoip.voiceMode}</div>
            <div>Override input range: {debugVoip.overrideInputRange}</div>
            <div>
                <h2 className="text-xl">Targets</h2>
                {Object.keys(debugVoip.targets).map(target => {
                    const targetInfo = debugVoip.targets[target] as string[];

                    return (
                        <div key={target}>
                            Target: {target}, contexts: {targetInfo.join(', ')}
                        </div>
                    );
                })}
                {Object.keys(debugVoip.targets).length === 0 && <div>No targets</div>}
            </div>
            {listeners.map(listener => {
                return (
                    <div key={listener.serverId} className="bg-black/25">
                        <h3 className="text-xl">Listener: {listener.serverId}</h3>
                        {Object.keys(listener.contexts).map(context => {
                            const contextInfo = listener.contexts[context];

                            return (
                                <div key={context}>
                                    Context: {context} | Data : {JSON.stringify(contextInfo)}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
            <div>
                <h2 className="text-xl">Submixes</h2>
                {debugVoip.submixes.map(([serverId, submixId]) => {
                    return (
                        <div key={serverId}>
                            ServerId: {serverId} - Submix: {submixId}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
