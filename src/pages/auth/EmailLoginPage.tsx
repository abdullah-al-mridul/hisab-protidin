import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export const EmailLoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { checkUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      await checkUser();
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/auth/login")}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">{t("back")}</span>
      </button>

      {/* Title */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t("emailLogin")}
        </h2>
        <p className="text-gray-600 text-sm">{t("enterEmailPassword")}</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="email"
          type="email"
          label={t("email")}
          placeholder="you@example.com"
          required
        />
        <Input
          name="password"
          type="password"
          label={t("password")}
          placeholder="••••••••"
          required
        />

        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" isLoading={loading}>
          {t("login")}
        </Button>
      </form>

      {/* Signup Link */}
      <div className="text-center text-sm text-gray-600">
        {t("noAccount")}{" "}
        <Link
          to="/auth/signup"
          className="text-primary font-medium hover:underline"
        >
          {t("signup")}
        </Link>
      </div>
    </div>
  );
};
