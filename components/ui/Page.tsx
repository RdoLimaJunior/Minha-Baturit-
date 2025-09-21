import React from 'react';
import Button from './Button';
import Icon from './Icon';

interface PageProps {
  title: string;
  goBack: () => void;
  children: React.ReactNode;
}

const Page: React.FC<PageProps> = ({ title, goBack, children }) => {
  return (
    <div className="container mx-auto px-4 py-4 space-y-4">
      <div className="flex items-center space-x-2">
        <Button onClick={goBack} variant="ghost" size="icon" aria-label="Voltar">
          <Icon name="arrow_back" />
        </Button>
        <h1 className="text-2xl font-bold text-slate-800 truncate">{title}</h1>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Page;
