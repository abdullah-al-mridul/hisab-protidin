import React from "react";
import { useTranslation } from "react-i18next";
import { Moon, Sun, Globe, LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "../components/ui/Button";

export const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { signOut, user } = useAuthStore();
  const { theme, toggleTheme } = useTheme();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "bn" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t("settings")}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          আপনার অ্যাকাউন্ট এবং পছন্দ পরিচালনা করুন
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
            প্রোফাইল
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {user?.email}
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                  {t("language")}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {i18n.language === "en" ? "English" : "বাংলা"}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={toggleLanguage}>
              Switch to {i18n.language === "en" ? "Bangla" : "English"}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                {theme === "dark" ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                  Theme
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {theme === "dark" ? "Dark Mode" : "Light Mode"}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={toggleTheme}>
              Toggle
            </Button>
          </div>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-700">
          <Button variant="danger" className="w-full" onClick={() => signOut()}>
            <LogOut className="w-4 h-4 mr-2" />
            {t("logout")}
          </Button>
        </div>
      </div>
    </div>
  );
};
