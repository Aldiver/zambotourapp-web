// src/components/SectionTitle.tsx
import React from "react";
import { Link } from "react-router-dom";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  route?: string;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  route,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>
      {route && route.trim() !== "" && (
        <Link to={route}>
          <button className="inline-flex items-center gap-2 rounded border bg-orange-theme-500 px-8 py-3 text-white hover:bg-transparent hover:text-orange-theme-500 focus:outline-none focus:ring active:text-orange-theme-500">
            Create
          </button>
        </Link>
      )}
    </div>
  );
};

export default SectionTitle;
