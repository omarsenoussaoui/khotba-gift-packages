import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Clock, Gift, Truck, Banknote } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  { icon: Clock, key: 'step1' },
  { icon: Gift, key: 'step2' },
  { icon: Truck, key: 'step3' },
  { icon: Banknote, key: 'step4' },
];

const OrderConfirmationPage = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const { t } = useTranslation();

  return (
    <div className="py-16 px-4">
      <div className="container mx-auto max-w-2xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="mb-8"
        >
          <CheckCircle size={80} className="mx-auto text-green-600" strokeWidth={1.5} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h1 className="font-serif text-3xl md:text-4xl text-primary">{t('confirmation.title')}</h1>
          <p className="text-muted-foreground">{t('confirmation.thanks')}</p>

          <div className="inline-block rounded-xl bg-accent/50 border border-secondary/20 px-8 py-4">
            <p className="text-sm text-muted-foreground">{t('confirmation.orderNumber')}</p>
            <p className="text-2xl font-bold text-secondary tabular-nums mt-1">{orderNumber}</p>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16"
        >
          <h2 className="font-serif text-2xl text-primary mb-8">{t('confirmation.nextSteps')}</h2>
          <div className="space-y-0">
            {steps.map((step, i) => (
              <div key={step.key} className="flex items-start gap-4 relative">
                {/* Timeline line */}
                {i < steps.length - 1 && (
                  <div className="absolute start-5 top-10 w-[1px] h-12 bg-gradient-to-b from-secondary to-secondary/20" />
                )}
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <step.icon size={18} className="text-secondary" strokeWidth={1.5} />
                </div>
                <p className="text-sm text-foreground pt-2.5 pb-8">{t(`confirmation.${step.key}`)}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="gold-divider my-8" />

        <div className="space-y-3 text-sm text-muted-foreground">
          <p>{t('confirmation.contact')}</p>
          <p>{t('footer.phone')}</p>
          <p>{t('footer.instagram')}</p>
        </div>

        <Link
          to="/"
          className="inline-block mt-8 px-8 py-3.5 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/90 transition-all"
        >
          {t('confirmation.backHome')}
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
