import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { PackageItem } from '@/data/packages';
import { formatPrice } from '@/lib/format';
import { motion } from 'framer-motion';

const tierGradients = [
  'from-primary/70 to-primary/90',
  'from-primary/75 to-primary',
  'from-primary to-burgundy-dark',
  'from-primary via-burgundy-dark to-primary',
  'from-burgundy-dark via-primary to-burgundy-dark',
];

interface PackageCardProps {
  pkg: PackageItem;
  index?: number;
}

const PackageCard = ({ pkg, index = 0 }: PackageCardProps) => {
  const { i18n, t } = useTranslation();
  const isAr = i18n.language === 'ar';
  const name = isAr ? pkg.nameAr : pkg.nameFr;
  const desc = isAr ? pkg.descriptionAr : pkg.descriptionFr;
  const items = isAr ? pkg.itemsAr : pkg.itemsFr;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/packages/${pkg.id}`} className="group block">
        <div className="relative rounded-2xl bg-card p-4 border border-secondary/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(107,29,42,0.2),0_0_0_1px_rgba(212,168,67,0.3)]">
          {/* Tier Badge */}
          <div className="absolute top-6 end-6 z-10 bg-secondary/90 text-secondary-foreground px-2.5 py-1 rounded-full flex items-center gap-0.5">
            {Array.from({ length: pkg.tier }).map((_, i) => (
              <Star key={i} size={10} className="fill-current" />
            ))}
          </div>

          {/* Image */}
          <div className={`aspect-[4/5] overflow-hidden rounded-xl bg-gradient-to-br ${tierGradients[pkg.tier - 1]} geometric-pattern flex items-center justify-center`}>
            <span className="font-serif text-4xl text-primary-foreground/30 font-light">{name}</span>
          </div>

          {/* Info */}
          <div className="mt-5 space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="font-serif text-2xl text-primary">{name}</h3>
              <span className="text-secondary font-bold tabular-nums text-lg">{formatPrice(pkg.price, i18n.language)}</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{desc}</p>
            <ul className="text-xs text-muted-foreground space-y-1 mt-2">
              {items.slice(0, 3).map((item, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-secondary mt-0.5">✦</span>
                  <span className="line-clamp-1">{item}</span>
                </li>
              ))}
            </ul>
            <div className="pt-3">
              <span className="text-sm font-medium text-secondary group-hover:underline underline-offset-4 transition-all">
                {t('packages.viewDetails')} →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PackageCard;
