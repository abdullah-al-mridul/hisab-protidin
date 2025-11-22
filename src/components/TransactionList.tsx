import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/useAuthStore";

interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  category: { name: string; icon: string } | null; // Joined
  note: string;
  date: string;
}

export const TransactionList: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchTransactions = async () => {
      try {
        const { data, error } = await supabase
          .from("transactions")
          .select(
            `
            *,
            category:categories(name, icon)
          `
          )
          .eq("user_id", user.id)
          .order("date", { ascending: false })
          .limit(20);

        if (error) throw error;
        setTransactions(data || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel("transactions_list")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transactions",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchTransactions();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading transactions...
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
        <p className="text-gray-500">No transactions found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tx.type === "income"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {/* TODO: Render icon dynamically */}
                <span className="text-lg">৳</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {tx.category?.name || "Uncategorized"}
                </p>
                <p className="text-sm text-gray-500">
                  {format(new Date(tx.date), "MMM d, yyyy")}
                </p>
              </div>
            </div>
            <div
              className={`font-bold ${
                tx.type === "income" ? "text-green-600" : "text-red-600"
              }`}
            >
              {tx.type === "income" ? "+" : "-"} ৳ {tx.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
