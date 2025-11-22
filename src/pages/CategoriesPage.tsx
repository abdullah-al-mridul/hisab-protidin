import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/useAuthStore";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Input";

interface Category {
  id: string;
  name: string;
  icon: string;
  type: "income" | "expense";
  is_default: boolean;
}

export const CategoriesPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const type = formData.get("type") as "income" | "expense";

    try {
      const { error } = await supabase.from("categories").insert({
        name,
        type,
        created_by: user.id,
        is_default: false,
      });

      if (error) throw error;

      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            ক্যাটাগরি
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            আপনার লেনদেনের ক্যাটাগরি পরিচালনা করুন
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          নতুন ক্যাটাগরি
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-lg ${
                  category.type === "income" ? "bg-green-600" : "bg-red-600"
                }`}
              >
                <div className="w-5 h-5 bg-white opacity-90 rounded-full" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                  {category.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {category.type === "income" ? "আয়" : "ব্যয়"}
                </p>
              </div>
            </div>
            {!category.is_default && (
              <button className="text-red-400 hover:text-red-600 dark:hover:text-red-300 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Category"
      >
        <form onSubmit={handleAddCategory} className="space-y-4">
          <Input
            name="name"
            label="Category Name"
            placeholder="e.g. Freelance"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              name="type"
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 px-4 py-2"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <Button type="submit" className="w-full">
            Save Category
          </Button>
        </form>
      </Modal>
    </div>
  );
};
