import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { Layout } from "./components/Layout";
import { AuthLayout } from "./components/AuthLayout";
import { Dashboard } from "./pages/Dashboard";
import { LoginPage } from "./pages/auth/LoginPage";
import { EmailLoginPage } from "./pages/auth/EmailLoginPage";
import { SignupPage } from "./pages/auth/SignupPage";
import { TransactionsPage } from "./pages/TransactionsPage";
import { FamilyPage } from "./pages/FamilyPage";
import { BudgetPage } from "./pages/BudgetPage";
import { SettingsPage } from "./pages/SettingsPage";
import { CategoriesPage } from "./pages/CategoriesPage";

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  return <>{children}</>;
};

function App() {
  const { checkUser } = useAuthStore();

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="email-login" element={<EmailLoginPage />} />
          <Route path="signup" element={<SignupPage />} />
        </Route>

        {/* Protected App Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="family" element={<FamilyPage />} />
          <Route path="budget" element={<BudgetPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          {/* Add more routes here */}
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
