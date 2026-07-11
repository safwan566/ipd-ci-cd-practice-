'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Home, Briefcase, UsersRound, Newspaper, Award, BookOpen, FileText, Layers, MessageSquare, Building2, HeartHandshake, Users } from 'lucide-react';
import { useSidebar } from '@/contexts/SidebarContext';
import { useUser } from '@/contexts/UserContext';
import styles from './Sidebar.module.css';

interface NavItem {
  id: number;
  name: string;
  href: string;
  icon: React.ElementType;
  requiredPermissions?: string[];
}

const navItems: NavItem[] = [
  { id: 1, name: 'Workspace', href: '/dashboard', icon: Home },
  { id: 2, name: 'Staff', href: '/dashboard/staff', icon: Users, requiredPermissions: ['users:list', 'users:read'] },
  { id: 3, name: 'Patients', href: '/dashboard/patients', icon: UsersRound, requiredPermissions: ['patients:list', 'patients:read'] },
  { id: 4, name: 'Appointments', href: '/dashboard/appointments', icon: Briefcase, requiredPermissions: ['appointments:list', 'appointments:read'] },
  { id: 5, name: 'Reports', href: '/dashboard/reports', icon: Newspaper },
  { id: 6, name: 'Tasks', href: '/dashboard/tasks', icon: Award },
  { id: 7, name: 'Lab Tests', href: '/dashboard/lab-tests', icon: BookOpen, requiredPermissions: ['lab_tests:list', 'lab_tests:read'] },
  { id: 8, name: 'Medications', href: '/dashboard/medications', icon: FileText, requiredPermissions: ['prescriptions:list', 'prescriptions:read'] },
  { id: 9, name: 'Documents', href: '/dashboard/documents', icon: Layers },
  { id: 10, name: 'Messages', href: '/dashboard/messages', icon: MessageSquare, requiredPermissions: ['notifications:list', 'notifications:read'] },
  { id: 11, name: 'Consultations', href: '/dashboard/consultations', icon: Building2 },
];

const Sidebar: React.FC = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebar();
  const { profile } = useUser();
  const router = useRouter();
  const pathName = usePathname();

  const userPermissions = useMemo(() => profile?.permissions || [], [profile]);

  const hasPermission = (requiredPermissions?: string[]): boolean => {
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }
    return requiredPermissions.some(permission => userPermissions.includes(permission));
  };

  const filteredNavItems = useMemo(() => {
    return navItems.filter(item => hasPermission(item.requiredPermissions));
  }, [userPermissions]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('profile');
    router.push('/auth/login');
  };

  const renderLinks = (items: NavItem[]) => {
    return items.map((item) => {
      const Icon = item.icon;
      const isActive = pathName === item.href;

      return (
        <div key={item.id} className={styles.linkWrapper}>
          <Link
            href={item.href}
            className={`${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            <Icon className="w-5 h-5 z-10" />
            <span className="text-sm font-medium z-10">{item.name}</span>
          </Link>
          {isActive && (
            <>
              <div className={styles.topCurve}></div>
              <div className={styles.bottomCurve}></div>
            </>
          )}
        </div>
      );
    });
  };

  return (
    <>
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : styles.closed}`}>
        {/* Logo */}
        <div className="p-6 mb-2 flex items-center flex-shrink-0">
          <Link className='flex items-center' href="/dashboard">
            <div className="bg-black p-1.5 rounded-lg mr-2">
              <HeartHandshake className="w-5 h-5 text-white" />
            </div>
            <span className="text-black text-xl font-bold tracking-tight">SmartCare</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className={styles.navContainer}>
          <div className="mb-4">
            <h3 className={styles.sectionTitle}>GENERAL</h3>
            <div className="flex flex-col">
              {renderLinks(filteredNavItems.slice(0, 5))}
            </div>
          </div>

          {filteredNavItems.length > 5 && (
            <div className="mb-4">
              <h3 className={styles.sectionTitle}>CLINICAL DATA</h3>
              <div className="flex flex-col">
                {renderLinks(filteredNavItems.slice(5))}
              </div>
            </div>
          )}
        </nav>

        {/* Logout */}
        <div className="p-4 mt-auto">
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 md:hidden" onClick={toggleSidebar} />
      )}
    </>
  );
};

export default Sidebar;