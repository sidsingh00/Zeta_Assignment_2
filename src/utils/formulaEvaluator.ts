import { SheetData } from '../types';
import { getCellId, getCellLabel, getCellRange, parseCellLabel } from './cellUtils';

// Helper to get numeric value from a cell
const getNumericValue = (cellValue: any): number => {
  if (cellValue === null || cellValue === '') return 0;
  if (typeof cellValue === 'number') return cellValue;
  const parsed = parseFloat(String(cellValue));
  return isNaN(parsed) ? 0 : parsed;
};

// Helper to get cell value from reference
const getCellValue = (ref: string, data: SheetData): any => {
  const pos = parseCellLabel(ref);
  if (!pos) throw new Error(`Invalid cell reference: ${ref}`);
  
  const [row, col] = pos;
  const cellId = getCellId(row, col);
  const cell = data[cellId];
  
  if (!cell) return null;
  return cell.value;
};

// Helper to get range of cells
const getCellsInRange = (range: string, data: SheetData): any[] => {
  const [start, end] = range.split(':');
  const rangeCoords = getCellRange(start, end);
  
  if (!rangeCoords) throw new Error(`Invalid range: ${range}`);
  
  const [startRow, startCol, endRow, endCol] = rangeCoords;
  const cells = [];
  
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      const cellId = getCellId(row, col);
      const cell = data[cellId];
      cells.push(cell?.value ?? null);
    }
  }
  
  return cells;
};

// Mathematical functions
const functions = {
  SUM: (args: string[], data: SheetData): number => {
    let sum = 0;
    
    for (const arg of args) {
      if (arg.includes(':')) {
        // Range of cells
        const values = getCellsInRange(arg, data);
        for (const value of values) {
          sum += getNumericValue(value);
        }
      } else {
        // Single cell
        sum += getNumericValue(getCellValue(arg, data));
      }
    }
    
    return sum;
  },
  
  AVERAGE: (args: string[], data: SheetData): number => {
    let sum = 0;
    let count = 0;
    
    for (const arg of args) {
      if (arg.includes(':')) {
        // Range of cells
        const values = getCellsInRange(arg, data);
        for (const value of values) {
          if (value !== null && value !== '') {
            sum += getNumericValue(value);
            count++;
          }
        }
      } else {
        // Single cell
        const value = getCellValue(arg, data);
        if (value !== null && value !== '') {
          sum += getNumericValue(value);
          count++;
        }
      }
    }
    
    return count > 0 ? sum / count : 0;
  },
  
  MAX: (args: string[], data: SheetData): number => {
    let max = Number.NEGATIVE_INFINITY;
    let hasValue = false;
    
    for (const arg of args) {
      if (arg.includes(':')) {
        // Range of cells
        const values = getCellsInRange(arg, data);
        for (const value of values) {
          if (value !== null && value !== '') {
            const num = getNumericValue(value);
            max = Math.max(max, num);
            hasValue = true;
          }
        }
      } else {
        // Single cell
        const value = getCellValue(arg, data);
        if (value !== null && value !== '') {
          const num = getNumericValue(value);
          max = Math.max(max, num);
          hasValue = true;
        }
      }
    }
    
    return hasValue ? max : 0;
  },
  
  MIN: (args: string[], data: SheetData): number => {
    let min = Number.POSITIVE_INFINITY;
    let hasValue = false;
    
    for (const arg of args) {
      if (arg.includes(':')) {
        // Range of cells
        const values = getCellsInRange(arg, data);
        for (const value of values) {
          if (value !== null && value !== '') {
            const num = getNumericValue(value);
            min = Math.min(min, num);
            hasValue = true;
          }
        }
      } else {
        // Single cell
        const value = getCellValue(arg, data);
        if (value !== null && value !== '') {
          const num = getNumericValue(value);
          min = Math.min(min, num);
          hasValue = true;
        }
      }
    }
    
    return hasValue ? min : 0;
  },
  
  COUNT: (args: string[], data: SheetData): number => {
    let count = 0;
    
    for (const arg of args) {
      if (arg.includes(':')) {
        // Range of cells
        const values = getCellsInRange(arg, data);
        for (const value of values) {
          if (value !== null && value !== '' && !isNaN(getNumericValue(value))) {
            count++;
          }
        }
      } else {
        // Single cell
        const value = getCellValue(arg, data);
        if (value !== null && value !== '' && !isNaN(getNumericValue(value))) {
          count++;
        }
      }
    }
    
    return count;
  },
  
  // Data quality functions
  TRIM: (args: string[], data: SheetData): string => {
    if (args.length !== 1) throw new Error('TRIM requires exactly one argument');
    
    const value = args[0].startsWith('=') 
      ? getCellValue(args[0], data) 
      : args[0].replace(/^["'](.*)["']$/, '$1');
    
    return typeof value === 'string' ? value.trim() : String(value).trim();
  },
  
  UPPER: (args: string[], data: SheetData): string => {
    if (args.length !== 1) throw new Error('UPPER requires exactly one argument');
    
    const value = args[0].startsWith('=') 
      ? getCellValue(args[0], data) 
      : args[0].replace(/^["'](.*)["']$/, '$1');
    
    return typeof value === 'string' ? value.toUpperCase() : String(value).toUpperCase();
  },
  
  LOWER: (args: string[], data: SheetData): string => {
    if (args.length !== 1) throw new Error('LOWER requires exactly one argument');
    
    const value = args[0].startsWith('=') 
      ? getCellValue(args[0], data) 
      : args[0].replace(/^["'](.*)["']$/, '$1');
    
    return typeof value === 'string' ? value.toLowerCase() : String(value).toLowerCase();
  }
};

// Parse and evaluate a formula
export const evaluateFormula = (formula: string, data: SheetData): any => {
  // Check for function calls
  const functionMatch = formula.match(/^(\w+)\((.*)\)$/);
  
  if (functionMatch) {
    const [, funcName, argsStr] = functionMatch;
    const func = functions[funcName as keyof typeof functions];
    
    if (!func) throw new Error(`Unknown function: ${funcName}`);
    
    // Parse arguments
    const args: string[] = [];
    let currentArg = '';
    let inQuotes = false;
    let parenDepth = 0;
    
    for (let i = 0; i < argsStr.length; i++) {
      const char = argsStr[i];
      
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
        currentArg += char;
      } else if (char === '(' && !inQuotes) {
        parenDepth++;
        currentArg += char;
      } else if (char === ')' && !inQuotes) {
        parenDepth--;
        currentArg += char;
      } else if (char === ',' && !inQuotes && parenDepth === 0) {
        args.push(currentArg.trim());
        currentArg = '';
      } else {
        currentArg += char;
      }
    }
    
    if (currentArg.trim()) {
      args.push(currentArg.trim());
    }
    
    return func(args, data);
  }
  
  // Check for cell references
  if (/^[A-Z]+\d+$/.test(formula)) {
    return getCellValue(formula, data);
  }
  
  // Check for basic arithmetic
  try {
    // Replace cell references with their values
    const withValues = formula.replace(/[A-Z]+\d+/g, (match) => {
      const value = getCellValue(match, data);
      return value === null ? '0' : String(value);
    });
    
    // Evaluate the expression
    // eslint-disable-next-line no-eval
    return eval(withValues);
  } catch (error) {
    throw new Error(`Invalid formula: ${formula}`);
  }
};