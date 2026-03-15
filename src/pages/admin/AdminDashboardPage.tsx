import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { adminApi, type OrderStatsResponse, type AdminOrderListItem } from '@/services/api';
import { Package, CalendarDays, TrendingUp, DollarSign, Wallet } from 'lucide-react';
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

const statusLabels: Record<string, string> = {
  Pending: 'En attente',
  PaymentVerified: 'Paiement vérifié',
  Confirmed: 'Confirmée',
  Preparing: 'En préparation',
  Shipped: 'Expédiée',
  Delivered: 'Livrée',
  Cancelled: 'Annulée',
};

function formatDA(amount: number) {
  return amount.toLocaleString('fr-FR') + ' DA';
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ', ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading } = useQuery<OrderStatsResponse>({
    queryKey: ['admin', 'stats'],
    queryFn: adminApi.getStats,
    refetchInterval: 30000,
  });

  const statCards = [
    { label: 'Commandes totales', value: stats?.totalOrders ?? 0, icon: Package, format: (v: number) => String(v) },
    { label: "Aujourd'hui", value: stats?.ordersToday ?? 0, icon: CalendarDays, format: (v: number) => String(v) },
    { label: 'Ce mois', value: stats?.ordersThisMonth ?? 0, icon: TrendingUp, format: (v: number) => String(v) },
    { label: 'Revenu ce mois', value: stats?.revenueThisMonth ?? 0, icon: DollarSign, format: formatDA },
    { label: 'Revenu total', value: stats?.revenueTotal ?? 0, icon: Wallet, format: formatDA },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-serif text-gray-900">Tableau de bord</h1>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map(card => (
            <div key={card.label} className="bg-white rounded-xl border p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">{card.label}</span>
                <card.icon size={16} className="text-gray-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900 tabular-nums">
                {isLoading ? '...' : card.format(card.value)}
              </p>
            </div>
          ))}
        </div>

        {/* Orders by status */}
        <div className="bg-white rounded-xl border p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Commandes par statut</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(stats?.ordersByStatus ?? {}).map(([status, count]) => (
              <span
                key={status}
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}
              >
                {statusLabels[status] || status}: {count}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular packages */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Coffrets populaires</h2>
            {(stats?.popularPackages?.length ?? 0) > 0 ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-2">Coffret</th>
                    <th className="pb-2 text-right">Commandes</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.popularPackages.map(p => (
                    <tr key={p.packageName} className="border-b last:border-0">
                      <td className="py-2.5">{p.packageName}</td>
                      <td className="py-2.5 text-right tabular-nums font-medium">{p.orderCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-400 text-sm">Aucune commande encore.</p>
            )}
          </div>

          {/* Recent orders */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Commandes récentes</h2>
            {(stats?.recentOrders?.length ?? 0) > 0 ? (
              <div className="space-y-0">
                {stats?.recentOrders.map((order: AdminOrderListItem) => (
                  <div
                    key={order.id}
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                    className="flex items-center justify-between py-2.5 border-b last:border-0 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium">{order.orderNumber}</p>
                      <p className="text-xs text-gray-500">{order.customerName} — {order.packageName}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status] || 'bg-gray-100'}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Aucune commande encore.</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
