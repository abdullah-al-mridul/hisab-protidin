import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Logo } from "./Logo";
import { clsx } from "clsx";

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const { signOut } = useAuthStore();

  const navItems = [
    { icon: LayoutDashboard, label: "dashboard", path: "/" },
    { icon: Receipt, label: "add_transaction", path: "/transactions" },
    { icon: PieChart, label: "balance", path: "/budget" },
    { icon: Users, label: "Family", path: "/family" },
    { icon: Settings, label: "settings", path: "/settings" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 lg:translate-x-0 lg:static",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo Section */}
        <div className="p-6 flex items-center gap-3 border-b border-gray-100 dark:border-gray-700">
          <div className="flex-shrink-0">
            <Logo className="w-10 h-10" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            হিসাব প্রতিদিন
          </h1>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{t(item.label)}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium text-sm"
          >
            <LogOut className="w-5 h-5" />
            <span>{t("logout")}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
