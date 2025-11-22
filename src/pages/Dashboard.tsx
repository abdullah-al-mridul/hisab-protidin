import React from "react";
import { useTranslation } from "react-i18next";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const StatCard = ({ title, amount, icon: Icon, color, trend }: any) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      {trend && (
        <div
          className={`flex items-center gap-1 text-xs font-medium ${
            trend > 0
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {trend > 0 ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
      ৳ {amount}
    </p>
  </div>
);

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          {t("dashboard")}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString("bn-BD", { dateStyle: "full" })}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t("balance")}
          amount="25,000"
          icon={Wallet}
          color="bg-blue-600"
          trend={12}
        />
        <StatCard
          title={t("income")}
          amount="45,000"
          icon={TrendingUp}
          color="bg-green-600"
          trend={8}
        />
        <StatCard
          title={t("expense")}
          amount="20,000"
          icon={TrendingDown}
          color="bg-red-600"
          trend={-5}
        />
        <StatCard
          title="বাজেট বাকি"
          amount="5,000"
          icon={CreditCard}
          color="bg-purple-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Line Chart */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              মাসিক খরচের ট্রেন্ড
            </h2>
            <div className="h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-700">
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Chart Placeholder
              </p>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              সাম্প্রতিক লেনদেন
            </h2>
            <div className="space-y-3">
              {[
                {
                  name: "খাবার",
                  category: "Food",
                  amount: 500,
                  type: "expense",
                },
                {
                  name: "বেতন",
                  category: "Salary",
                  amount: 25000,
                  type: "income",
                },
                {
                  name: "যাতায়াত",
                  category: "Transport",
                  amount: 200,
                  type: "expense",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                        item.type === "income"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                      }`}
                    >
                      {item.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item.category}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`font-semibold text-sm ${
                      item.type === "income"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {item.type === "income" ? "+" : "-"}৳ {item.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              ক্যাটাগরি অনুযায়ী
            </h2>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-700">
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Pie Chart
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
