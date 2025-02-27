import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Cell, CellStyle, CellValue, Selection, SheetData, SheetDimensions, ToolbarState } from '../types';
import { evaluateFormula } from '../utils/formulaEvaluator';
import { getCellId, getCellPosition } from '../utils/cellUtils';

interface SheetState {
  data: SheetData;
  dimensions: SheetDimensions;
  selection: Selection | null;
  activeCell: string | null;
  editingCell: string | null;
  formulaBarValue: string;
  toolbar: ToolbarState;
  history: SheetData[];
  historyIndex: number;
  
  // Actions
  initializeSheet: (rows: number, cols: number) => void;
  updateCellValue: (cellId: string, value: CellValue, formula?: string) => void;
  updateCellStyle: (cellId: string, style: Partial<CellStyle>) => void;
  setSelection: (selection: Selection | null) => void;
  setActiveCell: (cellId: string | null) => void;
  setEditingCell: (cellId: string | null) => void;
  setFormulaBarValue: (value: string) => void;
  updateToolbar: (updates: Partial<ToolbarState>) => void;
  addRow: (afterRow: number) => void;
  addColumn: (afterCol: number) => void;
  deleteRow: (row: number) => void;
  deleteColumn: (col: number) => void;
  resizeRow: (row: number, height: number) => void;
  resizeColumn: (col: number, width: number) => void;
  undo: () => void;
  redo: () => void;
  applyToolbarToSelection: () => void;
  findAndReplace: (find: string, replace: string, range?: Selection) => void;
  removeDuplicates: (range: Selection) => void;
}

const DEFAULT_ROWS = 100;
const DEFAULT_COLS = 26;

const DEFAULT_TOOLBAR_STATE: ToolbarState = {
  bold: false,
  italic: false,
  fontSize: 12,
  color: '#000000',
  backgroundColor: '#ffffff',
  textAlign: 'left',
};

const createEmptyCell = (row: number, col: number): Cell => {
  const id = getCellId(row, col);
  return {
    id,
    value: null,
    formula: '',
    display: '',
    style: { ...DEFAULT_TOOLBAR_STATE },
  };
};

