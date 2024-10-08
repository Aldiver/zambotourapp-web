import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { userColumns, destinationColumns, menuColumns, itineraryColumns } from '../columnConfig';
import ActionButtons from './ActionButtons';
import { deleteDocument, deleteUserFunction } from '../firebase/helpers';
import ConfirmModal from './ConfirmModal';
import { useNavigate } from 'react-router-dom';

interface DataTableProps {
  collectionName: string;
}

const DataTable: React.FC<DataTableProps> = ({ collectionName }) => {
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string>("");
  const columnsConfig: { [key: string]: any[] } = {
    users: userColumns,
    destinations: destinationColumns,
    menus: menuColumns,
    itineraries: itineraryColumns,
  };

  const columns = columnsConfig[collectionName];
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchData();
  }, [collectionName]);

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const docsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setData(docsData);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleView = (id: string) => {
    navigate(`/${collectionName}/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/${collectionName}/edit/${id}`);
  };

  const handleDelete = () => {
    deleteDocument(collectionName, itemToDelete);
    if(collectionName === 'users'){
      deleteUserFunction(itemToDelete);
    }
    console.log('Delete item:', itemToDelete);
    setItemToDelete("");
    setIsModalOpen(false);
    setData((prevData) => prevData.filter(item => item.id !== itemToDelete));
    //remove item from data with setData where id === itemToDelete
  };

  const handleDeleteClick = (item: string) => {
    setItemToDelete(item);
    setIsModalOpen(true);
  };

  const paginatedData = data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <ConfirmModal isOpen={isModalOpen} onConfirm={handleDelete} onCancel={() => setIsModalOpen(false)} />
      <div className="rounded-lg border border-gray-200 flex-1 overflow-x-auto">
        <div className="w-full">
          <table className="divide-gray-200 bg-white text-sm">
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                    style={{ width: col.width }}
                  >
                    {col.label}
                  </th>
                ))}
                {collectionName !== 'users' && (
                  <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Action</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.map((item) => (
                <tr key={item.id}>
                  {columns.map((col) => (
                    <td key={col.key} className="whitespace-nowrap px-4 py-2 text-gray-700" onClick={() => handleView(item.id)}>
                      {col.key === 'locationCoords'
                        ? item[col.key]
                          ? `${item[col.key].latitude}, ${item[col.key].longitude}`
                          : ''
                        : col.key === 'coverImage'
                          ? <img src={item[col.key]} alt="Cover" className="h-16 w-16 object-cover" />
                          : Array.isArray(item[col.key])
                            ? item[col.key].map((i: any, index: number) => (
                              <div key={index}>{i.name ? `${i.name}: ${i.price}` : i}</div>
                            ))
                            : item[col.key]}
                    </td>
                  ))}
                  
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      <ActionButtons
                        onEdit={() => handleEdit(item.id)}
                        onDelete={() => handleDeleteClick(item.id)}
                      />
                    </td>
      
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-b-lg border-t border-gray-200 px-4 py-2">
          <ol className="flex justify-end gap-1 text-xs font-medium">
            {Array.from({ length: Math.ceil(data.length / itemsPerPage) }, (_, i) => i + 1).map((page) => (
              <li key={page}>
                <button
                  onClick={() => handlePageChange(page)}
                  className={`block size-8 rounded border ${currentPage === page
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-gray-100 bg-white text-gray-900'
                    } text-center leading-8`}
                >
                  {page}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
};

export default DataTable;
