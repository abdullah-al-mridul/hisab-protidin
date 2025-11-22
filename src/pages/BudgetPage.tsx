import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";

export const BudgetPage: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budget, setBudget] = useState(25000);
  const [spent, setSpent] = useState(20000);

  const percentage = Math.min((spent / budget) * 100, 100);
  const isOverBudget = spent > budget;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">মাসিক বাজেট</h1>
          <p className="text-sm text-gray-500 mt-1">
            আপনার মাসিক বাজেট পরিচালনা করুন
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>বাজেট সেট করুন</Button>
      </div>

      <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
        <p className="text-sm text-gray-500 mb-2">মোট বাজেট</p>
        <h2 className="text-4xl font-bold text-gray-900 mb-8">
          ৳ {budget.toLocaleString()}
        </h2>

        <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
          <div
            className={`absolute top-0 left-0 h-full transition-all duration-500 ${
              isOverBudget ? "bg-red-600" : "bg-blue-600"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between text-sm font-medium">
          <span className="text-gray-600">
            খরচ হয়েছে: ৳ {spent.toLocaleString()}
          </span>
          <span className={isOverBudget ? "text-red-600" : "text-green-600"}>
            বাকি: ৳ {(budget - spent).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 h-64 flex items-center justify-center">
          <p className="text-gray-400 text-sm">বাজেট বরাদ্দ চার্ট</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 h-64 flex items-center justify-center">
          <p className="text-gray-400 text-sm">খরচের ট্রেন্ড</p>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Set Monthly Budget"
      >
        <form className="space-y-4">
          <Input label="Budget Amount" type="number" defaultValue={budget} />
          <Button className="w-full">Save Budget</Button>
        </form>
      </Modal>
    </div>
  );
};
