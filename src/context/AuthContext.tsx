import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, ProfileResponse } from "@/api/auth";
import { tenantsApi, Tenant } from "@/api/tenants";

interface AuthContextType {
  user: ProfileResponse | null;
  tenant: Tenant | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ProfileResponse | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserAndTenant = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      const userProfile = await authApi.getProfile();
      setUser(userProfile);

      const tenantData = await tenantsApi.getMe();
      setTenant(tenantData);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      localStorage.removeItem("access_token");
      setUser(null);
      setTenant(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndTenant();
  }, []);

  const login = async (token: string) => {
    localStorage.setItem("access_token", token);
    await fetchUserAndTenant();
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    setTenant(null);
  };

  const refreshUser = async () => {
    await fetchUserAndTenant();
  };

  return (
    <AuthContext.Provider value={{ user, tenant, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
