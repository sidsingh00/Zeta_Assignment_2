# Google Sheets Clone

This project is a web application that mimics the user interface and core functionalities of Google Sheets, with a focus on mathematical and data quality functions, data entry, and key UI interactions.

## Features

### Spreadsheet Interface
- Google Sheets-like UI with toolbar, formula bar, and cell structure
- Drag functionality for selections
- Cell dependencies with formula evaluation
- Support for basic cell formatting (bold, italics, font size, color)
- Ability to add, delete, and resize rows and columns

### Mathematical Functions
- SUM: Calculates the sum of a range of cells
- AVERAGE: Calculates the average of a range of cells
- MAX: Returns the maximum value from a range of cells
- MIN: Returns the minimum value from a range of cells
- COUNT: Counts the number of cells containing numerical values in a range

### Data Quality Functions
- TRIM: Removes leading and trailing whitespace from a cell
- UPPER: Converts the text in a cell to uppercase
- LOWER: Converts the text in a cell to lowercase
- REMOVE_DUPLICATES: Removes duplicate rows from a selected range
- FIND_AND_REPLACE: Allows users to find and replace specific text within a range of cells

### Data Entry and Validation
- Support for various data types (numbers, text, dates)
- Basic data validation for formulas

## Tech Stack and Data Structures

### Tech Stack
- **React**: For building the user interface
- **TypeScript**: For type safety and better developer experience
- **Zustand**: For state management
- **Immer**: For immutable state updates
- **Tailwind CSS**: For styling
- **Vite**: For fast development and building

### Data Structures

#### Cell Model
The core data structure is the `Cell` type, which represents a single cell in the spreadsheet:

```typescript
type Cell = {
  id: string;        // Unique identifier (row:col format)
  value: CellValue;  // The actual value (string, number, null)
  formula: string;   // Formula string if the cell contains a formula
  display: string;   // Formatted display value
  style: CellStyle;  // Styling information
};
```

#### Sheet Data
The sheet data is stored as an object map for O(1) access to any cell:

```typescript
type SheetData = {
  [key: string]: Cell;
};
```

This allows for efficient cell lookup by ID without having to traverse a 2D array.

#### Selection Model
The selection model tracks the current selection state:

```typescript
type Selection = {
  start: { row: number; col: number };  // Selection start
  end: { row: number; col: number };    // Selection end
  active: { row: number; col: number }; // Active cell within selection
};
```

### Formula Evaluation
Formulas are evaluated using a custom parser that:
1. Identifies function calls and their arguments
2. Resolves cell references to their values
3. Evaluates mathematical expressions
4. Handles ranges (e.g., A1:B5)

### Virtualization
The grid implements a simple virtualization technique to render only the visible cells, improving performance for large spreadsheets.

### Undo/Redo
The application maintains a history stack of sheet states to support undo and redo operations.

## Usage

### Basic Usage
- Click on a cell to select it
- Double-click to edit a cell
- Type a value or formula (starting with =)
- Use the formula bar to edit the current cell
- Use the toolbar to format cells

### Using Formulas
- Start with an equals sign (=)
- Examples:
  - `=SUM(A1:A5)` - Sum values in range A1 to A5
  - `=AVERAGE(B1:B10)` - Average values in range B1 to B10
  - `=MAX(C1:C20)` - Find maximum value in range C1 to C20
  - `=MIN(D1:D15)` - Find minimum value in range D1 to D15
  - `=COUNT(E1:E30)` - Count numeric values in range E1 to E30
  - `=TRIM(A1)` - Remove whitespace from cell A1
  - `=UPPER(B1)` - Convert cell B1 to uppercase
  - `=LOWER(C1)` - Convert cell C1 to lowercase

### Data Operations
- Select a range and use the "Remove Duplicates" button to remove duplicate rows
- Use "Find & Replace" to search and replace text in the selected range

## Development

### Running the Project
```bash
npm install
npm run dev
```

### Building for Production
```bash
npm run build
```