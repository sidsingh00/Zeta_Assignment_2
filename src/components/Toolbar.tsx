import React from 'react';
import { useSheetStore } from '../store/useSheetStore';
import { 
  Bold, Italic, AlignLeft, AlignCenter, AlignRight, 
  Plus, Trash2, Undo, Redo, Search, FileDown, FileUp
} from 'lucide-react';
import classNames from 'classnames';

const Toolbar: React.FC = () => {
  const { 
    toolbar, 
    updateToolbar, 
    applyToolbarToSelection,
    selection,
    activeCell,
    undo,
    redo,
    addRow,
    addColumn,
    deleteRow,
    deleteColumn
  } = useSheetStore();
  
  const [findText, setFindText] = React.useState('');
  const [replaceText, setReplaceText] = React.useState('');
  const [showFindReplace, setShowFindReplace] = React.useState(false);
  
  const handleFindReplace = () => {
    if (findText && selection) {
      useSheetStore.getState().findAndReplace(findText, replaceText, selection);
      setShowFindReplace(false);
    }
  };
  
  const handleRemoveDuplicates = () => {
    if (selection) {
      useSheetStore.getState().removeDuplicates(selection);
    }
  };
  
  const handleAddRow = () => {
    if (selection) {
      addRow(selection.end.row);
    } else if (activeCell) {
      const [row] = activeCell.split(':').map(Number);
      addRow(row);
    }
  };
  
  const handleAddColumn = () => {
    if (selection) {
      addColumn(selection.end.col);
    } else if (activeCell) {
      const [, col] = activeCell.split(':').map(Number);
      addColumn(col);
    }
  };
  
  const handleDeleteRow = () => {
    if (selection) {
      deleteRow(selection.end.row);
    } else if (activeCell) {
      const [row] = activeCell.split(':').map(Number);
      deleteRow(row);
    }
  };
  
  const handleDeleteColumn = () => {
    if (selection) {
      deleteColumn(selection.end.col);
    } else if (activeCell) {
      const [, col] = activeCell.split(':').map(Number);
      deleteColumn(col);
    }
  };
  
  const toggleBold = () => {
    updateToolbar({ bold: !toolbar.bold });
    applyToolbarToSelection();
  };
  
  const toggleItalic = () => {
    updateToolbar({ italic: !toolbar.italic });
    applyToolbarToSelection();
  };
  
  const setTextAlign = (align: 'left' | 'center' | 'right') => {
    updateToolbar({ textAlign: align });
    applyToolbarToSelection();
  };
  
  const setFontSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateToolbar({ fontSize: parseInt(e.target.value, 10) });
    applyToolbarToSelection();
  };
  
  const setColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateToolbar({ color: e.target.value });
    applyToolbarToSelection();
  };
  
  const setBackgroundColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateToolbar({ backgroundColor: e.target.value });
    applyToolbarToSelection();
  };
  
  return (
    <div className="bg-gray-100 border-b border-gray-300 p-1 flex flex-wrap items-center gap-1">
      <div className="flex items-center space-x-1 mr-2">
        <button 
          className={classNames("p-1 rounded hover:bg-gray-200", { "bg-gray-300": toolbar.bold })}
          onClick={toggleBold}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button 
          className={classNames("p-1 rounded hover:bg-gray-200", { "bg-gray-300": toolbar.italic })}
          onClick={toggleItalic}
          title="Italic"
        >
          <Italic size={16} />
        </button>
      </div>
      
      <div className="flex items-center space-x-1 mr-2">
        <button 
          className={classNames("p-1 rounded hover:bg-gray-200", { "bg-gray-300": toolbar.textAlign === 'left' })}
          onClick={() => setTextAlign('left')}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </button>
        <button 
          className={classNames("p-1 rounded hover:bg-gray-200", { "bg-gray-300": toolbar.textAlign === 'center' })}
          onClick={() => setTextAlign('center')}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </button>
        <button 
          className={classNames("p-1 rounded hover:bg-gray-200", { "bg-gray-300": toolbar.textAlign === 'right' })}
          onClick={() => setTextAlign('right')}
          title="Align Right"
        >
          <AlignRight size={16} />
        </button>
      </div>
      
      <div className="flex items-center space-x-1 mr-2">
        <select 
          className="p-1 rounded border border-gray-300"
          value={toolbar.fontSize}
          onChange={setFontSize}
          title="Font Size"
        >
          {[8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72].map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>
      
      <div className="flex items-center space-x-1 mr-2">
        <input 
          type="color" 
          value={toolbar.color} 
          onChange={setColor}
          className="w-6 h-6 p-0 border-0"
          title="Text Color"
        />
        <input 
          type="color" 
          value={toolbar.backgroundColor} 
          onChange={setBackgroundColor}
          className="w-6 h-6 p-0 border-0"
          title="Background Color"
        />
      </div>
      
      <div className="border-l border-gray-300 h-6 mx-2"></div>
      
      <div className="flex items-center space-x-1 mr-2">
        <button 
          className="p-1 rounded hover:bg-gray-200"
          onClick={handleAddRow}
          title="Add Row"
        >
          <Plus size={16} />
          <span className="ml-1">Row</span>
        </button>
        <button 
          className="p-1 rounded hover:bg-gray-200"
          onClick={handleAddColumn}
          title="Add Column"
        >
          <Plus size={16} />
          <span className="ml-1">Column</span>
        </button>
      </div>
      
      <div className="flex items-center space-x-1 mr-2">
        <button 
          className="p-1 rounded hover:bg-gray-200"
          onClick={handleDeleteRow}
          title="Delete Row"
        >
          <Trash2 size={16} />
          <span className="ml-1">Row</span>
        </button>
        <button 
          className="p-1 rounded hover:bg-gray-200"
          onClick={handleDeleteColumn}
          title="Delete Column"
        >
          <Trash2 size={16} />
          <span className="ml-1">Column</span>
        </button>
      </div>
      
      <div className="border-l border-gray-300 h-6 mx-2"></div>
      
      <div className="flex items-center space-x-1 mr-2">
        <button 
          className="p-1 rounded hover:bg-gray-200"
          onClick={undo}
          title="Undo"
        >
          <Undo size={16} />
        </button>
        <button 
          className="p-1 rounded hover:bg-gray-200"
          onClick={redo}
          title="Redo"
        >
          <Redo size={16} />
        </button>
      </div>
      
      <div className="border-l border-gray-300 h-6 mx-2"></div>
      
      <div className="flex items-center space-x-1 mr-2">
        <button 
          className="p-1 rounded hover:bg-gray-200"
          onClick={() => setShowFindReplace(!showFindReplace)}
          title="Find and Replace"
        >
          <Search size={16} />
          <span className="ml-1">Find & Replace</span>
        </button>
        <button 
          className="p-1 rounded hover:bg-gray-200"
          onClick={handleRemoveDuplicates}
          title="Remove Duplicates"
        >
          <Trash2 size={16} />
          <span className="ml-1">Remove Duplicates</span>
        </button>
      </div>
      
      {showFindReplace && (
        <div className="absolute top-24 left-4 bg-white border border-gray-300 shadow-lg p-4 rounded z-10">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <label className="w-20">Find:</label>
              <input 
                type="text" 
                value={findText} 
                onChange={(e) => setFindText(e.target.value)}
                className="border border-gray-300 p-1 rounded"
              />
            </div>
            <div className="flex items-center">
              <label className="w-20">Replace:</label>
              <input 
                type="text" 
                value={replaceText} 
                onChange={(e) => setReplaceText(e.target.value)}
                className="border border-gray-300 p-1 rounded"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button 
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                onClick={() => setShowFindReplace(false)}
              >
                Cancel
              </button>
              <button 
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleFindReplace}
              >
                Replace All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;