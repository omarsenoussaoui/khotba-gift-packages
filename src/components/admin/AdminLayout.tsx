import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LayoutDashboard, ClipboardList, Gift, LogOut, Menu, Languages } from 'lucide-react';
import { useAdminStore } from '@/store/adminStore';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const logout = useAdminStore(s => s.logout);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAr = i18n.language === 'ar';

  const navItems = [
    { path: '/admin/dashboard', label: t('admin.nav.dashboard'), icon: LayoutDashboard },
    { path: '/admin/orders', label: t('admin.nav.orders'), icon: ClipboardList },
    { path: '/admin/packages', label: t('admin.nav.packages'), icon: Gift },
  ];

  const toggleLang = () => {
    const newLang = isAr ? 'fr' : 'ar';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="flex min-h-screen bg-gray-50" dir="ltr">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[hsl(349,57%,27%)] text-white flex flex-col transform transition-transform duration-200 lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="p-6 border-b border-white/10">
          <h1 className="font-serif text-xl text-[hsl(42,65%,55%)]">{t('admin.brand')}</h1>
          <p className="text-xs text-white/50 mt-1">{t('admin.subtitle')}</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-white/10 text-[hsl(42,65%,55%)]'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Language + Logout */}
        <div className="p-4 border-t border-white/10 space-y-1">
          <button
            onClick={toggleLang}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors w-full"
          >
            <Languages size={18} />
            <span>{isAr ? 'Français' : 'العربية'}</span>
          </button>
          <Link
            to="/admin"
            onClick={() => { logout(); setSidebarOpen(false); }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            <span>{t('admin.logout')}</span>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden bg-white border-b px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={20} />
          </button>
          <span className="font-serif text-lg text-[hsl(349,57%,27%)]">{t('admin.brand')}</span>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
