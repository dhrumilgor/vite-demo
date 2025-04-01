import React, { useEffect, useState } from 'react';
import ServerSideTable from './ServerSideTable';
import useAuthStore from '../store/authStore';

const UserManagement: React.FC = () => {
  const { accessToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  // Use effect to handle token checking and loading state
  useEffect(() => {
    // When the token is available, stop loading
    if (accessToken) {
      setIsLoading(false);
    }
  }, [accessToken]);

  // Define columns for the user data
  const columns = [
    {
      key: 'srNo',
      label: 'Sr. No.',
      isSerialNumber: true,
      exportable: true
    },
    {
      key: 'firstName',
      label: 'First Name',
      sortable: true,
      exportable: true
    },
    {
      key: 'lastName',
      label: 'Last Name',
      sortable: true,
      exportable: true
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      exportable: true
    },
    {
      key: 'age',
      label: 'Age',
      sortable: true,
      exportable: true
    },
    {
      key: 'gender',
      label: 'Gender',
      sortable: true,
      exportable: true
    },
    {
      key: 'company.name',
      label: 'Company',
      sortable: true,
      exportable: true
    },
    {
      key: 'address.city',
      label: 'City',
      sortable: true,
      exportable: true
    },
    {
      key: 'address.state',
      label: 'State',
      sortable: true,
      exportable: true
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      exportable: true,
      render: (value: string) => (
        <span className={
          value === 'admin' 
            ? 'text-red-600 font-medium' 
            : value === 'moderator' 
              ? 'text-blue-600 font-medium' 
              : 'text-green-600'
        }>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      exportable: false, // Don't include actions in export
      render: (_: any, row: any) => (
        <div className="flex space-x-2">
          <button 
            className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            onClick={() => handleEdit(row.id)}
          >
            Edit
          </button>
          <button 
            className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  // Action handlers
  const handleEdit = (id: number) => {
    console.log(`Edit user with id: ${id}`);
    // Implement your edit logic here
  };

  const handleDelete = (id: number) => {
    console.log(`Delete user with id: ${id}`);
    // Implement your delete logic here
  };
  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading user data...</div>;
  }



  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      
      <ServerSideTable 
        columns={columns}
        apiUrl="https://dummyjson.com/users"
        defaultItemsPerPage={10}
        defaultSortField="lastName"
        defaultSortDirection="asc"
        searchFields={['firstName', 'lastName', 'email']}
        fileName="user-data" // Set the export filename
        onDataFetched={(data) => {
          console.log('Data fetched:', data);
        }}
      />
    </div>
  );
};

export default UserManagement;