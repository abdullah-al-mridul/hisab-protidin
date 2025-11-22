import React from "react";
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

export const TransactionForm: React.FC<{ onSuccess?: () => void }> = ({
  onSuccess,
}) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    defaultValues: {
      type: "expense",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: TransactionFormData) => {
    if (!user) return;

    try {
      const { error } = await supabase.from("transactions").insert({
        ...data,
        user_id: user.id,
      });

      if (error) throw error;

      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
    >
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        {t("add_transaction")}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <label className="cursor-pointer">
          <input
            type="radio"
            value="income"
            className="peer sr-only"
            {...register("type")}
          />
          <div className="rounded-xl border-2 border-gray-200 p-3 text-center peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-600 transition-all">
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
          <div className="rounded-xl border-2 border-gray-200 p-3 text-center peer-checked:border-red-500 peer-checked:bg-red-50 peer-checked:text-red-600 transition-all">
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

      {/* TODO: Replace with real categories from DB */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          {...register("category_id")}
          className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all"
        >
          <option value="">Select Category</option>
          <option value="food">Food</option>
          <option value="transport">Transport</option>
          <option value="salary">Salary</option>
        </select>
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
