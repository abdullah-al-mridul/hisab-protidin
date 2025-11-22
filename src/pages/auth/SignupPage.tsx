import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/useAuthStore";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export const SignupPage: React.FC = () => {
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
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
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
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {t("signup")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="fullName"
          type="text"
          label="Full Name"
          placeholder="John Doe"
          required
        />
        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="you@example.com"
          required
        />
        <Input
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          required
          minLength={6}
        />

        {error && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full" isLoading={loading}>
          {t("signup")}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="text-primary font-medium hover:underline"
        >
          {t("login")}
        </Link>
      </div>
    </div>
  );
};
