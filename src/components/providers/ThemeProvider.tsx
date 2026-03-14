"use client";

import { useLayoutEffect } from "react";
import { useUIStore } from "@/store/ui.store";

interface Props {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: Props) {
  const darkMode = useUIStore((state) => state.darkMode);

  useLayoutEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  return <>{children}</>;
}
