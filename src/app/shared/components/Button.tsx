'use client';

import React from 'react';

interface ButtonProps {
  label?: string;
  onClick?: () => void;
  disabled?: boolean;
  hasIconStart?: React.ReactNode;
  hasIconEnd?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button = ({
  label = 'Button',
  onClick,
  disabled = false,
  hasIconStart,
  hasIconEnd,
  type = 'button',
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg not-even:text-gray-700 hover:text-indigo-600 font-medium transition-colors"
    >
      {hasIconStart && <span className="flex items-center">{hasIconStart}</span>}
      {label}
      {hasIconEnd && <span className="flex items-center">{hasIconEnd}</span>}
    </button>
  );
};

export default Button;
