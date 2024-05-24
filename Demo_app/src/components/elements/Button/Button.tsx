import { getNewClassName } from '@/utils/helpers';
import React, { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, className, onClick, ...rest }) => {

  const classString : string = `p-4 md:text-base bg-primary text-white font-normal font-PoppinsSemiBold hover:bg-tertiary rounded-lg min-w-[8.9em] transition duration-200 ${className}`

  const newClassName = className ? getNewClassName(classString) : classString;
 
  return (
    <button
      onClick={onClick}
      className={newClassName}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
