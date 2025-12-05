import React from 'react';
import Icon from './Icon';

const LoadingScreen: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-slate-50 min-h-[50vh]">
      <div className="animate-bounce">
        <Icon name="flutter_dash" className="text-6xl text-slate-300" />
      </div>
      <p className="mt-4 text-slate-500 font-medium animate-pulse">Carregando...</p>
    </div>
  );
};

export default LoadingScreen;