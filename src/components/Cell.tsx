import React, { useEffect, useRef, useState } from 'react';
import { useSheetStore } from '../store/useSheetStore';
import { getCellId } from '../utils/cellUtils';
import classNames from 'classnames';

interface CellProps {
  row: number;
  col: number;
}

const Cell: React.FC<CellProps> = ({ row, col }) => {
  const cellId = getCellId(row, col);
  const { 
    data, 
    selection, 
    activeCell, 
    editingCell,
    setSelection, 
    setActiveCell, 
    setEditingCell,
    updateCellValue
  } = useSheetStore();
  
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const cell = data[cellId] || { id: cellId, value: null, formula: '', display: '', style: {} };
  
  // Determine if this cell is selected
  const isSelected = selection && 
    row >= Math.min(selection.start.row, selection.end.row) && 
    row <= Math.max(selection.start.row, selection.end.row) && 
    col >= Math.min(selection.start.col, selection.end.col) && 
    col <= Math.max(selection.start.col, selection.end.col);
  
  const isActive = activeCell === cellId;
  const isEditing = editingCell === cellId;
  
  // Handle click to select cell
  const handleClick = (e: React.MouseEvent) => {
    if (e.shiftKey && activeCell) {
      // Extend selection
      const [activeRow, activeCol] = activeCell.split(':').map(Number);
      setSelection({
        start: { row: activeRow, col: activeCol },
        end: { row, col },
        active: { row, col }
      });
    } else {
      // New selection
      setSelection({
        start: { row, col },
        end: { row, col },
        active: { row, col }
      });
      setActiveCell(cellId);
    }
  };
  
  // Handle double click to edit cell
  const handleDoubleClick = () => {
    setEditingCell(cellId);
    setEditValue(cell.formula || (cell.value !== null ? String(cell.value) : ''));
  };
  
  // Handle key press in edit mode
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      finishEditing();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };
  
  // Handle input change in edit mode
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };
  
  // Finish editing and update cell value
  const finishEditing = () => {
    updateCellValue(cellId, editValue.startsWith('=') ? null : editValue, editValue.startsWith('=') ? editValue : '');
    setEditingCell(null);
  };
  
  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  
  // Apply cell styles
  const cellStyle = {
    fontWeight: cell.style.bold ? 'bold' : 'normal',
    fontStyle: cell.style.italic ? 'italic' : 'normal',
    fontSize: `${cell.style.fontSize || 12}px`,
    color: cell.style.color || '#000000',
    backgroundColor: cell.style.backgroundColor || '#ffffff',
    textAlign: cell.style.textAlign || 'left',
  };
  
  return (
    <div
      className={classNames(
        'border-r border-b border-gray-300 relative',
        {
          'bg-blue-100': isSelected && !isActive,
          'bg-blue-200': isActive,
          'outline outline-2 outline-blue-500': isActive
        }
      )}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      style={cellStyle}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={finishEditing}
          className="absolute inset-0 w-full h-full px-1 border-none outline-none"
        />
      ) : (
        <div className="px-1 py-0.5 w-full h-full overflow-hidden text-ellipsis whitespace-nowrap">
          {cell.display}
        </div>
      )}
    </div>
  );
};

export default React.memo(Cell);