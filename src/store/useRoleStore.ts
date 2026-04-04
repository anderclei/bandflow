import { create } from 'zustand';

export type UserRole = 'ADMIN' | 'PRODUCER' | 'MUSICIAN' | 'MERCH_SELLER' | 'ROADIE' | 'FINANCIAL';

interface RoleState {
    currentRole: UserRole;
    setRole: (role: UserRole) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
    currentRole: 'ADMIN', // Default to ADMIN for development convenience
    setRole: (role) => set({ currentRole: role }),
}));
