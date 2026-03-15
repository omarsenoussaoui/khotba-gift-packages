import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Navigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/format';
import { wilayas } from '@/data/wilayas';
import PriceBreakdown from '@/components/PriceBreakdown';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface FormData {
  fullName: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
}

interface FormErrors {
  fullName?: string;
  phone?: string;
  wilaya?: string;
  commune?: string;
  address?: string;
}

const CheckoutPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isAr = i18n.language === 'ar';
  const { items, totalPrice, clearCart } = useCartStore();
  const total = totalPrice();
  const deposit = total * 0.3;

  const [form, setForm] = useState<FormData>({ fullName: '', phone: '', wilaya: '', commune: '', address: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  if (items.length === 0) return <Navigate to="/packages" replace />;

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.fullName.trim()) e.fullName = t('checkout.errors.nameRequired');
    else if (form.fullName.trim().length < 3) e.fullName = t('checkout.errors.nameMin');

    if (!form.phone.trim()) e.phone = t('checkout.errors.phoneRequired');
    else if (!/^0[567]\d{8}$/.test(form.phone.trim())) e.phone = t('checkout.errors.phoneInvalid');

    if (!form.wilaya) e.wilaya = t('checkout.errors.wilayaRequired');
    if (!form.commune.trim()) e.commune = t('checkout.errors.communeRequired');
    if (!form.address.trim()) e.address = t('checkout.errors.addressRequired');

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const num = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
    const orderNumber = `DK-${dateStr}-${num}`;

    clearCart();
    navigate(`/order-confirmation/${orderNumber}`);
  };

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    setScreenshot(file);
    const reader = new FileReader();
    reader.onload = (e) => setScreenshotPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const updateField = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const inputClass = (field: keyof FormErrors) =>
    `w-full px-4 py-3 rounded-xl border ${errors[field] ? 'border-destructive' : 'border-secondary/20'} bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-secondary/40 transition-all`;

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="font-serif text-3xl md:text-4xl text-primary mb-8">{t('checkout.title')}</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Info */}
              <div className="space-y-4">
                <h2 className="font-serif text-xl text-primary">{t('checkout.info')}</h2>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t('checkout.fullName')}</label>
                  <input className={inputClass('fullName')} value={form.fullName} onChange={e => updateField('fullName', e.target.value)} />
                  {errors.fullName && <p className="text-destructive text-xs mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t('checkout.phone')}</label>
                  <input className={inputClass('phone')} value={form.phone} onChange={e => updateField('phone', e.target.value)} placeholder={t('checkout.phonePlaceholder')} dir="ltr" />
                  {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t('checkout.wilaya')}</label>
                  <select className={inputClass('wilaya')} value={form.wilaya} onChange={e => updateField('wilaya', e.target.value)}>
                    <option value="">{t('checkout.selectWilaya')}</option>
                    {wilayas.map(w => (
                      <option key={w.code} value={w.code}>
                        {w.code} - {isAr ? w.nameAr : w.nameFr}
                      </option>
                    ))}
                  </select>
                  {errors.wilaya && <p className="text-destructive text-xs mt-1">{errors.wilaya}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t('checkout.commune')}</label>
                  <input className={inputClass('commune')} value={form.commune} onChange={e => updateField('commune', e.target.value)} />
                  {errors.commune && <p className="text-destructive text-xs mt-1">{errors.commune}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t('checkout.address')}</label>
                  <textarea className={`${inputClass('address')} min-h-[80px] resize-none`} value={form.address} onChange={e => updateField('address', e.target.value)} />
                  {errors.address && <p className="text-destructive text-xs mt-1">{errors.address}</p>}
                </div>
              </div>

              <div className="gold-divider" />

              {/* Payment */}
              <div className="space-y-4">
                <h2 className="font-serif text-xl text-primary">{t('checkout.payment')}</h2>

                <div className="rounded-xl border-s-4 border-secondary bg-accent/30 p-5 space-y-2 text-sm">
                  <p>{t('checkout.paymentInstructions', { amount: formatPrice(deposit, i18n.language) })}</p>
                  <p className="font-mono text-foreground" dir="ltr">{t('checkout.ccpNumber')}</p>
                  <p className="font-mono text-foreground" dir="ltr">{t('checkout.baridiMob')}</p>
                  <p className="text-muted-foreground mt-2">{t('checkout.uploadInstructions')}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t('checkout.uploadLabel')}</label>
                  <div
                    onDrop={handleDrop}
                    onDragOver={e => e.preventDefault()}
                    onClick={() => document.getElementById('file-input')?.click()}
                    className="border-2 border-dashed border-secondary/30 rounded-xl p-8 text-center cursor-pointer hover:border-secondary/50 transition-colors"
                  >
                    {screenshotPreview ? (
                      <img src={screenshotPreview} alt="Payment screenshot" className="max-h-40 mx-auto rounded-lg" />
                    ) : (
                      <div className="space-y-2 text-muted-foreground">
                        <Upload size={32} className="mx-auto text-secondary" strokeWidth={1.5} />
                        <p className="text-sm">{t('checkout.uploadDrag')}</p>
                        <p className="text-xs">{t('checkout.uploadFormats')}</p>
                      </div>
                    )}
                  </div>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
                  />
                </div>
              </div>

              <p className="text-xs text-muted-foreground italic">{t('checkout.terms')}</p>

              <button
                type="submit"
                className="w-full py-4 bg-secondary text-secondary-foreground font-medium rounded-xl hover:bg-secondary/90 transition-all hover:shadow-[0_0_30px_rgba(212,168,67,0.3)] text-lg"
              >
                {t('checkout.confirm')}
              </button>
            </div>

            {/* Summary */}
            <div>
              <div className="sticky top-24 rounded-xl border border-secondary/20 bg-card p-6 space-y-4">
                <h2 className="font-serif text-xl text-primary">{t('cart.summary')}</h2>
                {items.map(({ pkg, quantity }) => (
                  <div key={pkg.id} className="flex justify-between text-sm">
                    <span>{isAr ? pkg.nameAr : pkg.nameFr} {quantity > 1 && `×${quantity}`}</span>
                    <span className="tabular-nums">{formatPrice(pkg.price * quantity, i18n.language)}</span>
                  </div>
                ))}
                <div className="gold-divider" />
                <PriceBreakdown total={total} />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
