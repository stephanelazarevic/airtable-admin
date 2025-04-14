"use client";

import { ReactNode } from "react";

type LoadingButtonProps = {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
};

export default function LoadingButton({
  onClick,
  isLoading,
  disabled = false,
  children,
  className = "",
}: LoadingButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors duration-200 ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.372 0 0 5.372 0 12h4z"
          ></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
}
