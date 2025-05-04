
export type UserRole = 'student' | 'faculty' | 'admin' | 'developer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  college: string;
  department?: string;
  createdAt: string;
  lastActive?: string;
  verified?: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
