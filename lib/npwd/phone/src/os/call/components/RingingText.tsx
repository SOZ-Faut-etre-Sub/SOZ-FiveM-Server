import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const RingingText = () => {
  const [t] = useTranslation();
  const [text, setText] = useState<string>(t('CALLS.MESSAGES.RINGING'));
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    const id = setInterval(() => {
      if (step < 3) {
        setStep(step + 1);
        setText(text + '.');
      } else {
        setText(t('CALLS.MESSAGES.RINGING'));
        setStep(0);
      }
    }, 500);
    return () => clearInterval(id);
  }, [step, text, t]);

  return (
      <div className="flex flex-col justify-center items-center text-gray-300">
          <div className="font-light">{text}</div>
      </div>
  );
};

export default RingingText;
