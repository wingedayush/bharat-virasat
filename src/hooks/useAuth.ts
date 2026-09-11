import { useState, useEffect } from 'react';

export type UserRole = 'student_innovator' | 'heritage_scholar' | 'cultural_explorer' | 'artisan_patron';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  college?: string;
  studentId?: string;
  avatar: string;
  badges: string[];
  innovationsCount: number;
  sanctumsVisited: number;
  joinedDate: string;
}

const STORAGE_KEY = 'bharat_virasat_auth_user';

const DEMO_STUDENT: UserProfile = {
  id: 'usr_student_01',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@iitd.ac.in',
  role: 'student_innovator',
  college: 'Indian Institute of Technology, Delhi',
  studentId: '2024CSB1042',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
  badges: ['UNESCO Scholar 🏛️', 'Student Innovator 🚀', 'Ancient Physics Ace ⚡', 'Heritage Guardian 🪔'],
  innovationsCount: 3,
  sanctumsVisited: 14,
  joinedDate: 'September 2024'
};

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Keep state synchronized with storage events
  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        setUser(saved ? JSON.parse(saved) : null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const saveUser = (u: UserProfile | null) => {
    if (u) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    setUser(u);
    // Dispatch custom event for same-window updates
    window.dispatchEvent(new Event('auth_state_changed'));
  };

  useEffect(() => {
    const handleAuthChange = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        setUser(saved ? JSON.parse(saved) : null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener('auth_state_changed', handleAuthChange);
    return () => window.removeEventListener('auth_state_changed', handleAuthChange);
  }, []);

  const loginWithDemo = (role: 'student' | 'scholar' = 'student') => {
    if (role === 'student') {
      saveUser(DEMO_STUDENT);
    } else {
      saveUser({
        id: 'usr_scholar_02',
        name: 'Dr. Meera Nambiar',
        email: 'meera.nambiar@asi.gov.in',
        role: 'heritage_scholar',
        college: 'Archaeological Survey of India / JNU',
        studentId: 'ASI-DIR-882',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80',
        badges: ['ASI Senior Epigraphist 📜', 'Dravidian Architecture Expert 🏛️', 'UNESCO Delegate 🌍'],
        innovationsCount: 8,
        sanctumsVisited: 32,
        joinedDate: 'August 2024'
      });
    }
  };

  const login = (email: string, _password?: string) => {
    const defaultProfile: UserProfile = {
      id: 'usr_' + Date.now().toString(36),
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      role: 'student_innovator',
      college: 'Student Innovation Cell, India',
      studentId: 'INNOV-' + Math.floor(1000 + Math.random() * 9000),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
      badges: ['Heritage Pioneer 🪔', 'Student Explorer 🎓'],
      innovationsCount: 1,
      sanctumsVisited: 5,
      joinedDate: 'September 2024'
    };
    saveUser(defaultProfile);
  };

  const register = (data: {
    name: string;
    email: string;
    role: UserRole;
    college?: string;
    studentId?: string;
  }) => {
    const newProfile: UserProfile = {
      id: 'usr_' + Date.now().toString(36),
      name: data.name,
      email: data.email,
      role: data.role,
      college: data.college || 'National Student Innovation Network',
      studentId: data.studentId || 'INNOV-' + Math.floor(1000 + Math.random() * 9000),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
      badges: ['Student Innovator 🚀', 'Virasat Explorer 🪔'],
      innovationsCount: 1,
      sanctumsVisited: 3,
      joinedDate: 'September 2024'
    };
    saveUser(newProfile);
  };

  const logout = () => {
    saveUser(null);
  };

  const updateProfile = (partial: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...partial };
    saveUser(updated);
  };

  return {
    user,
    isLoggedIn: !!user,
    login,
    register,
    loginWithDemo,
    logout,
    updateProfile
  };
}
