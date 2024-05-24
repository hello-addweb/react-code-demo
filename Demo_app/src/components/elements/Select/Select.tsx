import React from "react";

interface Option {
  label: string;
  [key: string]: string;
}

interface SelectProps {
  options: Option[];
  className: string;
  [key: string]: string | boolean | Object;
}

const Select: React.FC<SelectProps> = ({ options, className = "", ...rest }) => {
  const InputClass =
    "block border-2 border-gray-200 bg-gray-200 rounded-md text-sm min-h-12 py-3 px-4 text-gray-700 outline-none leading-tight w-[100%] mb-2 ";
  return (
    <select className={InputClass + className} {...rest}>
      {options &&
        options.map((opt, index) => (
          <option key={index} {...opt}>
            {opt.label}
          </option>
        ))}
    </select>
  );
};

export default Select;
