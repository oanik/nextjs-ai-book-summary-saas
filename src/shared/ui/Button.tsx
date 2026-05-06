'use client';

import React from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

const variantClasses = {
  primary: 'bg-indigo-600 text-white border border-indigo-600 hover:bg-indigo-700 hover:text-white',
  secondary:
    'block w-full py-3 bg-white text-indigo-600 rounded-lg font-bold text-center hover:bg-gray-100 transition-colors',
  ghost: 'bg-transparent text-gray-700 border border-transparent hover:bg-gray-100',
  danger: 'bg-red-600 text-white border border-red-600 hover:bg-red-700',
} as const;

const sizeClasses = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
} as const;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
  variant?: keyof typeof variantClasses;
  size?: keyof typeof sizeClasses;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
};

export function Button({
  label,
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  fullWidth = false,
  loading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const content = children ?? label ?? 'Button';

  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60',
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} disabled={isDisabled} className={classes} {...props}>
      {loading && (
        <span
          aria-hidden="true"
          className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {!loading && leftIcon && <span className="inline-flex items-center">{leftIcon}</span>}
      <span>{content}</span>
      {!loading && rightIcon && <span className="inline-flex items-center">{rightIcon}</span>}
    </button>
  );
}

export default Button;
