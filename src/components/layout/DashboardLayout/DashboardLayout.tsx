"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import {
  Sun,
  Moon,
  Menu,
  SidebarClose,
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  Bell,
} from "lucide-react";
import { useUIStore } from "@/store/ui.store";
import { usePathname } from "next/navigation";

interface Props {
  children: ReactNode;
  title?: string;
}

const DashboardLayout = ({ children, title = "Dashboard" }: Props) => {
  const pathname = usePathname();

  const { darkMode, isSidebarCollapsed, toggleTheme, toggleSidebar } =
    useUIStore();

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Invoices",
      href: "/invoices",
      icon: FileText,
    },
    {
      name: "Customers",
      href: "/customers",
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-950">
      {/* SIDEBAR */}
      <aside
        className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm transition-all duration-300 flex flex-col ${
          isSidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* LOGO */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200 dark:border-gray-800">
          <span className="font-bold text-lg">
            {isSidebarCollapsed ? "SB" : "SaaS Billing"}
          </span>
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
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                ${
                  active
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/40"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Icon size={18} />

                {!isSidebarCollapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER */}
        {!isSidebarCollapsed && (
          <div className="p-4 border-t border-gray-200   dark:border-gray-800 text-xs text-gray-500">
            SaaS Billing v1.0
          </div>
        )}
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* NAVBAR */}
        <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isSidebarCollapsed ? (
                <SidebarClose size={18} />
              ) : (
                <Menu size={18} />
              )}
            </button>

            <h1 className="font-semibold text-lg">{title}</h1>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {/* THEME */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* NOTIFICATION */}
            <button className="relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              <Bell size={18} />

              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* USER */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-indigo-600" />

              <span className="hidden md:block text-sm font-medium">Admin</span>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
