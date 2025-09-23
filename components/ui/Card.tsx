import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const cardClasses = `bg-white rounded-xl shadow border border-slate-200/60 overflow-hidden ${className} ${onClick ? 'cursor-pointer hover:shadow-lg hover:border-slate-200 transition-all duration-200 active:scale-[0.98]' : ''}`;
  
  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;