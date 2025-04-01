import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  isLoggedIn: boolean,
  logout: () => void;
  
}

const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isLoggedIn: false,
  setAccessToken: (token) => set({ accessToken: token, isLoggedIn:true}),
  logout: () => set({ accessToken: null, isLoggedIn: false }),
}));

export default useAuthStore;

export const updateTokenFromStore = () => {
  const currentAccessToken = useAuthStore.getState().accessToken;
  return currentAccessToken;
};
