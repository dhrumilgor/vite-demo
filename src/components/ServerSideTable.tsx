import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, FileDown } from 'lucide-react';

// Types
interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any, index?: number) => React.ReactNode;
  exportable?: boolean; // Flag to determine if this column should be exported
  isSerialNumber?: boolean; // Flag to identify serial number column
}

interface ServerSideTableProps {
  columns: Column[];
  apiUrl: string;
  itemsPerPageOptions?: number[];
  defaultItemsPerPage?: number;
  defaultSortField?: string;
  defaultSortDirection?: 'asc' | 'desc';
  searchFields?: string[];
  onDataFetched?: (data: any) => void;
  fileName?: string; // Default filename for export
}

const ServerSideTable: React.FC<ServerSideTableProps> = ({
  columns,
  apiUrl,
  itemsPerPageOptions = [10, 20, 30, 50],
  defaultItemsPerPage = 10,
  defaultSortField = '',
  defaultSortDirection = 'asc',
  searchFields = [],
  onDataFetched,
  fileName = 'table-data'
}) => {
  // State
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(defaultItemsPerPage);
  const [sortField, setSortField] = useState<string>(defaultSortField);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSortDirection);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState<boolean>(false);

  // Fetch data
  const fetchData = async (forExport = false, limit = itemsPerPage) => {
    if (!forExport) setLoading(true);
    if (forExport) setExportLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      params.append('skip', forExport ? '0' : ((currentPage - 1) * itemsPerPage).toString());
      
      if (sortField) {
        params.append('sortBy', sortField);
        params.append('order', sortDirection);
      }
      
      if (searchQuery && searchFields.length > 0) {
        params.append('q', searchQuery);
      }

      // Make API request
      const response = await fetch(`${apiUrl}?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (forExport) {
        return result.users || [];
      } else {
        // Update state with fetched data
        setData(result.users || []);
        setTotalItems(result.total || 0);
        
        // Call the callback if provided
        if (onDataFetched) {
          onDataFetched(result);
        }
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      const errorMessage = 'Failed to fetch data. Please try again later.';
      setError(errorMessage);
      if (!forExport) {
        setData([]);
        setTotalItems(0);
      }
      return null;
    } finally {
      if (!forExport) setLoading(false);
      if (forExport) setExportLoading(false);
    }
  };

  // Effect to fetch data when dependencies change
  useEffect(() => {
    fetchData();
  }, [currentPage, itemsPerPage, sortField, sortDirection, searchQuery]);

  // Handle sorting
  const handleSort = (key: string) => {
    // Skip sorting for serial number column
    if (columns.find(col => col.key === key)?.isSerialNumber) return;
    
    if (sortField === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(key);
      setSortDirection('asc');
    }
    setCurrentPage(1); // Reset to first page on sort change
  };

  // Handle search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on search change
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Generate pagination items
  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  // Get nested object values
  const getNestedValue = (obj: any, path: string) => {
    if (!path) return null;
    const keys = path.split('.');
    return keys.reduce((acc, key) => {
      return acc && acc[key] !== undefined ? acc[key] : null;
    }, obj);
  };

  // Export data to Excel
  const exportToExcel = async () => {
    try {
      // Fetch all data for export
      const exportData = await fetchData(true, Math.min(totalItems, 1000)); // Limit to 1000 records for export
      if (!exportData) return;

      // Create a CSV string
      const exportableColumns = columns.filter(col => col.exportable !== false);
      
      // Add header row
      let csvContent = exportableColumns.map(col => `"${col.label}"`).join(',') + '\n';
      
      // Add data rows
      exportData.forEach((row: any, index: number) => {
        const rowData = exportableColumns.map(col => {
          // Handle serial number specially
          if (col.isSerialNumber) {
            return `"${index + 1}"`;
          }
          
          const value = getNestedValue(row, col.key);
          // Escape double quotes and wrap in quotes
          return `"${value !== null && value !== undefined ? String(value).replace(/"/g, '""') : ''}"`;
        });
        csvContent += rowData.join(',') + '\n';
      });
      
      // Create a Blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${fileName}-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Export error:', e);
      setError('Failed to export data. Please try again later.');
    }
  };

  // Calculate the starting serial number based on current page
  const getStartingSerialNumber = () => {
    return (currentPage - 1) * itemsPerPage + 1;
  };

  return (
    <div className="w-full space-y-4">
      {/* Search, export, and items per page controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {searchFields.length > 0 && (
          <div className="relative w-full sm:w-64">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full"
            />
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportToExcel}
            disabled={exportLoading || !data.length}
            className="flex items-center gap-1"
          >
            <FileDown className="h-4 w-4" />
            {exportLoading ? 'Exporting...' : 'Export CSV'}
          </Button>
          
          <span className="text-sm">Items per page:</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => {
              setItemsPerPage(Number(value));
              setCurrentPage(1); // Reset to first page
            }}
          >
            <SelectTrigger className="w-16">
              <SelectValue placeholder={itemsPerPage.toString()} />
            </SelectTrigger>
            <SelectContent>
              {itemsPerPageOptions.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchData()}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className="whitespace-nowrap">
                  {column.sortable && !column.isSerialNumber ? (
                    <button
                      className="flex items-center space-x-1"
                      onClick={() => handleSort(column.key)}
                    >
                      <span>{column.label}</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && !data.length ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8">
                  Loading data...
                </TableCell>
              </TableRow>
            ) : !data.length ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8">
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow key={row.id || rowIndex}>
                  {columns.map((column) => (
                    <TableCell key={`${rowIndex}-${column.key}`}>
                      {column.isSerialNumber ? (
                        getStartingSerialNumber() + rowIndex
                      ) : column.render ? (
                        column.render(getNestedValue(row, column.key), row, rowIndex)
                      ) : (
                        typeof getNestedValue(row, column.key) === 'object' 
                          ? JSON.stringify(getNestedValue(row, column.key)) 
                          : getNestedValue(row, column.key)
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            
            {getPaginationItems()}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      
      {/* Table info */}
      <div className="text-sm text-gray-500">
        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
      </div>
    </div>
  );
};

export default ServerSideTable;