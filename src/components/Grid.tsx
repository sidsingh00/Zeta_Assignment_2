import React, { useEffect, useRef, useState } from 'react';
import { useSheetStore } from '../store/useSheetStore';
import Cell from './Cell';
import { getColumnLabel, getRowLabel } from '../utils/cellUtils';

const Grid: React.FC = () => {
  const { dimensions, initializeSheet } = useSheetStore();
  const [visibleRows, setVisibleRows] = useState({ start: 0, end: 50 });
  const [visibleCols, setVisibleCols] = useState({ start: 0, end: 20 });
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Initialize sheet on mount
  useEffect(() => {
    initializeSheet();
  }, [initializeSheet]);
  
  // Handle scroll to implement virtualization
  const handleScroll = () => {
    if (!gridRef.current) return;
    
    const { scrollTop, scrollLeft, clientHeight, clientWidth } = gridRef.current;
    
    // Assuming each cell is 30px high and 100px wide
    const rowHeight = 30;
    const colWidth = 100;
    
    const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - 5);
    const endRow = Math.min(dimensions.rows - 1, Math.ceil((scrollTop + clientHeight) / rowHeight) + 5);
    
    const startCol = Math.max(0, Math.floor(scrollLeft / colWidth) - 2);
    const endCol = Math.min(dimensions.cols - 1, Math.ceil((scrollLeft + clientWidth) / colWidth) + 2);
    
    setVisibleRows({ start: startRow, end: endRow });
    setVisibleCols({ start: startCol, end: endCol });
  };
  
  useEffect(() => {
    const grid = gridRef.current;
    if (grid) {
      grid.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial calculation
      
      return () => {
        grid.removeEventListener('scroll', handleScroll);
      };
    }
  }, [dimensions]);
  
  // Generate header cells (A, B, C, ...)
  const headerCells = [];
  for (let col = visibleCols.start; col <= visibleCols.end; col++) {
    headerCells.push(
      <div 
        key={`header-${col}`} 
        className="sticky top-0 z-10 bg-gray-100 border-r border-b border-gray-300 min-w-[100px] h-[30px] flex items-center justify-center font-semibold"
        style={{ left: col === 0 ? '30px' : 'auto' }}
      >
        {getColumnLabel(col)}
      </div>
    );
  }
  
  // Generate row headers (1, 2, 3, ...)
  const rowHeaders = [];
  for (let row = visibleRows.start; row <= visibleRows.end; row++) {
    rowHeaders.push(
      <div 
        key={`row-${row}`} 
        className="sticky left-0 z-10 bg-gray-100 border-r border-b border-gray-300 w-[30px] h-[30px] flex items-center justify-center font-semibold"
      >
        {getRowLabel(row)}
      </div>
    );
  }
  
  // Generate grid cells
  const gridCells = [];
  for (let row = visibleRows.start; row <= visibleRows.end; row++) {
    for (let col = visibleCols.start; col <= visibleCols.end; col++) {
      gridCells.push(
        <Cell key={`${row}:${col}`} row={row} col={col} />
      );
    }
  }
  
  return (
    <div 
      ref={gridRef}
      className="flex-1 overflow-auto"
      style={{ 
        display: 'grid',
        gridTemplateColumns: `30px repeat(${visibleCols.end - visibleCols.start + 1}, minmax(100px, 1fr))`,
        gridTemplateRows: `30px repeat(${visibleRows.end - visibleRows.start + 1}, 30px)`,
        height: 'calc(100vh - 120px)', // Adjust based on toolbar and formula bar height
      }}
    >
      {/* Top-left corner */}
      <div className="sticky top-0 left-0 z-20 bg-gray-200 border-r border-b border-gray-300 w-[30px] h-[30px]"></div>
      
      {/* Column headers */}
      {headerCells}
      
      {/* Row headers */}
      {rowHeaders}
      
      {/* Grid cells */}
      {gridCells}
    </div>
  );
};

export default Grid;