import React from 'react';
import Icon from '@mdi/react';
import { mdiEye, mdiPencil, mdiDelete } from '@mdi/js';

const ActionButtons = ({ onView, onEdit, onDelete }) => {
    return (
        <div className="flex space-x-2">
            <button onClick={onView} className="text-blue-500 border-2 border-blue-500 hover:text-blue-700">
                <Icon path={mdiEye} size={1} />
            </button>
            <button onClick={onEdit} className="text-green-500 border-2 border-green-500 hover:text-green-700">
                <Icon path={mdiPencil} size={1} />
            </button>
            <button onClick={onDelete} className="text-red-500 border-2 border-red-500 hover:text-red-700">
                <Icon path={mdiDelete} size={1} />
            </button>
        </div>
    );
};

export default ActionButtons;