export const useSheetStore = create<SheetState>()(
  immer((set, get) => ({
    data: {},
    dimensions: { rows: 0, cols: 0 },
    selection: null,
    activeCell: null,
    editingCell: null,
    formulaBarValue: '',
    toolbar: { ...DEFAULT_TOOLBAR_STATE },
    history: [],
    historyIndex: -1,

    initializeSheet: (rows = DEFAULT_ROWS, cols = DEFAULT_COLS) => {
      const initialData: SheetData = {};
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const cell = createEmptyCell(row, col);
          initialData[cell.id] = cell;
        }
      }
      
      set(state => {
        state.data = initialData;
        state.dimensions = { rows, cols };
        state.history = [initialData];
        state.historyIndex = 0;
      });
    },

    updateCellValue: (cellId: string, value: CellValue, formula = '') => {
      set(state => {
        // Save current state to history
        if (state.historyIndex < state.history.length - 1) {
          state.history = state.history.slice(0, state.historyIndex + 1);
        }
        state.history.push(JSON.parse(JSON.stringify(state.data)));
        state.historyIndex = state.history.length - 1;
        
        // Update the cell
        const cell = state.data[cellId] || createEmptyCell(...getCellPosition(cellId));
        cell.value = value;
        cell.formula = formula;
        
        // If it's a formula, evaluate it
        if (formula.startsWith('=')) {
          try {
            const result = evaluateFormula(formula.substring(1), state.data);
            cell.value = result;
            cell.display = String(result);
          } catch (error) {
            cell.display = '#ERROR';
          }
        } else {
          cell.display = value !== null ? String(value) : '';
        }
        
        state.data[cellId] = cell;
        
        // Update formula bar if this is the active cell
        if (state.activeCell === cellId) {
          state.formulaBarValue = formula || (value !== null ? String(value) : '');
        }
      });
    },

    updateCellStyle: (cellId: string, style: Partial<CellStyle>) => {
      set(state => {
        const cell = state.data[cellId];
        if (cell) {
          cell.style = { ...cell.style, ...style };
        }
      });
    },

    setSelection: (selection: Selection | null) => {
      set(state => {
        state.selection = selection;
        if (selection) {
          const activeCellId = getCellId(selection.active.row, selection.active.col);
          state.activeCell = activeCellId;
          const activeCell = state.data[activeCellId];
          if (activeCell) {
            state.formulaBarValue = activeCell.formula || (activeCell.value !== null ? String(activeCell.value) : '');
            state.toolbar = { ...activeCell.style } as ToolbarState;
          }
        }
      });
    },

    setActiveCell: (cellId: string | null) => {
      set(state => {
        state.activeCell = cellId;
        if (cellId) {
          const cell = state.data[cellId];
          if (cell) {
            state.formulaBarValue = cell.formula || (cell.value !== null ? String(cell.value) : '');
            state.toolbar = { ...cell.style } as ToolbarState;
          }
        }
      });
    },

    setEditingCell: (cellId: string | null) => {
      set(state => {
        state.editingCell = cellId;
      });
    },

    setFormulaBarValue: (value: string) => {
      set(state => {
        state.formulaBarValue = value;
        if (state.activeCell) {
          state.updateCellValue(state.activeCell, value.startsWith('=') ? null : value, value.startsWith('=') ? value : '');
        }
      });
    },

    updateToolbar: (updates: Partial<ToolbarState>) => {
      set(state => {
        state.toolbar = { ...state.toolbar, ...updates };
      });
    },

    addRow: (afterRow: number) => {
      set(state => {
        // Save current state to history
        if (state.historyIndex < state.history.length - 1) {
          state.history = state.history.slice(0, state.historyIndex + 1);
        }
        state.history.push(JSON.parse(JSON.stringify(state.data)));
        state.historyIndex = state.history.length - 1;
        
        // Shift all rows below down by 1
        const newData: SheetData = {};
        const { rows, cols } = state.dimensions;
        
        // Copy rows above the insertion point
        for (let row = 0; row <= afterRow; row++) {
          for (let col = 0; col < cols; col++) {
            const cellId = getCellId(row, col);
            if (state.data[cellId]) {
              newData[cellId] = state.data[cellId];
            }
          }
        }
        
        // Add the new row
        for (let col = 0; col < cols; col++) {
          const newCell = createEmptyCell(afterRow + 1, col);
          newData[newCell.id] = newCell;
        }
        
        // Copy rows below the insertion point with shifted indices
        for (let row = afterRow + 1; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const oldCellId = getCellId(row, col);
            const newCellId = getCellId(row + 1, col);
            if (state.data[oldCellId]) {
              newData[newCellId] = {
                ...state.data[oldCellId],
                id: newCellId
              };
            }
          }
        }
        
        state.data = newData;
        state.dimensions.rows += 1;
      });
    },

    addColumn: (afterCol: number) => {
      set(state => {
        // Save current state to history
        if (state.historyIndex < state.history.length - 1) {
          state.history = state.history.slice(0, state.historyIndex + 1);
        }
        state.history.push(JSON.parse(JSON.stringify(state.data)));
        state.historyIndex = state.history.length - 1;
        
        // Shift all columns to the right by 1
        const newData: SheetData = {};
        const { rows, cols } = state.dimensions;
        
        // Copy columns to the left of the insertion point
        for (let row = 0; row < rows; row++) {
          for (let col = 0; col <= afterCol; col++) {
            const cellId = getCellId(row, col);
            if (state.data[cellId]) {
              newData[cellId] = state.data[cellId];
            }
          }
        }
        
        // Add the new column
        for (let row = 0; row < rows; row++) {
          const newCell = createEmptyCell(row, afterCol + 1);
          newData[newCell.id] = newCell;
        }
        
        // Copy columns to the right of the insertion point with shifted indices
        for (let row = 0; row < rows; row++) {
          for (let col = afterCol + 1; col < cols; col++) {
            const oldCellId = getCellId(row, col);
            const newCellId = getCellId(row, col + 1);
            if (state.data[oldCellId]) {
              newData[newCellId] = {
                ...state.data[oldCellId],
                id: newCellId
              };
            }
          }
        }
        
        state.data = newData;
        state.dimensions.cols += 1;
      });
    },

    deleteRow: (row: number) => {
      set(state => {
        // Save current state to history
        if (state.historyIndex < state.history.length - 1) {
          state.history = state.history.slice(0, state.historyIndex + 1);
        }
        state.history.push(JSON.parse(JSON.stringify(state.data)));
        state.historyIndex = state.history.length - 1;
        
        // Shift all rows below up by 1
        const newData: SheetData = {};
        const { rows, cols } = state.dimensions;
        
        // Copy rows above the deletion point
        for (let r = 0; r < row; r++) {
          for (let col = 0; col < cols; col++) {
            const cellId = getCellId(r, col);
            if (state.data[cellId]) {
              newData[cellId] = state.data[cellId];
            }
          }
        }
        
        // Copy rows below the deletion point with shifted indices
        for (let r = row + 1; r < rows; r++) {
          for (let col = 0; col < cols; col++) {
            const oldCellId = getCellId(r, col);
            const newCellId = getCellId(r - 1, col);
            if (state.data[oldCellId]) {
              newData[newCellId] = {
                ...state.data[oldCellId],
                id: newCellId
              };
            }
          }
        }
        
        state.data = newData;
        state.dimensions.rows -= 1;
      });
    },

    deleteColumn: (col: number) => {
      set(state => {
        // Save current state to history
        if (state.historyIndex < state.history.length - 1) {
          state.history = state.history.slice(0, state.historyIndex + 1);
        }
        state.history.push(JSON.parse(JSON.stringify(state.data)));
        state.historyIndex = state.history.length - 1;
        
        // Shift all columns to the right by 1
        const newData: SheetData = {};
        const { rows, cols } = state.dimensions;
        
        // Copy columns to the left of the deletion point
        for (let row = 0; row < rows; row++) {
          for (let c = 0; c < col; c++) {
            const cellId = getCellId(row, c);
            if (state.data[cellId]) {
              newData[cellId] = state.data[cellId];
            }
          }
        }
        
        // Copy columns to the right of the deletion point with shifted indices
        for (let row = 0; row < rows; row++) {
          for (let c = col + 1; c < cols; c++) {
            const oldCellId = getCellId(row, c);
            const newCellId = getCellId(row, c - 1);
            if (state.data[oldCellId]) {
              newData[newCellId] = {
                ...state.data[oldCellId],
                id: newCellId
              };
            }
          }
        }
        
        state.data = newData;
        state.dimensions.cols -= 1;
      });
    },

    resizeRow: (row: number, height: number) => {
      // This would be implemented with a separate rowHeights state
      // For simplicity, we're not implementing this in the current version
    },

    resizeColumn: (col: number, width: number) => {
      // This would be implemented with a separate columnWidths state
      // For simplicity, we're not implementing this in the current version
    },

    undo: () => {
      set(state => {
        if (state.historyIndex > 0) {
          state.historyIndex -= 1;
          state.data = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
        }
      });
    },

    redo: () => {
      set(state => {
        if (state.historyIndex < state.history.length - 1) {
          state.historyIndex += 1;
          state.data = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
        }
      });
    },

    applyToolbarToSelection: () => {
      set(state => {
        if (state.selection) {
          const { start, end } = state.selection;
          const minRow = Math.min(start.row, end.row);
          const maxRow = Math.max(start.row, end.row);
          const minCol = Math.min(start.col, end.col);
          const maxCol = Math.max(start.col, end.col);
          
          for (let row = minRow; row <= maxRow; row++) {
            for (let col = minCol; col <= maxCol; col++) {
              const cellId = getCellId(row, col);
              const cell = state.data[cellId] || createEmptyCell(row, col);
              cell.style = { ...cell.style, ...state.toolbar };
              state.data[cellId] = cell;
            }
          }
        } else if (state.activeCell) {
          const cell = state.data[state.activeCell];
          if (cell) {
            cell.style = { ...cell.style, ...state.toolbar };
          }
        }
      });
    },

    findAndReplace: (find: string, replace: string, range?: Selection) => {
      set(state => {
        // Save current state to history
        if (state.historyIndex < state.history.length - 1) {
          state.history = state.history.slice(0, state.historyIndex + 1);
        }
        state.history.push(JSON.parse(JSON.stringify(state.data)));
        state.historyIndex = state.history.length - 1;
        
        // Determine the range to search
        let minRow = 0;
        let maxRow = state.dimensions.rows - 1;
        let minCol = 0;
        let maxCol = state.dimensions.cols - 1;
        
        if (range) {
          minRow = Math.min(range.start.row, range.end.row);
          maxRow = Math.max(range.start.row, range.end.row);
          minCol = Math.min(range.start.col, range.end.col);
          maxCol = Math.max(range.start.col, range.end.col);
        }
        
        // Perform find and replace
        for (let row = minRow; row <= maxRow; row++) {
          for (let col = minCol; col <= maxCol; col++) {
            const cellId = getCellId(row, col);
            const cell = state.data[cellId];
            
            if (cell && cell.value !== null && typeof cell.value === 'string') {
              const newValue = cell.value.replace(new RegExp(find, 'g'), replace);
              if (newValue !== cell.value) {
                cell.value = newValue;
                cell.display = newValue;
              }
            }
            
            if (cell && cell.formula) {
              const newFormula = cell.formula.replace(new RegExp(find, 'g'), replace);
              if (newFormula !== cell.formula) {
                cell.formula = newFormula;
                // Re-evaluate formula if needed
                if (newFormula.startsWith('=')) {
                  try {
                    const result = evaluateFormula(newFormula.substring(1), state.data);
                    cell.value = result;
                    cell.display = String(result);
                  } catch (error) {
                    cell.display = '#ERROR';
                  }
                }
              }
            }
          }
        }
      });
    },

    removeDuplicates: (range: Selection) => {
      set(state => {
        // Save current state to history
        if (state.historyIndex < state.history.length - 1) {
          state.history = state.history.slice(0, state.historyIndex + 1);
        }
        state.history.push(JSON.parse(JSON.stringify(state.data)));
        state.historyIndex = state.history.length - 1;
        
        const minRow = Math.min(range.start.row, range.end.row);
        const maxRow = Math.max(range.start.row, range.end.row);
        const minCol = Math.min(range.start.col, range.end.col);
        const maxCol = Math.max(range.start.col, range.end.col);
        
        // Extract rows from the range
        const rows: string[][] = [];
        for (let row = minRow; row <= maxRow; row++) {
          const rowData: string[] = [];
          for (let col = minCol; col <= maxCol; col++) {
            const cellId = getCellId(row, col);
            const cell = state.data[cellId];
            rowData.push(cell?.display || '');
          }
          rows.push(rowData);
        }
        
        // Find unique rows
        const uniqueRows: string[][] = [];
        const seen = new Set<string>();
        
        for (const row of rows) {
          const rowStr = JSON.stringify(row);
          if (!seen.has(rowStr)) {
            seen.add(rowStr);
            uniqueRows.push(row);
          }
        }
        
        // Clear the range
        for (let row = minRow; row <= maxRow; row++) {
          for (let col = minCol; col <= maxCol; col++) {
            const cellId = getCellId(row, col);
            if (state.data[cellId]) {
              state.data[cellId].value = null;
              state.data[cellId].formula = '';
              state.data[cellId].display = '';
            }
          }
        }
        
        // Fill with unique rows
        for (let i = 0; i < uniqueRows.length; i++) {
          const row = minRow + i;
          for (let j = 0; j < uniqueRows[i].length; j++) {
            const col = minCol + j;
            const cellId = getCellId(row, col);
            const value = uniqueRows[i][j];
            
            if (!state.data[cellId]) {
              state.data[cellId] = createEmptyCell(row, col);
            }
            
            state.data[cellId].value = value;
            state.data[cellId].display = value;
          }
        }
      });
    }
  }))
);