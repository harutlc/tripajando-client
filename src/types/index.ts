export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  email_verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export interface Trip {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'current' | 'archived';
  description?: string;
  destination?: string;
  createdAt?: string;
  updatedAt?: string;
}
