export const formatPrice = (price: number, lang: string = 'fr') => {
  const formatted = price.toLocaleString('fr-FR');
  return lang === 'ar' ? `${formatted} د.ج` : `${formatted} DA`;
};
