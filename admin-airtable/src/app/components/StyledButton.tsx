import React from 'react';
import Link from 'next/link';

const StyledButton = () => {
  return (
    <Link href="/pages/admin">
      <button
        className="
          bg-blue-500 
          hover:bg-blue-700 
          text-white 
          font-bold 
          py-2 
          px-4 
          rounded 
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-500 
          focus:ring-opacity-50
        "
      >
        Aller à l'administration
      </button>
    </Link>
  );
};

export default StyledButton;
