import { createContext, useContext, useEffect, useState, ReactNode, startTransition } from "react";
import { auth } from "@/firebase";

interface User {
  uid: string;
  email: string | null;
  emailVerified: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  organization?: string;
  intent?: string;
  role?: string;
  region?: string;
  campus?: string;
  aadhaar?: string;
  pan?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  updateProfile: (profile: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load profile from localStorage
  const loadProfile = () => {
    try {
      const stored = localStorage.getItem("greengrid_user_profile");
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  };

  // Update profile function
  const updateProfile = (newProfile: Partial<UserProfile>) => {
    const updated = { ...profile, ...newProfile } as UserProfile;
    setProfile(updated);
    try {
      localStorage.setItem("greengrid_user_profile", JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to save profile:", error);
    }
  };

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      // Use startTransition to wrap state updates (fixes React Router warning)
      startTransition(() => {
        setUser(currentUser);
        if (currentUser) {
          loadProfile();
        } else {
          setProfile(null);
        }
        setLoading(false);
      });
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAuthenticated: !!user, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
