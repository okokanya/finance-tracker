import React, { ErrorInfo, PropsWithChildren } from 'react';

import { cn } from '@/utils/cn';

import Text from '../base/text';
import Title from '../base/title';
import Button from './button';

type ErrorBoundaryProps = PropsWithChildren<{
  error?: Error;
}>;

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log({ error, errorInfo });
  }

  handleClick = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          className={cn('mx-auto flex h-[100dvh] max-w-[1180px] items-center justify-center py-5')}
        >
          <div className={cn('flex max-w-[400px] flex-col gap-2')}>
            <div className={cn('items-self-start flex flex-col gap-2')}>
              <Title>Что-то пошло не так</Title>
              <Text isBold>Попробуйте перезагрузить страницу</Text>
            </div>

            <Button className={cn('self-start')} onClick={this.handleClick}>
              Перезагрузить
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
