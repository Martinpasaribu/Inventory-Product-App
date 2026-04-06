"use client";

import { Sparkles } from "lucide-react";

export default function TourResetButton() {
  const handleReset = () => {
    localStorage.removeItem("hasSeenCustomTour");
    localStorage.removeItem("hasSeenTour_admin-page");
    window.location.reload();
  };

  return (
    <button 
      onClick={handleReset}
      className="flex items-center gap-2 text-xs font-bold text-primary hover:underline"
    >
      <Sparkles size={14} /> Panduan
    </button>
  );
}