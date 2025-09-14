import React from "react";

export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none ${className}`}
      {...props}
    />
  );
}
