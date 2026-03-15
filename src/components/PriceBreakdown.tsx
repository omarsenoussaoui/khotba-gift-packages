import { useTranslation } from 'react-i18next';
import { formatPrice } from '@/lib/format';

interface PriceBreakdownProps {
  total: number;
}

const PriceBreakdown = ({ total }: PriceBreakdownProps) => {
  const { t, i18n } = useTranslation();
  const deposit = total * 0.3;
  const remaining = total * 0.7;

  return (
    <div className="rounded-xl border border-secondary/20 bg-accent/30 p-6 space-y-4">
      <div className="flex justify-between text-sm">
        <span>{t('pricing.total')}</span>
        <span className="font-bold tabular-nums">{formatPrice(total, i18n.language)}</span>
      </div>
      <div className="gold-divider" />
      <div className="flex justify-between text-primary font-bold">
        <span>{t('pricing.payNow')}</span>
        <span className="tabular-nums">{formatPrice(deposit, i18n.language)}</span>
      </div>
      <div className="flex justify-between text-muted-foreground text-xs italic">
        <span>{t('pricing.payOnDelivery')}</span>
        <span className="tabular-nums">{formatPrice(remaining, i18n.language)}</span>
      </div>
    </div>
  );
};

export default PriceBreakdown;
