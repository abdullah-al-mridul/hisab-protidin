import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Bell,
  Moon,
  Sun,
  Settings,
  X,
  TrendingUp,
  TrendingDown,
  Calendar,
  MoreVertical,
  Plus,
  Minus,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/useAuthStore";
import { useTheme } from "../contexts/ThemeContext";
import { format } from "date-fns";
import { bn } from "date-fns/locale";
import { AddTransactionModal } from "../components/AddTransactionModal";

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useTheme();

  const [stats, setStats] = useState({
    balance: 0,
    income: 0,
    expense: 0,
  });

  const [comparison, setComparison] = useState({
    incomeGrowth: 0,
    expenseGrowth: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [transactions, setTransactions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [showBanner, setShowBanner] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        );
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // Fetch Current Month Data
        const { data: currentMonthData, error: currentError } = await supabase
          .from("transactions")
          .select("*, category:categories(name, icon)")
          .eq("user_id", user.id)
          .gte("date", startOfMonth.toISOString().split("T")[0])
          .order("date", { ascending: false });

        if (currentError) throw currentError;

        // Fetch Last Month Data (for comparison)
        const { data: lastMonthData, error: lastError } = await supabase
          .from("transactions")
          .select("amount, type")
          .eq("user_id", user.id)
          .gte("date", startOfLastMonth.toISOString().split("T")[0])
          .lte("date", endOfLastMonth.toISOString().split("T")[0]);

        if (lastError) throw lastError;

        // Calculate Stats
        const income =
          currentMonthData
            ?.filter((t) => t.type === "income")
            .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

        const expense =
          currentMonthData
            ?.filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

        const balance = income - expense;

        // Calculate Comparison
        const lastMonthIncome =
          lastMonthData
            ?.filter((t) => t.type === "income")
            .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

        const lastMonthExpense =
          lastMonthData
            ?.filter((t) => t.type === "expense")
            .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

        const incomeGrowth =
          lastMonthIncome === 0
            ? 100
            : ((income - lastMonthIncome) / lastMonthIncome) * 100;
        const expenseGrowth =
          lastMonthExpense === 0
            ? 100
            : ((expense - lastMonthExpense) / lastMonthExpense) * 100;

        setStats({ balance, income, expense });
        setComparison({ incomeGrowth, expenseGrowth });
        setTransactions(currentMonthData || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, refreshKey]);

  const filteredTransactions = transactions.filter((t) => {
    if (activeTab === "all") return true;
    return t.type === activeTab;
  });

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="space-y-6 pb-24 relative min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h1 className="text-2xl font-bold text-primary">হিসাব প্রতিদিন</h1>
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-6 h-6" />
            ) : (
              <Moon className="w-6 h-6" />
            )}
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Promotional Banner */}
      {showBanner && (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 text-white relative overflow-hidden shadow-lg mx-1">
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="font-bold text-lg">মাত্র ৬৬ টাকায়</p>
              <p className="text-xs text-gray-300">৬ মাস প্রিমিয়াম নিন</p>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
              এখানে ক্লিক
            </button>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Comparison Widget */}
      <div className="grid grid-cols-2 gap-4 mx-1">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
          <button className="absolute top-2 right-2 text-gray-300 hover:text-gray-500">
            <X className="w-3 h-3" />
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            "আয়" গত মাস থেকে
          </p>
          <div className="flex items-center gap-1">
            {comparison.incomeGrowth >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span
              className={`font-bold text-lg ${
                comparison.incomeGrowth >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {Math.abs(comparison.incomeGrowth).toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500">
              {comparison.incomeGrowth >= 0 ? "বেশি" : "কম"}
            </span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
          <button className="absolute top-2 right-2 text-gray-300 hover:text-gray-500">
            <X className="w-3 h-3" />
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            "ব্যয়" গত মাস থেকে
          </p>
          <div className="flex items-center gap-1">
            {comparison.expenseGrowth <= 0 ? (
              <TrendingDown className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingUp className="w-4 h-4 text-red-500" />
            )}
            <span
              className={`font-bold text-lg ${
                comparison.expenseGrowth <= 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {Math.abs(comparison.expenseGrowth).toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500">
              {comparison.expenseGrowth <= 0 ? "কম" : "বেশি"}
            </span>
          </div>
        </div>
      </div>

      {/* Monthly Summary Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm mx-1 p-4">
        <div className="flex items-center justify-between mb-6 bg-gray-50 dark:bg-gray-700/50 p-1 rounded-lg">
          <button className="flex-1 py-1.5 text-sm font-semibold text-white bg-primary rounded-md shadow-sm text-center">
            সেপ্টেম্বর
          </button>
          <button className="flex-1 py-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 text-center hover:text-gray-700">
            সর্বমোট
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center divide-x divide-gray-100 dark:divide-gray-700">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">আয়</p>
            <p className="text-lg font-bold text-green-500">
              ৳{stats.income.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              ব্যয়
            </p>
            <p className="text-lg font-bold text-red-500">
              ৳{stats.expense.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              ব্যালেন্স
            </p>
            <p className="text-lg font-bold text-primary">
              ৳{stats.balance.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-4 mx-1">
        {/* Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === "all"
                  ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              সব
            </button>
            <button
              onClick={() => setActiveTab("income")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === "income"
                  ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              আয়
            </button>
            <button
              onClick={() => setActiveTab("expense")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === "expense"
                  ? "bg-white dark:bg-gray-700 text-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              ব্যয়
            </button>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Calendar className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="space-y-3">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === "income"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {tx.type === "income" ? (
                    <Plus className="w-5 h-5" />
                  ) : (
                    <Minus className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-gray-100 text-sm">
                    {tx.category?.name || "Uncategorized"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {format(new Date(tx.date), "d MMMM, h:mm a", {
                      locale: bn,
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`font-bold text-sm ${
                    tx.type === "income" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  ৳{Number(tx.amount).toLocaleString()}
                </span>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {filteredTransactions.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">
              কোন লেনদেন পাওয়া যায়নি
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-4 bg-primary hover:bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 z-40"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setRefreshKey((prev) => prev + 1)}
      />
    </div>
  );
};
