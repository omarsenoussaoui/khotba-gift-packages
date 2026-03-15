import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { adminApi, type AdminOrderDetail } from '@/services/api';
import { ArrowLeft, Phone, Star } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const statusColors: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-800',
  PaymentVerified: 'bg-blue-100 text-blue-800',
  Confirmed: 'bg-indigo-100 text-indigo-800',
  Preparing: 'bg-purple-100 text-purple-800',
  Shipped: 'bg-cyan-100 text-cyan-800',
  Delivered: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
};

interface StatusAction {
  labelKey: string;
  status: string;
  variant: 'green' | 'red' | 'blue';
}

const statusActions: Record<string, StatusAction[]> = {
  Pending: [
    { labelKey: 'admin.actions.verifyPayment', status: 'PaymentVerified', variant: 'green' },
    { labelKey: 'admin.actions.cancelOrder', status: 'Cancelled', variant: 'red' },
  ],
  PaymentVerified: [
    { labelKey: 'admin.actions.confirmOrder', status: 'Confirmed', variant: 'green' },
    { labelKey: 'admin.actions.cancelOrder', status: 'Cancelled', variant: 'red' },
  ],
  Confirmed: [
    { labelKey: 'admin.actions.startPreparing', status: 'Preparing', variant: 'blue' },
    { labelKey: 'admin.actions.cancelOrder', status: 'Cancelled', variant: 'red' },
  ],
  Preparing: [
    { labelKey: 'admin.actions.markShipped', status: 'Shipped', variant: 'blue' },
    { labelKey: 'admin.actions.cancelOrder', status: 'Cancelled', variant: 'red' },
  ],
  Shipped: [
    { labelKey: 'admin.actions.markDelivered', status: 'Delivered', variant: 'green' },
  ],
};

const actionStyles: Record<string, string> = {
  green: 'bg-green-600 hover:bg-green-700 text-white',
  red: 'bg-red-600 hover:bg-red-700 text-white',
  blue: 'bg-blue-600 hover:bg-blue-700 text-white',
};

function formatDA(amount: number) {
  return amount.toLocaleString('fr-FR') + ' DA';
}

function formatDate(dateStr: string, locale: string) {
  const d = new Date(dateStr);
  const loc = locale === 'ar' ? 'ar-DZ' : 'fr-FR';
  return d.toLocaleDateString(loc, { day: 'numeric', month: 'long', year: 'numeric' }) +
    ', ' + d.toLocaleTimeString(loc, { hour: '2-digit', minute: '2-digit' });
}

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5050';

