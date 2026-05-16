"use client";

import dynamic from "next/dynamic";

const AdminPageClient = dynamic(() => import("@/components/admin/AdminPageClient"), { ssr: false });

export default function AdminPage() {
  return <AdminPageClient />;
}
