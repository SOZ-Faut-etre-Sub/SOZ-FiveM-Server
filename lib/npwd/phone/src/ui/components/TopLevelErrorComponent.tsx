import React from 'react';
import { useTranslation } from 'react-i18next';

interface TopLevelErrorCompProps {
  hasError: boolean;
  errorMsg: string;
}

interface ErrorDialogCompProps {
  isOpen: boolean;
  errorMsg: string;
}

const ErrorDialogComp: React.FC<ErrorDialogCompProps> = ({ isOpen, errorMsg }) => {
  const [t] = useTranslation();

  const handleReloadClick = () => window.location.reload();

  return (
    <div>
      <div>{t('MISC.TOP_LEVEL_ERR_TITLE')}</div>
      <div>
        <div>
          {t('MISC.TOP_LEVEL_ERR_MSG')}
          <br />
          <br />
          <code style={{ color: 'red' }}>{errorMsg}</code>
        </div>
        <div>
          <div color="primary" onClick={handleReloadClick}>
            {t('MISC.TOP_LEVEL_ERR_ACTION')}
          </div>
        </div>
      </div>
    </div>
  );
};

export class TopLevelErrorComponent extends React.Component<any, TopLevelErrorCompProps> {
  public state = {
    hasError: false,
    errorMsg: '',
  };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMsg: error.message };
  }

  componentDidCatch(error: Error, { componentStack }: React.ErrorInfo) {
    captureException(error, { contexts: { react: { componentStack } } });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorDialogComp isOpen={this.state.hasError} errorMsg={this.state.errorMsg} />;
    }

    return this.props.children;
  }
}
