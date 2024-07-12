// src/components/CardBox.tsx
import React from 'react';

interface CardBoxProps {
  children: React.ReactNode;
}

const CardBox: React.FC<CardBoxProps> = ({ children }) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md ">
      {children}
    </div>
  );
};

export default CardBox;
