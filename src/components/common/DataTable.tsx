import React from 'react';
import { LoadingState } from './LoadingState';

interface DataTableProps {
  columns: string[];
  data: Array<Record<string, unknown>>;
  isLoading?: boolean;
  error?: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return <LoadingState message="Loading data..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="text-red text-4xl mb-4">⚠️</div>
          <p className="text-navy font-bold mb-2">Error Loading Data</p>
          <p className="text-navy text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border-2 border-navy">
      <table className="min-w-full divide-y divide-lightgrey">
        <thead className="bg-navy">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                className="px-2 sm:px-3 py-1 sm:py-2 text-left font-extrabold text-white uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-lightgrey">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-silver">
              {columns.map((column) => (
                <td key={column} className="px-2 sm:px-3 py-1 sm:py-2 whitespace-nowrap text-navy">
                  {String(row[column.toLowerCase()] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 