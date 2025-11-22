import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/useAuthStore";

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

export const TransactionForm: React.FC<{ onSuccess?: () => void }> = ({
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
  }, []);

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
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const filteredCategories = categories.filter(
    (cat) => cat.type === selectedType
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <label className="cursor-pointer">
          <input
            type="radio"
            value="income"
            className="peer sr-only"
            {...register("type")}
          />
          <div className="rounded-xl border-2 border-gray-200 dark:border-gray-600 p-3 text-center peer-checked:border-green-500 peer-checked:bg-green-50 dark:peer-checked:bg-green-900/30 peer-checked:text-green-600 dark:peer-checked:text-green-400 transition-all">
            {t("income")}
          </div>
        </label>
        <label className="cursor-pointer">
          <input
            type="radio"
            value="expense"
            className="peer sr-only"
            {...register("type")}
          />
          <div className="rounded-xl border-2 border-gray-200 dark:border-gray-600 p-3 text-center peer-checked:border-red-500 peer-checked:bg-red-50 dark:peer-checked:bg-red-900/30 peer-checked:text-red-600 dark:peer-checked:text-red-400 transition-all">
            {t("expense")}
          </div>
        </label>
      </div>

      <Input
        label="Amount"
        type="number"
        step="0.01"
        placeholder="0.00"
        {...register("amount", { required: "Amount is required", min: 0 })}
        error={errors.amount?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Category
        </label>
        <select
          {...register("category_id", { required: "Category is required" })}
          className="w-full rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 px-4 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
        >
          <option value="">Select Category</option>
          {filteredCategories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.category_id && (
          <p className="text-sm text-red-600 mt-1">
            {errors.category_id.message}
          </p>
        )}
      </div>

      <Input
        label="Date"
        type="date"
        {...register("date", { required: true })}
      />

      <Input label="Note" placeholder="Optional note" {...register("note")} />

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Save Transaction
      </Button>
    </form>
  );
};
