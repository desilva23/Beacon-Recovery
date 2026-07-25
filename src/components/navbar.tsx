'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { HeartPulse, ShieldCheck, BookOpen, BookOpenCheck, Home, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const patientNav = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/patient', label: 'SOS', icon: HeartPulse },
  { href: '/journal', label: 'Journal', icon: BookOpen },
  { href: '/resources', label: 'Resources', icon: BookOpenCheck },
];

const caregiverNav = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/caregiver', label: 'Dashboard', icon: ShieldCheck },
  { href: '/resources', label: 'Resources', icon: BookOpenCheck },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const isAuthPage = pathname === '/login' || pathname === '/register';

  useEffect(() => {
    if (isAuthPage) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setRole(user?.user_metadata?.role ?? 'patient');
    });
  }, [isAuthPage]);

  if (isAuthPage) return null;

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const navItems = role === 'caregiver' ? caregiverNav : patientNav;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t-2 border-slate-100 dark:border-slate-800 shadow-lg">
      <div className="max-w-2xl mx-auto flex items-center justify-around px-2 py-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors min-w-[52px] ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50'
                  : 'text-slate-500 dark:text-slate-400 hover:text-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : ''}`} />
              <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>{label}</span>
            </Link>
          );
        })}
        <button
          onClick={handleSignOut}
          className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors min-w-[52px] text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
          title="Sign out"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-xs font-medium">Sign Out</span>
        </button>
      </div>
    </nav>
  );
}

