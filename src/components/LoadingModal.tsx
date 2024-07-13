import React from 'react';

interface LoadingModalProps {
    isOpen: boolean;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="flex items-center justify-center mb-4">
                    <svg className="animate-spin h-8 w-8 mr-3 text-orange-theme-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.001 8.001 0 0112 4.472v3.75L9.777 9.256l1.414 1.415 3.536-3.536A7.963 7.963 0 0119.155 12H20c0-4.418-3.582-8-8-8V4.472A7.963 7.963 0 014.472 12H1c0 5.523 4.477 10 10 10v-3.472L8.414 14.68l-2.414-2.415z"></path>
                    </svg>
                    <span className="text-lg font-medium text-gray-800">Saving...</span>
                </div>
                <p className="text-sm text-gray-600">Please wait while we save your changes.</p>
            </div>
        </div>
    );
};

export default LoadingModal;
