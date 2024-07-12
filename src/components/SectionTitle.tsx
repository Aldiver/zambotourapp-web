// src/components/SectionTitle.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  route?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, route }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>
      {route && route.trim() !== "" && (
        <Link to={route}>
          <button
            className="mt-4 md:mt-0 md:ml-4 w-full md:w-auto rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white"
          >
            Create
          </button>
        </Link>
      )}
    </div>
  );
};

export default SectionTitle;
