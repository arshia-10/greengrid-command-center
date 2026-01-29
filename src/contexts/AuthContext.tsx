import { createContext, useContext, useEffect, useState, ReactNode, startTransition } from "react";
import { auth } from "@/firebase";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

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
  // Activity tracking - real user metrics only
  simulationsRun?: number;
  reportsSubmitted?: number;
  totalImpactScore?: number;
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

  // Load profile from localStorage and Firestore
  const loadProfile = async (uid: string) => {
    try {
      // First try to load from Firestore
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const firestoreData = docSnap.data();
        const profile = {
          name: firestoreData.name || "",
          email: firestoreData.email || "",
          organization: firestoreData.organization || "",
          intent: firestoreData.intent || "",
          role: firestoreData.role || "",
          region: firestoreData.region || "",
          campus: firestoreData.campus || "",
          aadhaar: firestoreData.aadhaar || "",
          pan: firestoreData.pan || "",
          simulationsRun: firestoreData.simulationsRun ?? 0,
          reportsSubmitted: firestoreData.reportsSubmitted ?? 0,
          totalImpactScore: firestoreData.totalImpactScore ?? 0,
        };
        setProfile(profile);
        // Update localStorage with latest Firestore data
        try {
          localStorage.setItem("greengrid_user_profile", JSON.stringify(profile));
        } catch (error) {
          console.error("Failed to update localStorage:", error);
        }
      } else {
        // Fallback to localStorage
        const stored = localStorage.getItem("greengrid_user_profile");
        if (stored) {
          setProfile(JSON.parse(stored));
        }
      }
    } catch (error) {
      console.error("Failed to load profile from Firestore:", error);
      // Fallback to localStorage
      try {
        const stored = localStorage.getItem("greengrid_user_profile");
        if (stored) {
          setProfile(JSON.parse(stored));
        }
      } catch (localError) {
        console.error("Failed to load profile from localStorage:", localError);
      }
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
      startTransition(async () => {
        setUser(currentUser);
        if (currentUser) {
          await loadProfile(currentUser.uid);
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
