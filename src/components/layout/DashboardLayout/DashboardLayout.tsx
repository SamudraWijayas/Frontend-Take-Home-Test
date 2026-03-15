"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import {
  Sun,
  Moon,
  Menu,
  LayoutDashboard,
  FileText,
  Users,
  Bell,
  X,
} from "lucide-react";
import { useUIStore } from "@/store/ui.store";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";

interface Props {
  children: ReactNode;
  title?: string;
}

const DashboardLayout = ({ children, title = "Dashboard" }: Props) => {
  const pathname = usePathname();

  const {
    darkMode,
    sidebarCollapsed,
    sidebarOpen,
    toggleTheme,
    toggleSidebar,
    toggleCollapse,
  } = useUIStore();
  const showLabel = !sidebarCollapsed || sidebarOpen;

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Invoices", href: "/invoices", icon: FileText },
    { name: "Customers", href: "/customers", icon: Users },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-950">
      {/* OVERLAY MOBILE */}
      {sidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={cn(
          "fixed z-40 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-300 flex flex-col",
          sidebarCollapsed ? "w-64 md:w-20" : "w-64 md:w-64",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200 dark:border-gray-800">
          <span className="font-bold text-lg text-gray-800 dark:text-gray-200">
            {!showLabel ? "SB" : "SaaS Billing"}
          </span>

          {/* CLOSE MOBILE */}
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                  active
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                )}
              >
                <Icon className="dark:text-gray-200" size={18} />

                {showLabel && (
                  <span className="text-sm font-medium dark:text-gray-200">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER */}
        {showLabel && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-white">
            SaaS Billing v1.0
          </div>
        )}
      </aside>

      {/* MAIN */}
      <div
        className={cn(
          "flex-1 flex flex-col overflow-hidden w-full transition-all duration-300",
          sidebarCollapsed ? "md:ml-20" : "md:ml-64",
        )}
      >
        {/* NAVBAR */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleCollapse}
              className="p-2 hidden md:flex rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <Menu size={18} />
            </button>

            <h1 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              {title}
            </h1>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {/* THEME */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* USER */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600" />
              <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                Admin
              </span>
            </div>

            {/* MOBILE MENU */}
            <button
              onClick={toggleSidebar}
              className="p-2 md:hidden rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <Menu size={18} />
            </button>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
