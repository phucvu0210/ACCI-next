import { create } from 'zustand';

interface NhanVien {
  maNV: number;
  hoTen: string;
  sdt: string;
  email: string;
  matKhau: string;
  ngaySinh: Date;
  diaChi: string;
  chucVu: string;
}

interface AuthState {
  user: NhanVien | null;
  setUser: (user: NhanVien) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));