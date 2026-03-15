import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { MapPin, Shield, Heart, Gift, ClipboardCheck, CreditCard, Truck } from 'lucide-react';
import { usePackages } from '@/hooks/usePackages';
import PackageCard from '@/components/PackageCard';
import { motion } from 'framer-motion';
import heroBg from '@/assets/hero-bg.jpg';

const steps = [
  { icon: Gift, key: 'step1' },
  { icon: ClipboardCheck, key: 'step2' },
  { icon: CreditCard, key: 'step3' },
  { icon: Truck, key: 'step4' },
];

const trustItems = [
  { icon: MapPin, key: 'delivery' },
  { icon: Shield, key: 'secure' },
  { icon: Heart, key: 'care' },
];

const Index = () => {
  const { t } = useTranslation();
  const { data: packages = [] } = usePackages();

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center hero-gradient geometric-pattern overflow-hidden">
        {/* Background image overlay */}
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/80 to-burgundy-dark/90" />

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-serif text-5xl md:text-7xl font-light text-secondary tracking-tight">
              Dar El Khotba
            </h1>
            <p className="font-arabic text-2xl md:text-3xl text-primary-foreground/80 mt-2">
              دار الخطوبة
            </p>
            <p className="text-primary-foreground/70 mt-4 text-lg md:text-xl font-light">
              {t('hero.subtitle')}
            </p>
            <Link
              to="/packages"
              className="inline-block mt-8 px-8 py-3.5 bg-secondary text-secondary-foreground font-medium rounded-full hover:bg-secondary/90 transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,168,67,0.3)]"
            >
              {t('hero.cta')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Gold Divider */}
      <div className="gold-divider" />

      {/* How It Works */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-primary mb-16">
            {t('howItWorks.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col items-center text-center relative"
              >
                <span className="text-secondary/40 font-serif text-5xl font-light mb-4">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <step.icon size={24} className="text-primary" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-foreground font-medium">{t(`howItWorks.${step.key}`)}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute top-12 start-[calc(50%+40px)] w-[calc(100%-80px)] gold-divider" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Packages Preview */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-serif text-center text-primary mb-4">
            {t('packages.title')}
          </h2>
          <div className="gold-divider max-w-xs mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg, i) => (
              <PackageCard key={pkg.id} pkg={pkg} index={i} />
            ))}
          </div>
        </div>
      </section>

      <div className="gold-divider" />

      {/* Trust Section */}
      <section className="py-16 px-4 bg-accent/30">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustItems.map((item, i) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <item.icon size={22} className="text-secondary" strokeWidth={1.5} />
                </div>
                <p className="text-sm font-medium text-foreground">{t(`trust.${item.key}`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
