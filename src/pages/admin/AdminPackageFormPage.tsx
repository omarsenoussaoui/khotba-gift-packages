import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { adminApi, type PackageApiDto } from '@/services/api';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminPackageFormPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [nameFr, setNameFr] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [descFr, setDescFr] = useState('');
  const [descAr, setDescAr] = useState('');
  const [price, setPrice] = useState(0);
  const [tier, setTier] = useState(1);
  const [itemsFr, setItemsFr] = useState(['', '', '']);
  const [itemsAr, setItemsAr] = useState(['', '', '']);
  const [isActive, setIsActive] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: existing } = useQuery<PackageApiDto>({
    queryKey: ['admin', 'package', id],
    queryFn: async () => {
      const packages = await adminApi.getPackages();
      const pkg = packages.find(p => p.id === Number(id));
      if (!pkg) throw new Error('Package not found');
      return pkg;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (existing) {
      setNameFr(existing.nameFr);
      setNameAr(existing.nameAr);
      setDescFr(existing.descriptionFr);
      setDescAr(existing.descriptionAr);
      setPrice(existing.price);
      setTier(existing.tier);
      setItemsFr(existing.itemsFr.length > 0 ? [...existing.itemsFr] : ['']);
      setItemsAr(existing.itemsAr.length > 0 ? [...existing.itemsAr] : ['']);
      setIsActive(existing.isActive);
      if (existing.imageUrl) {
        const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5050';
        setImagePreview(`${API_BASE}${existing.imageUrl}`);
      }
    }
  }, [existing]);

  const createMutation = useMutation({
    mutationFn: (formData: FormData) => adminApi.createPackage(formData),
    onSuccess: () => {
      toast.success(t('admin.packages.created'));
      navigate('/admin/packages');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: (formData: FormData) => adminApi.updatePackage(Number(id), formData),
    onSuccess: () => {
      toast.success(t('admin.packages.updated'));
      navigate('/admin/packages');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const filteredFr = itemsFr.filter(i => i.trim());
    const filteredAr = itemsAr.filter(i => i.trim());

    if (!nameFr.trim() || !nameAr.trim() || !descFr.trim() || !descAr.trim() || price < 1 || filteredFr.length === 0 || filteredAr.length === 0) {
      toast.error(t('admin.packages.validationError'));
      return;
    }

    const formData = new FormData();
    formData.append('nameFr', nameFr.trim());
    formData.append('nameAr', nameAr.trim());
    formData.append('descriptionFr', descFr.trim());
    formData.append('descriptionAr', descAr.trim());
    formData.append('price', String(price));
    formData.append('tier', String(tier));
    formData.append('isActive', String(isActive));
    filteredFr.forEach(item => formData.append('itemsFr', item.trim()));
    filteredAr.forEach(item => formData.append('itemsAr', item.trim()));
    if (image) formData.append('image', image);

    if (isEdit) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleImageChange = (file: File) => {
    setImage(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const updateItemFr = (idx: number, val: string) => {
    const next = [...itemsFr];
    next[idx] = val;
    setItemsFr(next);
  };

  const updateItemAr = (idx: number, val: string) => {
    const next = [...itemsAr];
    next[idx] = val;
    setItemsAr(next);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminLayout>
      <div className="max-w-3xl space-y-6">
        <button
          onClick={() => navigate('/admin/packages')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={16} />
          {t('admin.packages.backToPackages')}
        </button>

        <h1 className="text-2xl font-serif text-gray-900">
          {isEdit ? t('admin.packages.editTitle') : t('admin.packages.createTitle')}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border p-6 space-y-5">
            {/* Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.packages.nameFr')}</label>
                <input
                  value={nameFr}
                  onChange={e => setNameFr(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(42,65%,55%)]/40"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.packages.nameAr')}</label>
                <input
                  value={nameAr}
                  onChange={e => setNameAr(e.target.value)}
                  dir="rtl"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(42,65%,55%)]/40"
                  required
                />
              </div>
            </div>

            {/* Descriptions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.packages.descFr')}</label>
              <textarea
                value={descFr}
                onChange={e => setDescFr(e.target.value)}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(42,65%,55%)]/40 resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.packages.descAr')}</label>
              <textarea
                value={descAr}
                onChange={e => setDescAr(e.target.value)}
                rows={3}
                dir="rtl"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(42,65%,55%)]/40 resize-none"
                required
              />
            </div>

            {/* Price and Tier */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.packages.price')}</label>
                <input
                  type="number"
                  value={price || ''}
                  onChange={e => setPrice(Number(e.target.value))}
                  min={1}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(42,65%,55%)]/40"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.packages.tier')}</label>
                <select
                  value={tier}
                  onChange={e => setTier(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(42,65%,55%)]/40"
                >
                  {[1, 2, 3, 4, 5].map(t => (
                    <option key={t} value={t}>Tier {t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Items FR */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.packages.itemsFr')}</label>
              <div className="space-y-2">
                {itemsFr.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      value={item}
                      onChange={e => updateItemFr(idx, e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(42,65%,55%)]/40"
                      placeholder={t('admin.packages.itemPlaceholderFr', { n: idx + 1 })}
                    />
                    {itemsFr.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setItemsFr(itemsFr.filter((_, i) => i !== idx))}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setItemsFr([...itemsFr, ''])}
                  className="flex items-center gap-1 text-xs text-[hsl(42,65%,55%)] hover:text-[hsl(42,65%,45%)]"
                >
                  <Plus size={14} /> {t('admin.packages.addItem')}
                </button>
              </div>
            </div>

            {/* Items AR */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.packages.itemsAr')}</label>
              <div className="space-y-2">
                {itemsAr.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      value={item}
                      onChange={e => updateItemAr(idx, e.target.value)}
                      dir="rtl"
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(42,65%,55%)]/40"
                      placeholder={t('admin.packages.itemPlaceholderAr', { n: idx + 1 })}
                    />
                    {itemsAr.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setItemsAr(itemsAr.filter((_, i) => i !== idx))}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setItemsAr([...itemsAr, ''])}
                  className="flex items-center gap-1 text-xs text-[hsl(42,65%,55%)] hover:text-[hsl(42,65%,45%)]"
                >
                  <Plus size={14} /> {t('admin.packages.addItem')}
                </button>
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.packages.image')}</label>
              <div
                onClick={() => document.getElementById('pkg-image')?.click()}
                className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-gray-300 transition-colors"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="max-h-40 mx-auto rounded-lg" />
                ) : (
                  <p className="text-sm text-gray-400">{t('admin.packages.imageClick')}</p>
                )}
              </div>
              <input
                id="pkg-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={e => e.target.files?.[0] && handleImageChange(e.target.files[0])}
              />
            </div>

            {/* Active */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isActive}
                onChange={e => setIsActive(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-700">{t('admin.packages.activeLabel')}</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 bg-[hsl(42,65%,55%)] text-white text-sm font-medium rounded-lg hover:bg-[hsl(42,65%,50%)] transition-colors disabled:opacity-50"
            >
              {isPending
                ? t('admin.packages.saving')
                : isEdit ? t('admin.packages.update') : t('admin.packages.create')
              }
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/packages')}
              className="px-6 py-2.5 border text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('admin.packages.cancelForm')}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminPackageFormPage;
