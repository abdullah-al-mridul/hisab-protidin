import React from "react";
import { useTranslation } from "react-i18next";
import { TransactionList } from "../components/TransactionList";
import { TransactionForm } from "../components/TransactionForm";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import { Plus } from "lucide-react";

export const TransactionsPage: React.FC = () => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {t("add_transaction")}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            আপনার সকল লেনদেন দেখুন এবং পরিচালনা করুন
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          নতুন যোগ করুন
        </Button>
      </div>

      <TransactionList />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t("add_transaction")}
      >
        <TransactionForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};
