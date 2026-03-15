import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const itemCount = useCartStore(s => s.itemCount());
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAr = i18n.language === 'ar';

  const toggleLang = () => {
    const newLang = isAr ? 'fr' : 'ar';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-secondary/20">
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        {/* Brand */}
        <Link to="/" className="flex flex-col leading-tight" onClick={() => setMobileOpen(false)}>
          <span className="font-serif text-xl md:text-2xl font-semibold text-primary tracking-tight">Dar El Khotba</span>
          <span className="font-arabic text-xs text-secondary">دار الخطوبة</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-body text-foreground hover:text-primary transition-colors">{t('nav.home')}</Link>
          <Link to="/packages" className="text-sm font-body text-foreground hover:text-primary transition-colors">{t('nav.packages')}</Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="relative flex items-center rounded-full border border-secondary/30 overflow-hidden h-8 text-xs"
          >
            <span className={`px-3 py-1 transition-all duration-300 ${!isAr ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}>FR</span>
            <span className={`px-3 py-1 font-arabic transition-all duration-300 ${isAr ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}>عر</span>
          </button>

          {/* Cart */}
          <Link to="/cart" className="relative p-2 text-foreground hover:text-primary transition-colors">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-secondary text-secondary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Mobile Hamburger */}
          <button className="md:hidden p-2 text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-background border-t border-secondary/20"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              <Link to="/" className="text-sm font-body text-foreground hover:text-primary" onClick={() => setMobileOpen(false)}>{t('nav.home')}</Link>
              <Link to="/packages" className="text-sm font-body text-foreground hover:text-primary" onClick={() => setMobileOpen(false)}>{t('nav.packages')}</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
