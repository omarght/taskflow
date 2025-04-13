import React, { useState, useEffect } from 'react';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import Box from '@mui/material/Box';

interface TasksTableProps {
  rows: GridRowsProp;
  columns: GridColDef[];
  onRowClick?: (params: any) => void;
  onRowDoubleClick?: (params: any) => void;
}

const getColumnVisibility = () => {
  const width = window.innerWidth;
  return {
    description: width > 1000,
    start_date: width > 800,
    categoryTitle: width > 1100,
    projectTitle: width > 1200,
  };
};

const TasksTable: React.FC<TasksTableProps> = ({ rows, columns, onRowClick, onRowDoubleClick }) => {
  const [columnVisibilityModel, setColumnVisibilityModel] = useState(getColumnVisibility());

  useEffect(() => {
    const handleResize = () => setColumnVisibilityModel(getColumnVisibility());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine if it's mobile (e.g., screen width <= 768px)
  const isMobile = window.innerWidth <= 768;

  return (
    <Box sx={{ width: '100%', overflowX: 'auto' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        columnVisibilityModel={columnVisibilityModel}
        onRowClick={onRowClick}
        onRowDoubleClick={onRowDoubleClick}
        disableRowSelectionOnClick
        sx={{
          '& .MuiDataGrid-cell': {
            fontSize: isMobile ? '12px' : '14px', // Cell font size (unchanged)
          },
          '& .MuiDataGrid-columnHeaders': {
            fontSize: isMobile ? '12px' : '16px', // Smaller header font on mobile
          },
          '& .MuiDataGrid-footerContainer': {
            fontSize: isMobile ? '12px' : '14px', // Footer font size (unchanged)
          },
        }}
      />
    </Box>
  );
};

export default TasksTable;