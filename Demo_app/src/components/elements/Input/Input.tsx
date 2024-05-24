import React from 'react';

interface InputProps {
  type: string;
  className?: string;
  placeholder: string;
  [key:string]: any;
}

const Input: React.FC<InputProps> = ({ type, className, placeholder, ...rest}) => {
const InputClass = "block border-2 border-gray-200 bg-gray-200 rounded-md text-sm min-h-12 py-3 px-4 text-gray-700 outline-none leading-tight w-[100%] mb-2 placeholder-gray-700 focus:placeholder-gray-300 ";
  return (
    <input
      type={type}
      className={InputClass + className}
      placeholder={placeholder}
      {...rest}
    />
  );
};

export default Input;
