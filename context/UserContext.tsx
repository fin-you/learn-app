'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  fullName: string;
  phone: string;
  avatarUrl: string;
  role: string;
}

const DEFAULT_USER: UserProfile = {
  fullName: 'Ahmad Test',
  phone: '081234567890',
  avatarUrl: '',
  role: 'Buyer',
};

const STORAGE_KEY = 'jastip_user_profile';

interface UserContextType {
  user: UserProfile;
  updateUser: (newData: Partial<UserProfile>) => void;
  isLoaded: boolean;
}

const UserContext = createContext<UserContextType>({
  user: DEFAULT_USER,
  updateUser: () => {},
  isLoaded: false,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load data from localStorage on mount
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setUser((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.error('Failed to load user profile from localStorage', e);
    } finally {
      setIsLoaded(true);
    }

    // Listen to storage events from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setUser((prev) => ({ ...prev, ...parsed }));
        } catch (err) {
          console.error('Failed to parse storage update', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateUser = (newData: Partial<UserProfile>) => {
    setUser((prev) => {
      const updated = { ...prev, ...newData };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save user profile to localStorage', e);
      }
      return updated;
    });
  };

  return (
    <UserContext.Provider value={{ user, updateUser, isLoaded }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
