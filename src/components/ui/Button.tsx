"use client";

import React from "react";

export default function Button({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center px-4 py-2 rounded bg-sky-600 text-white disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}
