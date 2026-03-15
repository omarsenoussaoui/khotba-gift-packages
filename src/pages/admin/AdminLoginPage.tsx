import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAdminStore } from '@/store/adminStore';
import { KeyRound } from 'lucide-react';

const AdminLoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAdminStore(s => s.login);
  const isAuthenticated = useAdminStore(s => s.isAuthenticated);
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Already authenticated
  if (isAuthenticated) {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;

    setLoading(true);
    setError('');

    const success = await login(key.trim());
    if (success) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      setError(t('admin.login.error'));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[hsl(349,57%,27%)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-[hsl(349,57%,27%)]">{t('admin.brand')}</h1>
            <p className="text-sm text-gray-500 mt-1">{t('admin.subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t('admin.login.label')}
              </label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={key}
                  onChange={e => { setKey(e.target.value); setError(''); }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[hsl(42,65%,55%)]/40 focus:border-[hsl(42,65%,55%)] transition-all"
                  placeholder={t('admin.login.placeholder')}
                  autoFocus
                />
              </div>
              {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[hsl(42,65%,55%)] text-white font-medium rounded-xl hover:bg-[hsl(42,65%,50%)] transition-colors disabled:opacity-50"
            >
              {loading ? t('admin.login.loading') : t('admin.login.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
