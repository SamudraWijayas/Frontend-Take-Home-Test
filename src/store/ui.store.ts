import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UIState {
  darkMode: boolean;
  isSidebarCollapsed: boolean;
  toggleTheme: () => void;
  toggleSidebar: () => void;
}

export const useUIStore = create(
  persist<UIState>(
    (set) => ({
      darkMode: false,
      isSidebarCollapsed: false,
      toggleTheme: () =>
        set((state) => ({
          darkMode: !state.darkMode,
        })),
      toggleSidebar: () =>
        set((state) => ({
          isSidebarCollapsed: !state.isSidebarCollapsed,
        })),
    }),
    {
      name: "ui-state-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
