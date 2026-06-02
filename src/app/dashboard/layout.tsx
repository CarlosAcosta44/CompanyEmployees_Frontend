"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Building2, Users, LayoutDashboard, LogOut, ShieldAlert } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) return null;

  const navItems = [
    { href: "/dashboard/companies", icon: Building2, label: "Compañías" },
    { href: "/dashboard/employees", icon: Users, label: "Empleados" },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-950 text-white shadow-xl flex flex-col transition-all duration-300">
        <div className="p-6 flex items-center gap-3 border-b border-indigo-800/50">
          <LayoutDashboard className="w-8 h-8 text-indigo-400" />
          <h1 className="text-xl font-bold tracking-tight">System<span className="text-indigo-400">App</span></h1>
        </div>
        
        <div className="p-4 border-b border-indigo-800/50 bg-indigo-900/40">
          <p className="text-xs text-indigo-300 uppercase tracking-wider font-semibold mb-1">Usuario Actual</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex flex-shrink-0 items-center justify-center font-bold">
              {user?.username.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="truncate font-medium text-sm" title={user?.username}>{user?.username}</p>
              <div className="flex items-center gap-1 text-xs text-indigo-300">
                <ShieldAlert className="w-3 h-3" />
                <span>{user?.ciudad}</span>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-6 flex flex-col gap-2 px-3">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" 
                    : "text-indigo-200 hover:bg-indigo-800/50 hover:text-white"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "text-indigo-200" : ""}`} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-indigo-200 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-slate-200 p-4 shrink-0 h-16 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800 capitalize">
            {pathname.split("/").pop() || "Dashboard"}
          </h2>
          <div className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100">
            Rol: {user?.rol}
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
