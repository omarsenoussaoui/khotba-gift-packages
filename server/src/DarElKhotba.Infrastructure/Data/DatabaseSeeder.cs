using System.Text.Json;
using DarElKhotba.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DarElKhotba.Infrastructure.Data;

public static class DatabaseSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        await db.Database.EnsureCreatedAsync();

        if (!await db.Wilayas.AnyAsync())
            await SeedWilayasAsync(db);

        if (!await db.Packages.AnyAsync())
            await SeedPackagesAsync(db);
    }

    private static async Task SeedWilayasAsync(AppDbContext db)
    {
        var wilayas = new (string Code, string Fr, string Ar)[]
        {
            ("01", "Adrar", "أدرار"),
            ("02", "Chlef", "الشلف"),
            ("03", "Laghouat", "الأغواط"),
            ("04", "Oum El Bouaghi", "أم البواقي"),
            ("05", "Batna", "باتنة"),
            ("06", "Béjaïa", "بجاية"),
            ("07", "Biskra", "بسكرة"),
            ("08", "Béchar", "بشار"),
            ("09", "Blida", "البليدة"),
            ("10", "Bouira", "البويرة"),
            ("11", "Tamanrasset", "تمنراست"),
            ("12", "Tébessa", "تبسة"),
            ("13", "Tlemcen", "تلمسان"),
            ("14", "Tiaret", "تيارت"),
            ("15", "Tizi Ouzou", "تيزي وزو"),
            ("16", "Alger", "الجزائر"),
            ("17", "Djelfa", "الجلفة"),
            ("18", "Jijel", "جيجل"),
            ("19", "Sétif", "سطيف"),
            ("20", "Saïda", "سعيدة"),
            ("21", "Skikda", "سكيكدة"),
            ("22", "Sidi Bel Abbès", "سيدي بلعباس"),
            ("23", "Annaba", "عنابة"),
            ("24", "Guelma", "قالمة"),
            ("25", "Constantine", "قسنطينة"),
            ("26", "Médéa", "المدية"),
            ("27", "Mostaganem", "مستغانم"),
            ("28", "M'Sila", "المسيلة"),
            ("29", "Mascara", "معسكر"),
            ("30", "Ouargla", "ورقلة"),
            ("31", "Oran", "وهران"),
            ("32", "El Bayadh", "البيض"),
            ("33", "Illizi", "إليزي"),
            ("34", "Bordj Bou Arréridj", "برج بوعريريج"),
            ("35", "Boumerdès", "بومرداس"),
            ("36", "El Tarf", "الطارف"),
            ("37", "Tindouf", "تندوف"),
            ("38", "Tissemsilt", "تيسمسيلت"),
            ("39", "El Oued", "الوادي"),
            ("40", "Khenchela", "خنشلة"),
            ("41", "Souk Ahras", "سوق أهراس"),
            ("42", "Tipaza", "تيبازة"),
            ("43", "Mila", "ميلة"),
            ("44", "Aïn Defla", "عين الدفلى"),
            ("45", "Naâma", "النعامة"),
            ("46", "Aïn Témouchent", "عين تموشنت"),
            ("47", "Ghardaïa", "غرداية"),
            ("48", "Relizane", "غليزان"),
            ("49", "El M'Ghair", "المغير"),
            ("50", "El Meniaa", "المنيعة"),
            ("51", "Ouled Djellal", "أولاد جلال"),
            ("52", "Bordj Badji Mokhtar", "برج باجي مختار"),
            ("53", "Béni Abbès", "بني عباس"),
            ("54", "Timimoun", "تيميمون"),
            ("55", "Touggourt", "تقرت"),
            ("56", "Djanet", "جانت"),
            ("57", "In Salah", "عين صالح"),
            ("58", "In Guezzam", "عين قزام"),
        };

        foreach (var (code, fr, ar) in wilayas)
        {
            db.Wilayas.Add(new Wilaya { Code = code, NameFr = fr, NameAr = ar });
        }

        await db.SaveChangesAsync();
    }

    private static async Task SeedPackagesAsync(AppDbContext db)
    {
        var now = DateTime.UtcNow;

        var packages = new Package[]
        {
            new()
            {
                Slug = "yasmine",
                NameFr = "Yasmine",
                NameAr = "ياسمين",
                Tier = 1,
                Price = 8000,
                DescriptionFr = "Un geste simple et élégant pour commencer votre histoire",
                DescriptionAr = "لمسة بسيطة وأنيقة لبداية قصتكم",
                ItemsFr = JsonSerializer.Serialize(new[] {
                    "Assortiment de pâtisseries algériennes (mkhabez, makrout)",
                    "Bouquet de fleurs fraîches",
                    "Flacon de parfum"
                }),
                ItemsAr = JsonSerializer.Serialize(new[] {
                    "تشكيلة حلويات جزائرية (مخابز، مقروط)",
                    "باقة زهور طازجة",
                    "عطر صغير"
                }),
                IsActive = true,
                CreatedAt = now,
                UpdatedAt = now,
            },
            new()
            {
                Slug = "nour",
                NameFr = "Nour",
                NameAr = "نور",
                Tier = 2,
                Price = 15000,
                DescriptionFr = "L'essentiel pour une khotba réussie",
                DescriptionAr = "كل ما تحتاجه لخطوبة ناجحة",
                ItemsFr = JsonSerializer.Serialize(new[] {
                    "Coffret de pâtisseries premium",
                    "Set de parfums (homme & femme)",
                    "Bouquet de fleurs",
                    "Panier en osier décoré (tbek)"
                }),
                ItemsAr = JsonSerializer.Serialize(new[] {
                    "صندوق حلويات فاخرة",
                    "طقم عطور (رجالي ونسائي)",
                    "باقة زهور",
                    "طبق خوص مزين (طبق)"
                }),
                IsActive = true,
                CreatedAt = now,
                UpdatedAt = now,
            },
            new()
            {
                Slug = "sultana",
                NameFr = "Sultana",
                NameAr = "سلطانة",
                Tier = 3,
                Price = 30000,
                DescriptionFr = "Le coffret qui impressionne la belle-famille",
                DescriptionAr = "الصندوق الذي يُبهر عائلة العروس",
                ItemsFr = JsonSerializer.Serialize(new[] {
                    "Tout le contenu du coffret Nour",
                    "Pièce vestimentaire traditionnelle (foulard ou hayek)",
                    "Assortiment premium de pâtisseries algériennes",
                    "Coffret de présentation luxueux"
                }),
                ItemsAr = JsonSerializer.Serialize(new[] {
                    "كل محتوى صندوق نور",
                    "قطعة لباس تقليدي (فولار أو حايك)",
                    "تشكيلة فاخرة من الحلويات الجزائرية",
                    "صندوق تقديم فاخر"
                }),
                IsActive = true,
                CreatedAt = now,
                UpdatedAt = now,
            },
            new()
            {
                Slug = "loundja",
                NameFr = "Loundja",
                NameAr = "لونجة",
                Tier = 4,
                Price = 60000,
                DescriptionFr = "Pour ceux qui veulent marquer les esprits",
                DescriptionAr = "لمن يريد أن يترك أثراً لا يُنسى",
                ItemsFr = JsonSerializer.Serialize(new[] {
                    "Tout le contenu du coffret Sultana",
                    "Parure en or (bracelet + boucles d'oreilles)",
                    "Collection de parfums de luxe",
                    "Tbek premium décoré avec doublure en soie"
                }),
                ItemsAr = JsonSerializer.Serialize(new[] {
                    "كل محتوى صندوق سلطانة",
                    "طقم ذهب (سوار + أقراط)",
                    "مجموعة عطور فاخرة",
                    "طبق فاخر مزين بطانة حرير"
                }),
                IsActive = true,
                CreatedAt = now,
                UpdatedAt = now,
            },
            new()
            {
                Slug = "el-maliika",
                NameFr = "El Maliika",
                NameAr = "الملكة",
                Tier = 5,
                Price = 100000,
                DescriptionFr = "Le package royal — parce qu'elle mérite une reine",
                DescriptionAr = "الباقة الملكية — لأنها تستحق معاملة الملكات",
                ItemsFr = JsonSerializer.Serialize(new[] {
                    "Parure complète en or (collier + bracelet + boucles d'oreilles + bague)",
                    "Tenue traditionnelle premium",
                    "Collection de parfums de luxe",
                    "Assortiment premium de pâtisseries",
                    "Bouquet de fleurs premium",
                    "Grand tbek décoré avec soie",
                    "Carte personnalisée"
                }),
                ItemsAr = JsonSerializer.Serialize(new[] {
                    "طقم ذهب كامل (عقد + سوار + أقراط + خاتم)",
                    "لباس تقليدي فاخر",
                    "مجموعة عطور فاخرة",
                    "تشكيلة حلويات فاخرة",
                    "باقة زهور فاخرة",
                    "طبق كبير مزين بالحرير",
                    "بطاقة مخصصة"
                }),
                IsActive = true,
                CreatedAt = now,
                UpdatedAt = now,
            },
        };

        db.Packages.AddRange(packages);
        await db.SaveChangesAsync();
    }
}
