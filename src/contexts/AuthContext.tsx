import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthState, User } from "@/types/auth";
import { useToast } from "@/components/ui/use-toast";

// Mock user data - in a real app, this would come from your backend
const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Krishna Bhardwaj",
    email: "krishna.bhardwaj@university.edu",
    role: "student",
    avatar: "https://ui-avatars.com/api/?name=Krishna+Bhardwaj",
    college: "College of Engineering",
    department: "Computer Science",
    createdAt: new Date().toISOString(),
    verified: true,
  },
  {
    id: "2",
    name: "Great Guruji",
    email: "great.guruji@university.edu",
    role: "faculty",
    avatar: "https://ui-avatars.com/api/?name=Great+Guruji",
    college: "College of Arts and Sciences",
    department: "Mathematics",
    createdAt: new Date().toISOString(),
    verified: true,
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@university.edu",
    role: "admin",
    avatar: "https://ui-avatars.com/api/?name=Admin+User",
    college: "University Administration",
    createdAt: new Date().toISOString(),
    verified: true,
  },
  {
    id: "4",
    name: "Dev Kumar",
    email: "dev.kumar@university.edu",
    role: "developer",
    avatar: "https://ui-avatars.com/api/?name=Dev+Kumar",
    college: "IT Department",
    department: "Software Development",
    createdAt: new Date().toISOString(),
    verified: true,
  },
];

interface AuthContextProps {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<boolean>;
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextProps>({
  authState: initialAuthState,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  verifyEmail: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in (e.g., from localStorage)
    const storedUser = localStorage.getItem("campusConnectUser");
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          isAuthenticated: true,
          user,
          isLoading: false,
          error: null,
        });
      } catch (err) {
        localStorage.removeItem("campusConnectUser");
        setAuthState({
          ...initialAuthState,
          isLoading: false,
        });
      }
    } else {
      setAuthState({
        ...initialAuthState,
        isLoading: false,
      });
    }
    
    // Load any pending users from localStorage
    const storedPendingUsers = localStorage.getItem("campusConnectPendingUsers");
    if (storedPendingUsers) {
      try {
        setPendingUsers(JSON.parse(storedPendingUsers));
      } catch (err) {
        localStorage.removeItem("campusConnectPendingUsers");
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      // In a real application, this would be an API call to your backend
      // Simulating API request with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // First check if the user is in the pending users list
      const pendingUser = pendingUsers.find((u) => u.email === email);
      
      // Find user by email (in a real app, the backend would handle authentication)
      const user = [...MOCK_USERS, ...pendingUsers].find((u) => u.email === email);
      
      if (!user) {
        throw new Error("Invalid email or password");
      }
      
      // Check if the user is verified
      if (pendingUser && !pendingUser.verified) {
        throw new Error("Please verify your email before logging in");
      }
      
      // Mock password check - just for simulation (NEVER do this in real apps)
      if (password !== "password") {
        throw new Error("Invalid email or password");
      }

      // Update user last active time
      const updatedUser = {
        ...user,
        lastActive: new Date().toISOString(),
      };

      // Store user in localStorage (in a real app, you'd store a JWT token)
      localStorage.setItem("campusConnectUser", JSON.stringify(updatedUser));
      
      setAuthState({
        isAuthenticated: true,
        user: updatedUser,
        isLoading: false,
        error: null,
      });

      toast({
        title: "Login successful",
        description: `Welcome back, ${updatedUser.name}!`,
      });
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }));

      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    setAuthState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      // In a real application, this would be an API call to your backend
      // Simulating API request with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Check if email already exists
      if ([...MOCK_USERS, ...pendingUsers].some((u) => u.email === email)) {
        throw new Error("Email already in use");
      }
      
      // Create a new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        name,
        email,
        role: "student", // Default role for new users
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
        college: "Not specified",
        department: "Not specified",
        createdAt: new Date().toISOString(),
        verified: false, // Requires email verification
      };
      
      // Add to pending users
      const updatedPendingUsers = [...pendingUsers, newUser];
      setPendingUsers(updatedPendingUsers);
      
      // Store in localStorage
      localStorage.setItem("campusConnectPendingUsers", JSON.stringify(updatedPendingUsers));
      
      // In a real app, you would send a verification email here
      // Simulate sending verification email
      console.log(`Sending verification email to ${email} with token: ${newUser.id}`);
      
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
      }));

      toast({
        title: "Sign up successful",
        description: "Please check your email to verify your account",
      });
      
      // We don't return newUser anymore to match the Promise<void> type
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      }));

      toast({
        title: "Sign up failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      
      throw error;
    }
  };

  const verifyEmail = async (token: string) => {
    try {
      // In a real app, this would verify the token with your backend
      // For now, we'll just look up the user by ID (which we're using as the token)
      const userIndex = pendingUsers.findIndex((u) => u.id === token);
      
      if (userIndex === -1) {
        toast({
          title: "Verification failed",
          description: "Invalid or expired verification link",
          variant: "destructive",
        });
        return false;
      }
      
      // Update the user's verification status
      const updatedPendingUsers = [...pendingUsers];
      updatedPendingUsers[userIndex] = {
        ...updatedPendingUsers[userIndex],
        verified: true,
      };
      
      setPendingUsers(updatedPendingUsers);
      localStorage.setItem("campusConnectPendingUsers", JSON.stringify(updatedPendingUsers));
      
      toast({
        title: "Email verified",
        description: "Your email has been successfully verified. You can now log in.",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "An error occurred during verification",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("campusConnectUser");
    
    setAuthState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      error: null,
    });

    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider value={{ authState, login, signup, logout, verifyEmail }}>
      {children}
    </AuthContext.Provider>
  );
};
