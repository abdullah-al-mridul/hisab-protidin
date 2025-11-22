import React from "react";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

export const AuthLayout: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "bn" ? "en" : "bn";
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative">
      {/* Language Selector */}
      <button
        onClick={toggleLanguage}
        className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-gray-700 font-medium"
      >
        {i18n.language === "bn" ? "বাংলা" : "English"}
        <Globe className="w-4 h-4" />
      </button>

      {/* Main Content */}
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
};
