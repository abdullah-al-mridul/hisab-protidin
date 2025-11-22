import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { X, Calendar, DollarSign, FileText } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/useAuthStore";
import { clsx } from "clsx";

interface TransactionFormData {
  amount: number;
  type: "income" | "expense";
  category_id: string;
  note: string;
  date: string;
}

interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
}

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedType, setSelectedType] = useState<"income" | "expense">(
    "expense"
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    defaultValues: {
      type: "expense",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const transactionType = watch("type");

  useEffect(() => {
    setSelectedType(transactionType);
  }, [transactionType]);

  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const { data, error } = await supabase
            .from("categories")
            .select("id, name, type")
            .order("name");

          if (error) throw error;
          setCategories(data || []);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
      fetchCategories();
    }
  }, [isOpen]);

  const onSubmit = async (data: TransactionFormData) => {
    if (!user) return;

    try {
      const { error } = await supabase.from("transactions").insert({
        ...data,
        user_id: user.id,
        amount: Number(data.amount),
      });

      if (error) throw error;

      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const filteredCategories = categories.filter(
    (cat) => cat.type === selectedType
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <input
              type="date"
              className="bg-transparent border-none focus:ring-0 text-sm font-medium p-0 text-gray-700 dark:text-gray-200"
              {...register("date", { required: true })}
            />
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setValue("type", "income")}
              className={clsx(
                "py-3 rounded-xl font-bold text-sm transition-all border-2",
                selectedType === "income"
                  ? "bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/30"
                  : "bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
              )}
            >
              {t("income")}
            </button>
            <button
              type="button"
              onClick={() => setValue("type", "expense")}
              className={clsx(
                "py-3 rounded-xl font-bold text-sm transition-all border-2",
                selectedType === "expense"
                  ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/30"
                  : "bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
              )}
            >
              {t("expense")}
            </button>
          </div>

          {/* Amount Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="number"
              step="0.01"
              placeholder="টাকার পরিমাণ"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all text-lg font-medium placeholder:font-normal"
              {...register("amount", { required: true, min: 0 })}
            />
          </div>

          {/* Category Select */}
          <div>
            <select
              {...register("category_id", { required: true })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all appearance-none bg-white"
            >
              <option value="">ক্যাটাগরি সিলেক্ট করুন</option>
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Note Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="বিবরণ লিখুন"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
              {...register("note")}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={clsx(
                "flex-1 py-3 rounded-xl font-bold text-white shadow-lg transition-all",
                selectedType === "income"
                  ? "bg-green-500 hover:bg-green-600 shadow-green-500/30"
                  : "bg-red-500 hover:bg-red-600 shadow-red-500/30"
              )}
            >
              {isSubmitting ? "যোগ করা হচ্ছে..." : "যোগ করুন"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
