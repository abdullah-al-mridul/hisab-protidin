import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Download,
  Crown,
  Facebook,
  Youtube,
  BookOpen,
  MessageCircle,
  ChevronRight,
  CheckCircle,
  Copy,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { supabase } from "../lib/supabase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { signOut, user } = useAuthStore();
  const [downloading, setDownloading] = useState(false);

  const generatePDF = async () => {
    if (!user) return;
    setDownloading(true);

    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const { data: transactions, error } = await supabase
        .from("transactions")
        .select("*, category:categories(name)")
        .eq("user_id", user.id)
        .gte("date", startOfMonth.toISOString().split("T")[0])
        .order("date", { ascending: false });

      if (error) throw error;

      const doc = new jsPDF();

      // Add Bengali font support if possible, otherwise use English for PDF
      // Note: jsPDF default fonts don't support Bengali.
      // We will use English for the report to avoid garbage text.

      doc.setFontSize(20);
      doc.text("Monthly Expense Report", 14, 22);

      doc.setFontSize(11);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      doc.text(`User: ${user.email}`, 14, 36);

      const tableData =
        transactions?.map((t) => [
          t.date,
          t.category?.name || "Uncategorized",
          t.type.toUpperCase(),
          t.amount.toString(),
          t.note || "-",
        ]) || [];

      autoTable(doc, {
        head: [["Date", "Category", "Type", "Amount", "Note"]],
        body: tableData,
        startY: 44,
        theme: "grid",
        headStyles: { fillColor: [59, 130, 246] }, // Blue header
      });

      doc.save(`report_${format(now, "yyyy_MM")}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF");
    } finally {
      setDownloading(false);
    }
  };

  const menuItems = [
    {
      icon: Crown,
      label: "প্রিমিয়াম ফিচার",
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      icon: Facebook,
      label: "কমিউনিটি জয়েন",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Youtube,
      label: "টিউটোরিয়াল দেখুন",
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      icon: BookOpen,
      label: "প্রশ্ন - উত্তর",
      color: "text-amber-700",
      bg: "bg-amber-50",
    },
    {
      icon: MessageCircle,
      label: "আমার প্রশ্নের উত্তর",
      color: "text-pink-600",
      bg: "bg-pink-50",
    },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3 px-1">
        <button className="p-2 -ml-2 text-gray-600">
          {/* Back button placeholder if needed */}
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          সেটিংস
        </h1>
      </div>

      {/* Monthly Report Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-sm border border-gray-100 dark:border-gray-700 mx-1">
        <div className="flex items-center justify-center gap-2 text-primary mb-2">
          <CalendarIcon className="w-5 h-5" />
          <span className="font-medium">সেপ্টেম্বর, ২০২৩</span>
        </div>
        <h2 className="text-gray-600 dark:text-gray-400 text-sm mb-6">
          আয় ব্যয়ের মাসিক রিপোর্ট
        </h2>
        <button
          onClick={generatePDF}
          disabled={downloading}
          className="bg-primary hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto transition-all active:scale-95 disabled:opacity-70"
        >
          <Download className="w-5 h-5" />
          {downloading ? "ডাউনলোড হচ্ছে..." : "ডাউনলোড"}
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 mx-1 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-full text-green-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              ইমেইল ও রেফার আইডি
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {user?.email}
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <Copy className="w-5 h-5" />
        </button>
      </div>

      {/* Menu List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mx-1 overflow-hidden">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-50 dark:border-gray-700 last:border-0"
          >
            <div className="flex items-center gap-4">
              <item.icon className={`w-6 h-6 ${item.color}`} />
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {item.label}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <div className="mx-1">
        <button
          onClick={() => signOut()}
          className="w-full flex items-center justify-center gap-2 p-4 text-red-500 font-medium hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          লগ আউট
        </button>
      </div>
    </div>
  );
};

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);
