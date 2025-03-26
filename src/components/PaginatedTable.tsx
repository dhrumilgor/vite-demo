import React, { useState, useEffect } from 'react';

const PaginatedTable = () => {
  // State for managing pagination and data
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Fetch data from API with pagination
  const fetchData = async (page: number, size: number) => {
    setLoading(true);
    try {
      const response = await fetch(`https://dummyjson.com/users?page=${page}&size=${size}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();

      // Assuming the API returns an object with:
      // - items: array of data for current page
      // - totalPages: total number of pages
      setData(responseData.users);
      const totalPages = Math.ceil(responseData.total / responseData.limit);
      setTotalPages(totalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when page or page size changes
  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [currentPage, pageSize]);

  // Handle page change
  const handlePageChange = (newPage: React.SetStateAction<number>) => {
    setCurrentPage(newPage);
  };

  // Handle page size change
  const handlePageSizeChange = (newSize: React.SetStateAction<number>) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <div className="p-4">
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">ID</th>
                <th className="p-2 border">FName</th>
                <th className="p-2 border">LastName</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item:{id:string,firstName:string,lastName:string}) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{item.id}</td>
                  <td className="p-2 border">{item.firstName}</td>
                  <td className="p-2 border">{item.lastName}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            {/* Page Size Selector */}
            <select 
              value={pageSize} 
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="p-2 border rounded"
            >
              {[5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size} per page
                </option>
              ))}
            </select>

            {/* Pagination Controls */}
            <div className="flex space-x-2">
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
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PaginatedTable;