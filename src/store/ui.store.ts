import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UIState {
  darkMode: boolean;

  // sidebar state
  sidebarOpen: boolean; // mobile
  sidebarCollapsed: boolean; // desktop

  toggleTheme: () => void;
  toggleSidebar: () => void;
  toggleCollapse: () => void;
}

export const useUIStore = create(
  persist<UIState>(
    (set) => ({
      darkMode: false,

      sidebarOpen: false,
      sidebarCollapsed: false,

      toggleTheme: () =>
        set((state) => ({
          darkMode: !state.darkMode,
        })),

      toggleSidebar: () =>
        set((state) => ({
          sidebarOpen: !state.sidebarOpen,
        })),

      toggleCollapse: () =>
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        })),
    }),
    {
      name: "ui-state-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
