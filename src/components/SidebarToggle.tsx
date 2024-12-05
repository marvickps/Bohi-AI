"use client";

import React, { useState } from "react";

const SidebarToggle = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleSidebar = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <>
      {/* Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 left-4 bg-purple-600 text-white px-2 py-1 rounded-lg shadow-lg z-10"
      >
        {isVisible ? "Hide Sidebar" : "Show Sidebar"}
      </button>

      {/* Sidebar */}
      {isVisible && (
        <div className="w-1/5 grid-cols-2 border-r-2 bg-white shadow-lg">
          {children}
        </div>
      )}
    </>
  );
};

export default SidebarToggle;