const AdminOrderDetailPage = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [notes, setNotes] = useState('');
  const [notesLoaded, setNotesLoaded] = useState(false);

  const { data: order, isLoading } = useQuery<AdminOrderDetail>({
    queryKey: ['admin', 'order', id],
    queryFn: () => adminApi.getOrder(Number(id)),
    enabled: !!id,
  });

  // Initialize notes from fetched data
  if (order && !notesLoaded) {
    setNotes(order.adminNotes || '');
    setNotesLoaded(true);
  }

  const statusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: string }) =>
      adminApi.updateStatus(orderId, status),
    onSuccess: () => {
      toast.success(t('admin.orders.statusUpdated'));
      queryClient.invalidateQueries({ queryKey: ['admin', 'order', id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const notesMutation = useMutation({
    mutationFn: ({ orderId, notes }: { orderId: number; notes: string }) =>
      adminApi.updateNotes(orderId, notes),
    onSuccess: () => {
      toast.success(t('admin.orders.notesSaved'));
      queryClient.invalidateQueries({ queryKey: ['admin', 'order', id] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20 text-gray-400">{t('admin.orders.loading')}</div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20 text-gray-400">{t('admin.orders.notFound')}</div>
      </AdminLayout>
    );
  }

  const actions = statusActions[order.status] ?? [];

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Back */}
        <button
          onClick={() => navigate('/admin/orders')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={16} />
          {t('admin.orders.backToOrders')}
        </button>

        {/* Order Info */}
        <div className="bg-white rounded-xl border p-6 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="font-serif text-2xl text-gray-900">{order.orderNumber}</h1>
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusColors[order.status] || 'bg-gray-100'}`}>
              {t(`admin.status.${order.status}`, order.status)}
            </span>
          </div>
          <div className="text-sm text-gray-500 space-y-1">
            <p>{t('admin.orders.createdAt')} {formatDate(order.createdAt, i18n.language)}</p>
            <p>{t('admin.orders.updatedAt')} {formatDate(order.updatedAt, i18n.language)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer */}
          <div className="bg-white rounded-xl border p-6 space-y-3">
            <h2 className="font-medium text-gray-900">{t('admin.orders.client')}</h2>
            <div className="text-sm space-y-2">
              <p><span className="text-gray-500">{t('admin.orders.name')}</span> {order.customerName}</p>
              <p className="flex items-center gap-2">
                <span className="text-gray-500">{t('admin.orders.phone')}</span>
                <a href={`tel:${order.customerPhone}`} className="text-blue-600 hover:underline flex items-center gap-1" dir="ltr">
                  <Phone size={14} /> {order.customerPhone}
                </a>
              </p>
              <p><span className="text-gray-500">{t('admin.orders.wilaya')}</span> {order.wilaya}</p>
              <p><span className="text-gray-500">{t('admin.orders.commune')}</span> {order.commune}</p>
              <p><span className="text-gray-500">{t('admin.orders.address')}</span> {order.address}</p>
            </div>
          </div>

          {/* Package */}
          <div className="bg-white rounded-xl border p-6 space-y-3">
            <h2 className="font-medium text-gray-900">{t('admin.orders.package')}</h2>
            <div className="text-sm space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">{order.packageName}</span>
                <span className="flex gap-0.5">
                  {Array.from({ length: order.packageTier }).map((_, i) => (
                    <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                  ))}
                </span>
              </div>
              <ul className="space-y-1 text-gray-600">
                {order.packageItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">*</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-3 border-t space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span>{t('admin.orders.total')}</span>
                  <span className="tabular-nums">{formatDA(order.totalPrice)}</span>
                </div>
                <div className="flex justify-between text-green-700">
                  <span>{t('admin.orders.advance')}</span>
                  <span className="tabular-nums">{formatDA(order.advanceAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>{t('admin.orders.remaining')}</span>
                  <span className="tabular-nums">{formatDA(order.remainingAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Screenshot */}
        <div className="bg-white rounded-xl border p-6 space-y-3">
          <h2 className="font-medium text-gray-900">{t('admin.orders.screenshot')}</h2>
          {order.paymentScreenshotUrl ? (
            <img
              src={`${API_BASE}${order.paymentScreenshotUrl}`}
              alt="Payment screenshot"
              className="max-w-md rounded-lg border"
            />
          ) : (
            <p className="text-gray-400 text-sm">{t('admin.orders.noScreenshot')}</p>
          )}
        </div>

        {/* Status Management */}
        {actions.length > 0 && (
          <div className="bg-white rounded-xl border p-6 space-y-4">
            <h2 className="font-medium text-gray-900">{t('admin.orders.statusManagement')}</h2>
            <div className="flex flex-wrap gap-3">
              {actions.map(action => (
                <AlertDialog key={action.status}>
                  <AlertDialogTrigger asChild>
                    <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${actionStyles[action.variant]}`}>
                      {t(action.labelKey)}
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('admin.orders.confirmChange')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('admin.orders.confirmChangeDesc', { status: t(`admin.status.${action.status}`, action.status) })}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('admin.orders.cancel')}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => statusMutation.mutate({ orderId: order.id, status: action.status })}
                      >
                        {t('admin.orders.confirm')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ))}
            </div>
          </div>
        )}

        {/* Admin Notes */}
        <div className="bg-white rounded-xl border p-6 space-y-4">
          <h2 className="font-medium text-gray-900">{t('admin.orders.adminNotes')}</h2>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(42,65%,55%)]/40 resize-none"
            placeholder={t('admin.orders.notesPlaceholder')}
          />
          <button
            onClick={() => notesMutation.mutate({ orderId: order.id, notes })}
            disabled={notesMutation.isPending}
            className="px-6 py-2 bg-[hsl(42,65%,55%)] text-white text-sm font-medium rounded-lg hover:bg-[hsl(42,65%,50%)] transition-colors disabled:opacity-50"
          >
            {notesMutation.isPending ? t('admin.orders.savingNotes') : t('admin.orders.saveNotes')}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrderDetailPage;
