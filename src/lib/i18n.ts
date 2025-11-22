import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcome: "Welcome to Hisab Protidin",
      login: "Login",
      signup: "Sign Up",
      dashboard: "Dashboard",
      income: "Income",
      expense: "Expense",
      balance: "Balance",
      add_transaction: "Add Transaction",
      settings: "Settings",
      language: "Language",
      logout: "Logout",
      continueWithGoogle: "Continue with Google",
      continueWithEmail: "Continue with Email",
      forgotPassword: "Forgot password?",
      back: "Back",
      emailLogin: "Email Login",
      enterEmailPassword: "Enter your email and password",
      email: "Email",
      password: "Password",
      noAccount: "Don't have an account?",
    },
  },
  bn: {
    translation: {
      welcome: "হিসাব প্রতিদিন-এ স্বাগতম",
      login: "লগইন করুন",
      signup: "নিবন্ধন করুন",
      dashboard: "ড্যাশবোর্ড",
      income: "আয়",
      expense: "ব্যয়",
      balance: "অবশিষ্ট",
      add_transaction: "লেনদেন যোগ করুন",
      settings: "সেটিংস",
      language: "ভাষা",
      logout: "লগআউট",
      continueWithGoogle: "গুগল দিয়ে চালিয়ে যান",
      continueWithEmail: "ইমেইল দিয়ে চালিয়ে যান",
      forgotPassword: "পাসওয়ার্ড ভুলে গেছেন?",
      back: "পিছনে যান",
      emailLogin: "ইমেইল দিয়ে লগইন",
      enterEmailPassword: "আপনার ইমেইল এবং পাসওয়ার্ড দিন",
      email: "ইমেইল",
      password: "পাসওয়ার্ড",
      noAccount: "অ্যাকাউন্ট নেই?",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "bn", // Default language Bangla
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
