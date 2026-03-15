import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/format';
import PriceBreakdown from '@/components/PriceBreakdown';
import { X, Gift } from 'lucide-react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const CartPage = () => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const { items, removeItem, totalPrice } = useCartStore();
  const total = totalPrice();

  if (items.length === 0) {
    return (
      <div className="py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto space-y-6"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-accent/50 flex items-center justify-center">
            <Gift size={32} className="text-secondary" strokeWidth={1.5} />
          </div>
          <h1 className="font-serif text-3xl text-primary">{t('cart.title')}</h1>
          <p className="text-muted-foreground">{t('cart.empty')}</p>
          <Link
            to="/packages"
            className="inline-block px-8 py-3 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/90 transition-all"
          >
            {t('cart.discover')}
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="font-serif text-3xl md:text-4xl text-primary mb-8">{t('cart.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ pkg, quantity }) => {
              const name = isAr ? pkg.nameAr : pkg.nameFr;
              return (
                <motion.div
                  key={pkg.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-card border border-secondary/20"
                >
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-burgundy-dark geometric-pattern flex-shrink-0 flex items-center justify-center">
                    <span className="font-serif text-xs text-primary-foreground/30">{name}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-lg text-primary">{name}</h3>
                    <div className="flex gap-0.5 mt-0.5">
                      {Array.from({ length: pkg.tier }).map((_, i) => (
                        <Star key={i} size={10} className="fill-secondary text-secondary" />
                      ))}
                    </div>
                  </div>
                  <div className="text-end">
                    <p className="font-bold text-secondary tabular-nums">{formatPrice(pkg.price * quantity, i18n.language)}</p>
                    {quantity > 1 && <p className="text-xs text-muted-foreground">×{quantity}</p>}
                  </div>
                  <button
                    onClick={() => removeItem(pkg.id)}
                    className="p-1.5 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    title={t('cart.remove')}
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <div className="rounded-xl border border-secondary/20 bg-card p-6 space-y-4">
              <h2 className="font-serif text-xl text-primary">{t('cart.summary')}</h2>
              <PriceBreakdown total={total} />
              <Link
                to="/checkout"
                className="block w-full py-3.5 bg-secondary text-secondary-foreground font-medium rounded-xl text-center hover:bg-secondary/90 transition-all hover:shadow-[0_0_30px_rgba(212,168,67,0.3)]"
              >
                {t('cart.checkout')}
              </Link>
            </div>
            <Link
              to="/packages"
              className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {t('cart.continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
