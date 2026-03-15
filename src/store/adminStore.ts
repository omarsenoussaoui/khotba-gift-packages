import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { adminApi } from '@/services/api';

interface AdminState {
  adminKey: string | null;
  isAuthenticated: boolean;
  login: (key: string) => Promise<boolean>;
  logout: () => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      adminKey: null,
      isAuthenticated: false,
      login: async (key: string) => {
        const valid = await adminApi.validateKey(key);
        if (valid) {
          set({ adminKey: key, isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ adminKey: null, isAuthenticated: false }),
    }),
    {
      name: 'admin-auth',
      partialize: (state) => ({ adminKey: state.adminKey, isAuthenticated: state.isAuthenticated }),
    }
  )
);
