export interface PackageItem {
  id: string;
  backendId?: number;
  nameFr: string;
  nameAr: string;
  tier: number;
  price: number;
  descriptionFr: string;
  descriptionAr: string;
  itemsFr: string[];
  itemsAr: string[];
  imageUrl?: string | null;
}

export const packages: PackageItem[] = [
  {
    id: "yasmine",
    nameFr: "Yasmine",
    nameAr: "ياسمين",
    tier: 1,
    price: 8000,
    descriptionFr: "Un geste simple et élégant pour commencer votre histoire",
    descriptionAr: "لمسة بسيطة وأنيقة لبداية قصتكم",
    itemsFr: ["Assortiment de pâtisseries algériennes (mkhabez, makrout)", "Bouquet de fleurs fraîches", "Flacon de parfum"],
    itemsAr: ["تشكيلة حلويات جزائرية (مخابز، مقروط)", "باقة زهور طازجة", "عطر صغير"],
  },
  {
    id: "nour",
    nameFr: "Nour",
    nameAr: "نور",
    tier: 2,
    price: 15000,
    descriptionFr: "L'essentiel pour une khotba réussie",
    descriptionAr: "كل ما تحتاجه لخطوبة ناجحة",
    itemsFr: ["Coffret de pâtisseries premium", "Set de parfums (homme & femme)", "Bouquet de fleurs", "Panier en osier décoré (tbek)"],
    itemsAr: ["صندوق حلويات فاخرة", "طقم عطور (رجالي ونسائي)", "باقة زهور", "طبق خوص مزين (طبق)"],
  },
  {
    id: "sultana",
    nameFr: "Sultana",
    nameAr: "سلطانة",
    tier: 3,
    price: 30000,
    descriptionFr: "Le coffret qui impressionne la belle-famille",
    descriptionAr: "الصندوق الذي يُبهر عائلة العروس",
    itemsFr: ["Tout le contenu du coffret Nour", "Pièce vestimentaire traditionnelle (foulard ou hayek)", "Assortiment premium de pâtisseries algériennes", "Coffret de présentation luxueux"],
    itemsAr: ["كل محتوى صندوق نور", "قطعة لباس تقليدي (فولار أو حايك)", "تشكيلة فاخرة من الحلويات الجزائرية", "صندوق تقديم فاخر"],
  },
  {
    id: "loundja",
    nameFr: "Loundja",
    nameAr: "لونجة",
    tier: 4,
    price: 60000,
    descriptionFr: "Pour ceux qui veulent marquer les esprits",
    descriptionAr: "لمن يريد أن يترك أثراً لا يُنسى",
    itemsFr: ["Tout le contenu du coffret Sultana", "Parure en or (bracelet + boucles d'oreilles)", "Collection de parfums de luxe", "Tbek premium décoré avec doublure en soie"],
    itemsAr: ["كل محتوى صندوق سلطانة", "طقم ذهب (سوار + أقراط)", "مجموعة عطور فاخرة", "طبق فاخر مزين بطانة حرير"],
  },
  {
    id: "el-maliika",
    nameFr: "El Maliika",
    nameAr: "الملكة",
    tier: 5,
    price: 100000,
    descriptionFr: "Le package royal — parce qu'elle mérite une reine",
    descriptionAr: "الباقة الملكية — لأنها تستحق معاملة الملكات",
    itemsFr: ["Parure complète en or (collier + bracelet + boucles d'oreilles + bague)", "Tenue traditionnelle premium", "Collection de parfums de luxe", "Assortiment premium de pâtisseries", "Bouquet de fleurs premium", "Grand tbek décoré avec soie", "Carte personnalisée"],
    itemsAr: ["طقم ذهب كامل (عقد + سوار + أقراط + خاتم)", "لباس تقليدي فاخر", "مجموعة عطور فاخرة", "تشكيلة حلويات فاخرة", "باقة زهور فاخرة", "طبق كبير مزين بالحرير", "بطاقة مخصصة"],
  },
];

export const getPackageById = (id: string) => packages.find(p => p.id === id);
