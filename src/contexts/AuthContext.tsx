
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthState, User } from "@/types/auth";
import { useToast } from "@/components/ui/use-toast";

// Mock user data - in a real app, this would come from your backend
const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@university.edu",
    role: "student",
    avatar: "https://ui-avatars.com/api/?name=John+Doe",
    college: "College of Engineering",
    department: "Computer Science",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@university.edu",
    role: "faculty",
    avatar: "https://ui-avatars.com/api/?name=Jane+Smith",
    college: "College of Arts and Sciences",
    department: "Mathematics",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@university.edu",
    role: "admin",
    avatar: "https://ui-avatars.com/api/?name=Admin+User",
    college: "University Administration",
    createdAt: new Date().toISOString(),
  },
];

interface AuthContextProps {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
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
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
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
      
      // Find user by email (in a real app, the backend would handle authentication)
      const user = MOCK_USERS.find((u) => u.email === email);
      
      if (!user) {
        throw new Error("Invalid email or password");
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
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
