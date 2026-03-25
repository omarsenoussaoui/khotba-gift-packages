import type { PackageItem } from '@/data/packages';
import type { Wilaya } from '@/data/wilayas';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';
const ADMIN_KEY = 'dar-el-khotba-admin-2026';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  totalCount?: number;
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options?.headers,
    },
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.error || `API error: ${res.status}`);
  }

  return json;
}

async function fetchAdminApi<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  return fetchApi<T>(endpoint, {
    ...options,
    headers: {
      'x-admin-key': ADMIN_KEY,
      ...options?.headers,
    },
  });
}

// --- Public types ---

export interface OrderResponse {
  orderNumber: string;
  packageName: string;
  totalPrice: number;
  advanceAmount: number;
  remainingAmount: number;
  status: string;
  createdAt: string;
}

export interface OrderStatsResponse {
  totalOrders: number;
  ordersToday: number;
  ordersThisMonth: number;
  revenueTotal: number;
  revenueThisMonth: number;
  ordersByStatus: Record<string, number>;
  popularPackages: { packageName: string; orderCount: number }[];
  recentOrders: AdminOrderListItem[];
}

export interface AdminOrderListItem {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  packageName: string;
  wilaya: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

export interface AdminOrderDetail {
  id: number;
  orderNumber: string;
  packageId: number;
  packageName: string;
  packageTier: number;
  packageItems: string[];
  customerName: string;
  customerPhone: string;
  wilaya: string;
  commune: string;
  address: string;
  totalPrice: number;
  advanceAmount: number;
  remainingAmount: number;
  paymentScreenshotUrl: string | null;
  status: string;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PackageApiDto {
  id: number;
  slug: string;
  nameFr: string;
  nameAr: string;
  descriptionFr: string;
  descriptionAr: string;
  price: number;
  itemsFr: string[];
  itemsAr: string[];
  imageUrl: string | null;
  tier: number;
  isActive: boolean;
}

function mapApiPackageToPackageItem(dto: PackageApiDto): PackageItem {
  return {
    id: dto.slug,
    backendId: dto.id,
    nameFr: dto.nameFr,
    nameAr: dto.nameAr,
    tier: dto.tier,
    price: dto.price,
    descriptionFr: dto.descriptionFr,
    descriptionAr: dto.descriptionAr,
    itemsFr: dto.itemsFr,
    itemsAr: dto.itemsAr,
    imageUrl: dto.imageUrl ? `${API_BASE.replace('/api', '')}${dto.imageUrl}` : null,
  };
}

// --- Public API ---

export const packageApi = {
  getAll: async (): Promise<PackageItem[]> => {
    const res = await fetchApi<PackageApiDto[]>('/packages');
    return (res.data ?? []).map(mapApiPackageToPackageItem);
  },
  getBySlug: async (slug: string): Promise<PackageItem> => {
    const res = await fetchApi<PackageApiDto>(`/packages/by-slug/${slug}`);
    if (!res.data) throw new Error('Package not found');
    return mapApiPackageToPackageItem(res.data);
  },
};

export const wilayaApi = {
  getAll: async (): Promise<Wilaya[]> => {
    const res = await fetchApi<Wilaya[]>('/wilayas');
    return res.data ?? [];
  },
};

export const orderApi = {
  create: async (formData: FormData): Promise<OrderResponse> => {
    const res = await fetchApi<OrderResponse>('/orders', {
      method: 'POST',
      body: formData,
      headers: {}, // let browser set Content-Type for FormData
    });
    if (!res.data) throw new Error('Order creation failed');
    return res.data;
  },
  getByNumber: async (orderNumber: string): Promise<OrderResponse> => {
    const res = await fetchApi<OrderResponse>(`/orders/${orderNumber}`);
    if (!res.data) throw new Error('Order not found');
    return res.data;
  },
};

// --- Admin API ---

export const adminApi = {
  getStats: async (): Promise<OrderStatsResponse> => {
    const res = await fetchAdminApi<OrderStatsResponse>('/admin/stats');
    if (!res.data) throw new Error('Failed to fetch stats');
    return res.data;
  },
  getOrders: async (params: string): Promise<{ orders: AdminOrderListItem[]; totalCount: number }> => {
    const res = await fetchAdminApi<AdminOrderListItem[]>(`/admin/orders?${params}`);
    return { orders: res.data ?? [], totalCount: res.totalCount ?? 0 };
  },
  getOrder: async (id: number): Promise<AdminOrderDetail> => {
    const res = await fetchAdminApi<AdminOrderDetail>(`/admin/orders/${id}`);
    if (!res.data) throw new Error('Order not found');
    return res.data;
  },
  updateStatus: async (id: number, status: string): Promise<void> => {
    await fetchAdminApi(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
  updateNotes: async (id: number, adminNotes: string): Promise<void> => {
    await fetchAdminApi(`/admin/orders/${id}/notes`, {
      method: 'PATCH',
      body: JSON.stringify({ adminNotes }),
    });
  },
  getPackages: async (): Promise<PackageApiDto[]> => {
    const res = await fetchAdminApi<PackageApiDto[]>('/admin/packages');
    return res.data ?? [];
  },
  createPackage: async (formData: FormData): Promise<PackageApiDto> => {
    const res = await fetchAdminApi<PackageApiDto>('/admin/packages', {
      method: 'POST',
      body: formData,
      headers: { 'x-admin-key': ADMIN_KEY },
    });
    if (!res.data) throw new Error('Package creation failed');
    return res.data;
  },
  updatePackage: async (id: number, formData: FormData): Promise<PackageApiDto> => {
    const res = await fetchAdminApi<PackageApiDto>(`/admin/packages/${id}`, {
      method: 'PUT',
      body: formData,
      headers: { 'x-admin-key': ADMIN_KEY },
    });
    if (!res.data) throw new Error('Package update failed');
    return res.data;
  },
  togglePackage: async (id: number): Promise<void> => {
    await fetchAdminApi(`/admin/packages/${id}/toggle`, { method: 'PATCH' });
  },
  validateKey: async (key: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/admin/stats`, {
        headers: { 'x-admin-key': key },
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};
