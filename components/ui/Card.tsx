
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const cardClasses = `bg-white dark:bg-slate-800 rounded-xl shadow-md dark:shadow-none dark:border dark:border-slate-700 overflow-hidden p-6 ${className} ${onClick ? 'cursor-pointer hover:shadow-lg dark:hover:bg-slate-700 transition-shadow' : ''}`;
  
  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;