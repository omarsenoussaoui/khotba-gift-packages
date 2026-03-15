import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePackageBySlug, usePackages } from '@/hooks/usePackages';
import { formatPrice } from '@/lib/format';
import { useCartStore } from '@/store/cartStore';
import { Star, Check } from 'lucide-react';
import PriceBreakdown from '@/components/PriceBreakdown';
import PackageCard from '@/components/PackageCard';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const tierGradients = [
  'from-primary/70 to-primary/90',
  'from-primary/75 to-primary',
  'from-primary to-burgundy-dark',
  'from-primary via-burgundy-dark to-primary',
  'from-burgundy-dark via-primary to-burgundy-dark',
];

const PackageDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t, i18n } = useTranslation();
  const addItem = useCartStore(s => s.addItem);
  const isAr = i18n.language === 'ar';

  const { data: pkg } = usePackageBySlug(id || '');
  const { data: allPackages = [] } = usePackages();
  if (!pkg) return <div className="py-20 text-center text-muted-foreground">Package not found</div>;

  const name = isAr ? pkg.nameAr : pkg.nameFr;
  const desc = isAr ? pkg.descriptionAr : pkg.descriptionFr;
  const items = isAr ? pkg.itemsAr : pkg.itemsFr;

  const nextPkg = allPackages.find(p => p.tier === pkg.tier + 1);

  const handleAdd = () => {
    addItem(pkg);
    toast.success(isAr ? 'تمت الإضافة إلى السلة' : 'Ajouté au panier');
  };

  return (
    <div className="py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted-foreground mb-8 flex items-center gap-2">
          <Link to="/" className="hover:text-primary transition-colors">{t('packages.breadcrumbHome')}</Link>
          <span className="text-secondary">›</span>
          <Link to="/packages" className="hover:text-primary transition-colors">{t('packages.breadcrumbPackages')}</Link>
          <span className="text-secondary">›</span>
          <span className="text-foreground">{name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={`aspect-square rounded-2xl bg-gradient-to-br ${tierGradients[pkg.tier - 1]} geometric-pattern flex items-center justify-center`}
          >
            <span className="font-serif text-5xl text-primary-foreground/20 font-light">{name}</span>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Stars */}
            <div className="flex gap-0.5">
              {Array.from({ length: pkg.tier }).map((_, i) => (
                <Star key={i} size={16} className="fill-secondary text-secondary" />
              ))}
            </div>

            <h1 className="font-serif text-4xl text-primary">{name}</h1>
            <p className="text-3xl font-bold text-secondary tabular-nums">{formatPrice(pkg.price, i18n.language)}</p>
            <p className="text-muted-foreground leading-relaxed">{desc}</p>

            <div className="gold-divider" />

            <div>
              <h3 className="font-serif text-xl text-primary mb-4">{t('packages.contents')}</h3>
              <ul className="space-y-3">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check size={16} className="text-secondary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="gold-divider" />

            <PriceBreakdown total={pkg.price} />

            <button
              onClick={handleAdd}
              className="w-full py-4 bg-secondary text-secondary-foreground font-medium rounded-xl hover:bg-secondary/90 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,168,67,0.3)] text-lg"
            >
              {t('packages.addToCart')}
            </button>

            <Link
              to="/packages"
              className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {t('packages.backToPackages')}
            </Link>
          </motion.div>
        </div>

        {/* Suggestion */}
        {nextPkg && (
          <div className="mt-20">
            <h2 className="font-serif text-2xl text-primary text-center mb-8">{t('packages.youMayLike')}</h2>
            <div className="max-w-sm mx-auto">
              <PackageCard pkg={nextPkg} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PackageDetailPage;
