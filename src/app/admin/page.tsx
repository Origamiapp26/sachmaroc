import AdminDashboardPage from "@/components/admin/AdminDashboardPage";

export const metadata = {
  title: "لوحة التحكم",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminDashboardPage />;
}
