import React, { useState } from 'react';
import { 
  useReactTable, 
  getCoreRowModel, 
  flexRender,
  ColumnDef
} from '@tanstack/react-table';
import { 
  useQuery, 
  QueryClient, 
  QueryClientProvider 
} from '@tanstack/react-query';

// Define type for a user
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  gender: string;
  username: string;
}

// Define type for API response
interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

// Function to fetch users from API
const fetchUsers = async ({ 
  skip, 
  limit 
}: { 
  skip: number; 
  limit: number; 
}): Promise<UsersResponse> => {
  const response = await fetch(`https://dummyjson.com/users?skip=${skip}&limit=${limit}`);
  
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  
  return response.json();
};

// Create a client
const queryClient = new QueryClient();

const UserTable: React.FC = () => {
  // State for pagination using skip/limit
  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 30
  });

  // Fetch data using React Query
  const { 
    data, 
    isLoading, 
    isError, 
    error 
  } = useQuery<UsersResponse, Error>({
    queryKey: ['users', pagination],
    queryFn: () => fetchUsers(pagination),
    keepPreviousData: true
  });

  // Calculate total pages
  const totalPages = data 
    ? Math.ceil(data.total / pagination.limit) 
    : 0;

  // Current page calculation
  const currentPage = Math.floor(pagination.skip / pagination.limit) + 1;

  // Define columns for the table
  const columns = React.useMemo<ColumnDef<User>[]>(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: info => info.getValue<number>()
    },
    {
      accessorKey: 'firstName',
      header: 'First Name',
      cell: info => info.getValue<string>()
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
      cell: info => info.getValue<string>()
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: info => info.getValue<string>()
    },
    {
      accessorKey: 'age',
      header: 'Age',
      cell: info => info.getValue<number>()
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: info => info.getValue<string>()
    }
  ], []);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    const newSkip = (newPage - 1) * pagination.limit;
    setPagination(prev => ({
      ...prev,
      skip: newSkip
    }));
  };

  // Handle page size change
  const handlePageSizeChange = (newLimit: number) => {
    setPagination(prev => ({
      skip: 0, // Reset to first page
      limit: newLimit
    }));
  };

  // Render loading or error states
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            {columns.map(column => (
              <th 
                key={column.accessorKey as string} 
                className="p-2 border text-left"
              >
                {column.header as React.ReactNode}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.users.map(user => (
            <tr key={user.id} className="hover:bg-gray-50">
              {columns.map(column => (
                <td 
                  key={column.accessorKey as string} 
                  className="p-2 border"
                >
                  {column.cell({ getValue: () => user[column.accessorKey as keyof User] })}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2">
          {/* Page Size Selector */}
          <select
            value={pagination.limit}
            onChange={e => handlePageSizeChange(Number(e.target.value))}
            className="p-2 border rounded"
          >
            {[10, 30, 50, 100].map(limit => (
              <option key={limit} value={limit}>
                Show {limit}
              </option>
            ))}
          </select>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 border rounded ${
                  currentPage === index + 1 ? 'bg-blue-500 text-white' : ''
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrapper component to provide React Query context
const UserTableWrapper: React.FC = () => {
  return (
  
      <UserTable />
   
  );
};

export default UserTableWrapper;