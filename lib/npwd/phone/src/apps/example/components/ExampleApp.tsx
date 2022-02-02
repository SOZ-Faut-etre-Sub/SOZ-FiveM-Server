import React, { useState } from 'react';
import { useExampleStringValue } from '../hooks/state';
import useSound from '@os/sound/hooks/useSound';
import { useApp } from '@os/apps/hooks/useApps';

export const ExampleApp: React.FC = () => {
  const exampleString = useExampleStringValue();
  const [soundName, setSound] = useState('pixel.ogg');
  const { play, playing, stop } = useSound('media/ringtones/' + soundName);
  const example = useApp('EXAMPLE');

  const toggleSound = () => {
    if (soundName === 'pixel.ogg') {
      setSound('marimba.ogg');
      return;
    }
    setSound('pixel.ogg');
  };

  return (
    <div>
      <div>Welcome to NPWD!</div>
      <button color="primary">{example.id}</button>
      {/* Here we are using the value in a h3 tag */}
      <h3>{exampleString}</h3>
      {/*<IconButton onClick={() => (playing ? stop() : play())} size="large">*/}
      {/*  {playing ? <Stop /> : <PlayArrow />}*/}
      {/*</IconButton>*/}
      <button onClick={toggleSound}>Change sound on the fly</button>
    </div>
  );
};
