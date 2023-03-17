import React, { useCallback } from "react";

interface IProps<T> {
  items: T[];
  titleExtractor: (t: T) => string;
  valueExtractor: (t: T) => string;
  selectedItem: T;
  onChange: (t: T) => void;
}

const DropDown = <T,>({ items, titleExtractor, valueExtractor, selectedItem, onChange }: IProps<T>) => {
  const handleOnChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const { value } = e.target;
      const found = items.find(t => valueExtractor(t) === value);
      if (!found) throw new Error(`item with value:${value} not found in items`);
      onChange(found);
    },
    [items, onChange, valueExtractor],
  );

  return (
    <div className="w-24 h-[70%]">
      <select
        value={valueExtractor(selectedItem)}
        onChange={handleOnChange}
        className="bg-slate-700 h-full w-full rounded text-center flex justify-center items-center cursor-pointer"
      >
        {items.map(item => (
          <option key={valueExtractor(item)} value={valueExtractor(item)}>
            {titleExtractor(item)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropDown;
