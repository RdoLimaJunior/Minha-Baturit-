
import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const cardClasses = `bg-white rounded-xl shadow-md overflow-hidden p-6 ${className} ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`;
  
  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
