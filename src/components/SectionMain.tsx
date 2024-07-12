// src/components/SectionMain.tsx
import React from 'react';

interface SectionMainProps {
  children: React.ReactNode;
}

const SectionMain: React.FC<SectionMainProps> = ({ children }) => {
  return (
    <div className="p-6 bg-gray-100 mx-auto flex flex-col h-full">
      {children}
    </div>
  );
};

export default SectionMain;
