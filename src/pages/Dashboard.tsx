import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/useAuthStore";

const StatCard = ({ title, amount, icon: Icon, color, trend }: any) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700">
    <div className="flex items-start justify-between mb-3">
      <div className={`p-2 rounded ${color}`}>
        <Icon className="w-4 h-4 text-white" />
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
    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{title}</p>
    <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
      ৳{amount.toLocaleString()}
    </p>
  </div>
);

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#EF4444",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
];

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    balance: 0,
    income: 0,
    expense: 0,
    budget: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { data: transactions, error } = await supabase
          .from("transactions")
          .select("*, category:categories(name, icon)")
          .eq("user_id", user.id)
          .gte("date", startOfMonth.toISOString().split("T")[0])
          .order("date", { ascending: false });

        if (error) throw error;

        const income =
          transactions
            ?.filter((t) => t.type === "income")
            .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

        const expense =
          transactions
            ?.filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

        const balance = income - expense;

        const currentMonth = new Date().toISOString().slice(0, 7);
        const { data: budgetData } = await supabase
          .from("budgets")
          .select("amount")
          .eq("user_id", user.id)
          .eq("month", currentMonth)
          .single();

        const budgetAmount = budgetData?.amount || 0;
        const budgetRemaining = budgetAmount - expense;

        setStats({
          balance,
          income,
          expense,
          budget: budgetRemaining,
        });

        setRecentTransactions(transactions?.slice(0, 3) || []);

        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split("T")[0];

          const dayExpense =
            transactions
              ?.filter((t) => t.type === "expense" && t.date === dateStr)
              .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

          last7Days.push({
            date: date.toLocaleDateString("bn-BD", {
              day: "numeric",
              month: "short",
            }),
            expense: dayExpense,
          });
        }
        setMonthlyData(last7Days);

        const categoryMap = new Map();
        transactions
          ?.filter((t) => t.type === "expense")
          .forEach((t) => {
            const catName = t.category?.name || "Other";
            categoryMap.set(
              catName,
              (categoryMap.get(catName) || 0) + Number(t.amount)
            );
          });

        const catData = Array.from(categoryMap.entries())
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 6);

        setCategoryData(catData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div>
          <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-1"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-56"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="w-10 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-3"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-3"></div>
            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-0.5">
          {t("dashboard")}
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString("bn-BD", { dateStyle: "full" })}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t("balance")}
          amount={stats.balance}
          icon={Wallet}
          color="bg-blue-600"
        />
        <StatCard
          title={t("income")}
          amount={stats.income}
          icon={TrendingUp}
          color="bg-green-600"
        />
        <StatCard
          title={t("expense")}
          amount={stats.expense}
          icon={TrendingDown}
          color="bg-red-600"
        />
        <StatCard
          title="বাজেট বাকি"
          amount={stats.budget}
          icon={CreditCard}
          color="bg-purple-600"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* Area Chart */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700">
            <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              সাম্প্রতিক খরচের ট্রেন্ড
            </h2>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient
                      id="colorExpense"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E5E7EB"
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#9CA3AF"
                    style={{ fontSize: "11px" }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    style={{ fontSize: "11px" }}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E5E7EB",
                      borderRadius: "4px",
                      fontSize: "12px",
                      padding: "8px",
                    }}
                    formatter={(value: any) => `৳${value.toLocaleString()}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    stroke="#EF4444"
                    strokeWidth={2}
                    fill="url(#colorExpense)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center">
                <p className="text-gray-400 dark:text-gray-500 text-xs">
                  No data
                </p>
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700">
            <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              সাম্প্রতিক লেনদেন
            </h2>
            {recentTransactions.length === 0 ? (
              <p className="text-center py-6 text-gray-400 dark:text-gray-500 text-xs">
                No transactions
              </p>
            ) : (
              <div className="space-y-2">
                {recentTransactions.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                          item.type === "income"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                        }`}
                      >
                        {item.category?.name?.[0] || "৳"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100 text-xs">
                          {item.category?.name || "Uncategorized"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(item.date).toLocaleDateString("bn-BD")}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-medium text-xs ${
                        item.type === "income"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {item.type === "income" ? "+" : "-"}৳
                      {Number(item.amount).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
            ক্যাটাগরি অনুযায়ী
          </h2>
          {categoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((_entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-1.5">
                {categoryData.map((cat, index) => (
                  <div
                    key={cat.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="text-gray-700 dark:text-gray-300">
                        {cat.name}
                      </span>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      ৳{cat.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-48 flex items-center justify-center">
              <p className="text-gray-400 dark:text-gray-500 text-xs">
                No data
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
