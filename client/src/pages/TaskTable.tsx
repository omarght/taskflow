import React from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

interface TasksTableProps {
  rows: GridRowsProp;
  columns: GridColDef[];
  onRowClick?: (params: any) => void;
  onRowDoubleClick?: (params: any) => void;
}

const TasksTable: React.FC<TasksTableProps> = ({ rows, columns, onRowClick, onRowDoubleClick }) => {
  return (
    <Box>
      <DataGrid
        rows={rows}
        columns={columns}
        onRowClick={onRowClick}
        onRowDoubleClick={onRowDoubleClick}
      />
    </Box>
  );
};

export default TasksTable;
