'use client';

import { createContext, useContext } from 'react';

export interface UserData {
  name: string;
  email: string;
  status: string;
}

export interface UserContextType {
  user: UserData | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
});

export const useUser = () => useContext(UserContext);
