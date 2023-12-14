import React from 'react';
import Emoji from "./Emoji";

const EmojiTextRenderer = ({ text }) => {
  return text.split(/(:[a-zA-Z0-9-_+]+:)/g).map((segment, i) => {
    if (segment.startsWith(':') && segment.endsWith(':')) {
      return <Emoji key={i} emoji={segment} />;
    }

    return <React.Fragment key={i}>{segment}</React.Fragment>;
  });
};

export default EmojiTextRenderer;
