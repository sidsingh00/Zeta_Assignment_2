import React, { useEffect, useState } from 'react';
import { useSheetStore } from '../store/useSheetStore';
import { getCellLabel, getCellPosition } from '../utils/cellUtils';

const FormulaBar: React.FC = () => {
  const { activeCell, formulaBarValue, setFormulaBarValue } = useSheetStore();
  const [value, setValue] = useState('');
  
  useEffect(() => {
    setValue(formulaBarValue);
  }, [formulaBarValue]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setFormulaBarValue(value);
    }
  };
  
  const handleBlur = () => {
    setFormulaBarValue(value);
  };
  
  const activeCellLabel = activeCell 
    ? getCellLabel(...getCellPosition(activeCell))
    : '';
  
  return (
    <div className="bg-white border-b border-gray-300 p-1 flex items-center">
      <div className="bg-gray-100 px-2 py-1 rounded mr-2 min-w-[40px] text-center">
        {activeCellLabel}
      </div>
      <div className="flex-1">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="w-full px-2 py-1 border border-gray-300 rounded"
          placeholder="Enter a value or formula (e.g., =SUM(A1:A5))"
        />
      </div>
    </div>
  );
};

export default FormulaBar;