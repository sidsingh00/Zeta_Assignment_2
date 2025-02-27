export const getCellId = (row: number, col: number): string => {
  return `${row}:${col}`;
};

export const getCellPosition = (cellId: string): [number, number] => {
  const [row, col] = cellId.split(':').map(Number);
  return [row, col];
};

export const getColumnLabel = (col: number): string => {
  let label = '';
  let c = col;
  
  while (c >= 0) {
    label = String.fromCharCode(65 + (c % 26)) + label;
    c = Math.floor(c / 26) - 1;
  }
  
  return label;
};

export const getRowLabel = (row: number): string => {
  return (row + 1).toString();
};

export const getCellLabel = (row: number, col: number): string => {
  return `${getColumnLabel(col)}${getRowLabel(row)}`;
};

export const parseCellLabel = (label: string): [number, number] | null => {
  const match = label.match(/^([A-Z]+)(\d+)$/);
  if (!match) return null;
  
  const [, colStr, rowStr] = match;
  const row = parseInt(rowStr, 10) - 1;
  
  let col = 0;
  for (let i = 0; i < colStr.length; i++) {
    col = col * 26 + (colStr.charCodeAt(i) - 64);
  }
  col -= 1;
  
  return [row, col];
};

export const getCellRange = (start: string, end: string): [number, number, number, number] | null => {
  const startPos = parseCellLabel(start);
  const endPos = parseCellLabel(end);
  
  if (!startPos || !endPos) return null;
  
  const [startRow, startCol] = startPos;
  const [endRow, endCol] = endPos;
  
  return [
    Math.min(startRow, endRow),
    Math.min(startCol, endCol),
    Math.max(startRow, endRow),
    Math.max(startCol, endCol)
  ];
};