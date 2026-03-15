import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="gold-divider" />
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-start">
            <h3 className="font-serif text-2xl font-semibold text-secondary">Dar El Khotba</h3>
            <p className="font-arabic text-sm text-primary-foreground/70 mt-1">دار الخطوبة</p>
            <p className="text-sm text-primary-foreground/70 mt-1">{t('tagline')}</p>
          </div>
          <div className="text-center md:text-end text-sm text-primary-foreground/70 space-y-1">
            <p>{t('footer.phone')}</p>
            <p>{t('footer.instagram')}</p>
          </div>
        </div>
        <div className="gold-divider my-6 opacity-30" />
        <p className="text-center text-xs text-primary-foreground/50">{t('footer.rights')}</p>
      </div>
    </footer>
  );
};

export default Footer;
