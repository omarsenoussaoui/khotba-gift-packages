import { useTranslation } from 'react-i18next';
import { usePackages } from '@/hooks/usePackages';
import PackageCard from '@/components/PackageCard';

const PackagesPage = () => {
  const { t } = useTranslation();
  const { data: packages = [] } = usePackages();

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-serif text-primary mb-3">{t('packages.pageTitle')}</h1>
          <p className="text-muted-foreground">{t('packages.pageSubtitle')}</p>
          <div className="gold-divider max-w-xs mx-auto mt-6" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PackagesPage;
