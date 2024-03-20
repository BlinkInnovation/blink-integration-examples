import { create } from "zustand";

export const useAccessTokenStore = create((set) => ({
    accessToken: "",
    setAccessToken: (token) => set({ accessToken: token }),
}));