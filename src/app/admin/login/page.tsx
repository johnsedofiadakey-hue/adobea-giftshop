import type { Metadata } from "next";
import { LoginForm } from "@/app/admin/login/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login — EA_DUBEA'S GIFT HUB",
};

export default function AdminLoginPage() {
  return <LoginForm />;
}
