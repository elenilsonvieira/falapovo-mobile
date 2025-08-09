import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";


interface User {
  id: string;
  email: string | null;      
  name?: string;
  isAdmin?: boolean; 
  photoUri?: string;
  isAnonymous?: boolean;     
}



interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void; 
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("sgi_user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to load user from AsyncStorage", error);
        await AsyncStorage.removeItem("sgi_user");
      } finally {
        setIsLoadingAuth(false);
      }
    };

    loadStoredUser();
  }, []);

  const login = async (userData: User) => {
    setUser(userData);
    try {
      await AsyncStorage.setItem("sgi_user", JSON.stringify(userData));
    } catch (error) {
      console.error("Failed to save user to AsyncStorage", error);
    }
  };

  const logout = async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem("sgi_user");
    } catch (error) {
      console.error("Failed to remove user from AsyncStorage", error);
    }
  };

  
  const updateUser = async (updatedData: Partial<User>) => {
    if (!user) return;
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    await AsyncStorage.setItem("sgi_user", JSON.stringify(newUser));
  };

  const isAuthenticated = !!user;

  return (
    
    <AuthContext.Provider value={{ user, login, logout, updateUser, isAuthenticated, isLoadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
