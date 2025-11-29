'use client';

import React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string | null;
  hint?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, containerClassName = "", labelClassName = "", inputClassName = "", ...rest }, ref) => {
    return (
      <div className={`mb-4 ${containerClassName}`}>
        {label && <label className={`block text-sm font-medium mb-1 ${labelClassName}`}>{label}</label>}
        <input
          ref={ref}
          {...rest}
          className={`w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 ${inputClassName} ${error ? "border-red-500" : "border-slate-300"}`}
        />
        {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;