import React from "react";
import { useTranslation } from "react-i18next";
import { Moon, Sun, Globe, LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "../components/ui/Button";

export const SettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { signOut, user } = useAuthStore();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "bn" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t("settings")}</h1>
        <p className="text-sm text-gray-500 mt-1">
          আপনার অ্যাকাউন্ট এবং পছন্দ পরিচালনা করুন
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-1">প্রোফাইল</h3>
          <p className="text-sm text-gray-600">{user?.email}</p>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {t("language")}
                </p>
                <p className="text-xs text-gray-500">
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
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Moon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Theme</p>
                <p className="text-xs text-gray-500">Light Mode</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Toggle
            </Button>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <Button variant="danger" className="w-full" onClick={() => signOut()}>
            <LogOut className="w-4 h-4 mr-2" />
            {t("logout")}
          </Button>
        </div>
      </div>
    </div>
  );
};
