import React, { useState } from 'react';

interface ConfirmModalProps {
    isOpen: boolean;
    onConfirm: (menuItem: { name: string; price: number }) => void;
    onCancel: () => void;
}

const MenuItemModal: React.FC<ConfirmModalProps> = ({ isOpen, onConfirm, onCancel }) => {
    const [menuItem, setMenuItem] = useState<{ name: string; price: number }>({ name: '', price: 0 });

    if (!isOpen) return null;

    const handleAddMenuItem = () => {
        onConfirm(menuItem);
        setMenuItem({ name: '', price: 0 });
    };

    return (
        <div className="fixed inset-0 flex z-50 items-center justify-center bg-black bg-opacity-50">
            <div className="rounded-lg bg-white p-8 shadow-2xl">
                <h2 className="text-lg font-bold">Add Menu Item</h2>
                <label className="block text-sm font-medium text-gray-700">Item Name</label>
                <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                    value={menuItem.name}
                    onChange={(e) => setMenuItem({ ...menuItem, name: e.target.value })}
                />

                <label className="block text-sm font-medium text-gray-700">Item Price</label>
                <input
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                    value={menuItem.price}
                    onChange={(e) => setMenuItem({ ...menuItem, price: parseFloat(e.target.value) })}
                />

                <div className="mt-4 flex gap-2">
                    <button
                        type="button"
                        className="rounded bg-green-50 px-4 py-2 text-sm font-medium text-green-600"
                        onClick={handleAddMenuItem}
                    >
                        Add Item
                    </button>
                    <button
                        type="button"
                        className="rounded bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MenuItemModal;
