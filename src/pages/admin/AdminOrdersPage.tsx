import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { adminApi, type AdminOrderListItem } from '@/services/api';
import { useWilayas } from '@/hooks/usePackages';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';

const statusColors: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-800',
  PaymentVerified: 'bg-blue-100 text-blue-800',
  Confirmed: 'bg-indigo-100 text-indigo-800',
  Preparing: 'bg-purple-100 text-purple-800',
  Shipped: 'bg-cyan-100 text-cyan-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

const statusKeys = ['Pending', 'PaymentVerified', 'Confirmed', 'Preparing', 'Shipped', 'Delivered', 'Cancelled'];

function formatDA(amount: number) {
  return amount.toLocaleString('fr-FR') + ' DA';
}

function formatDate(dateStr: string, locale: string) {
  const d = new Date(dateStr);
  const loc = locale === 'ar' ? 'ar-DZ' : 'fr-FR';
  return d.toLocaleDateString(loc, { day: 'numeric', month: 'short', year: 'numeric' }) +
    ', ' + d.toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' });
}

const LIMIT = 20;

const AdminOrdersPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isAr = i18n.language === 'ar';
  const [status, setStatus] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data: wilayasList = [] } = useWilayas();

  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (wilaya) params.set('wilaya', wilaya);
  if (search) params.set('search', search);
  params.set('page', String(page));
  params.set('limit', String(LIMIT));

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'orders', status, wilaya, search, page],
    queryFn: () => adminApi.getOrders(params.toString()),
  });

  const orders = data?.orders ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / LIMIT);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-serif text-gray-900">{t('admin.orders.title')}</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select
            value={status}
            onChange={e => { setStatus(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(42,65%,55%)]/40"
          >
            <option value="">{t('admin.orders.filterAll')}</option>
            {statusKeys.map(key => (
              <option key={key} value={key}>{t(`admin.status.${key}`)}</option>
            ))}
          </select>

          <select
            value={wilaya}
            onChange={e => { setWilaya(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[hsl(42,65%,55%)]/40"
          >
            <option value="">{t('admin.orders.allWilayas')}</option>
            {wilayasList.map(w => (
              <option key={w.code} value={w.code}>{w.code} - {isAr ? w.nameAr : w.nameFr}</option>
            ))}
          </select>

          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder={t('admin.orders.searchPlaceholder')}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(42,65%,55%)]/40"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b bg-gray-50">
                <th className="px-4 py-3 font-medium">{t('admin.orders.colOrderNumber')}</th>
                <th className="px-4 py-3 font-medium">{t('admin.orders.colClient')}</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">{t('admin.orders.colPhone')}</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">{t('admin.orders.colPackage')}</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">{t('admin.orders.colWilaya')}</th>
                <th className="px-4 py-3 font-medium">{t('admin.orders.colTotal')}</th>
                <th className="px-4 py-3 font-medium">{t('admin.orders.colStatus')}</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">{t('admin.orders.colDate')}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">{t('admin.orders.loading')}</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">{t('admin.orders.noResults')}</td></tr>
              ) : (
                orders.map((order: AdminOrderListItem) => (
                  <tr
                    key={order.id}
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                    className="border-b last:border-0 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                    <td className="px-4 py-3">{order.customerName}</td>
                    <td className="px-4 py-3 hidden md:table-cell tabular-nums" dir="ltr">{order.customerPhone}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">{order.packageName}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">{order.wilaya}</td>
                    <td className="px-4 py-3 tabular-nums font-medium">{formatDA(order.totalPrice)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status] || 'bg-gray-100'}`}>
                        {t(`admin.status.${order.status}`, order.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-500">{formatDate(order.createdAt, i18n.language)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else if (page <= 4) {
                pageNum = i + 1;
              } else if (page >= totalPages - 3) {
                pageNum = totalPages - 6 + i;
              } else {
                pageNum = page - 3 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium ${
                    page === pageNum
                      ? 'bg-[hsl(349,57%,27%)] text-white'
                      : 'border hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrdersPage;
