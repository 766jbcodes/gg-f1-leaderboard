import React from 'react';
import { LoadingState } from './LoadingState';

interface DataTableProps {
  columns: string[];
  data: Array<Record<string, unknown>>;
  isLoading?: boolean;
  error?: string;
  winnerNames?: string[]; // Names of winners to highlight with cup emojis (handles ties)
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  isLoading,
  error,
  winnerNames = [],
}) => {
  if (isLoading) {
    return <LoadingState message="Loading data..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[16rem] bg-secondary/20 rounded-xl border border-destructive/10">
        <div className="text-center">
          <div className="text-destructive text-4xl mb-4">⚠️</div>
          <p className="text-navy font-bold mb-2">Error Loading Data</p>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-secondary/50">
          <tr>
            {columns.map((column, idx) => (
              <th
                key={column}
                className={`
                  px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider
                  ${idx === 0 ? 'pl-6' : ''}
                  ${idx === columns.length - 1 ? 'pr-6' : ''}
                `}
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-border">
          {data.map((row, rowIndex) => {
            const rowName = String(row['name'] ?? '');
            const isWinner = winnerNames.some(winnerName => 
              rowName.toLowerCase() === winnerName.toLowerCase()
            );
            
            return (
              <tr 
                key={rowIndex} 
                className={`
                  transition-colors duration-150 ease-in-out hover:bg-secondary/30
                  ${isWinner ? 'bg-yellow-50/50 hover:bg-yellow-100/40' : ''}
                `}
              >
                {columns.map((column, colIndex) => {
                  const columnKey = column.toLowerCase();
                  const cellValue = String(row[columnKey] ?? '');
                  const isNameColumn = columnKey === 'name';
                  
                  return (
                    <td 
                      key={column} 
                      className={`
                        px-4 py-3.5 whitespace-nowrap text-sm font-medium text-navy
                        ${colIndex === 0 ? 'pl-6 font-bold text-gray-400' : ''}
                        ${colIndex === columns.length - 1 ? 'pr-6 font-mono text-right' : ''}
                      `}
                    >
                      {isNameColumn && isWinner ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg filter drop-shadow-sm">🏆</span>
                          <span className="font-bold text-navy">
                            {cellValue}
                          </span>
                        </div>
                      ) : (
                        cellValue
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
