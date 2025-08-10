import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator';
  photo?: string;
}

interface Store {
  id: string;
  name: string;
  logo?: string;
}

interface StoreContextType {
  currentUser: User | null;
  currentStore: Store;
  setCurrentUser: (user: User | null) => void;
  updateStore: (store: Partial<Store>) => void;
  isLoggedIn: boolean;
}

const defaultStore: Store = {
  id: '1',
  name: 'SUA LOJA',
  logo: undefined,
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentStore, setCurrentStore] = useState<Store>(defaultStore);

  const updateStore = (storeUpdate: Partial<Store>) => {
    setCurrentStore(prev => ({ ...prev, ...storeUpdate }));
  };

  const isLoggedIn = currentUser !== null;

  return (
    <StoreContext.Provider value={{
      currentUser,
      currentStore,
      setCurrentUser,
      updateStore,
      isLoggedIn,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}