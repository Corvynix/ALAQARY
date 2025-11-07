import { storage } from "./storage";

async function seed() {
  try {
    console.log("Seeding database...");

    // Seed market trends
    const marketTrendsData = [
      {
        city: "أسيوط",
        avgPrice: "1200000",
        demandLevel: "high",
        changePercent: "23",
        notes: "الطلب في أسيوط مرتفع بنسبة 23% عن الشهر السابق",
        notesEn: "Demand in Assiut increased by 23% compared to last month"
      },
      {
        city: "القاهرة",
        avgPrice: "3500000",
        demandLevel: "high",
        changePercent: "15",
        notes: "السوق العقاري في القاهرة يشهد نمواً مستمراً",
        notesEn: "Cairo real estate market continues to grow"
      },
      {
        city: "الإسكندرية",
        avgPrice: "2800000",
        demandLevel: "medium",
        changePercent: "-5",
        notes: "استقرار نسبي في أسعار العقارات بالإسكندرية",
        notesEn: "Relative stability in Alexandria property prices"
      }
    ];

    for (const trend of marketTrendsData) {
      await storage.createMarketTrend(trend);
    }
    console.log("Market trends seeded successfully");

    // Seed properties
    const propertiesData = [
      {
        title: "فيلا فاخرة بمسبح خاص",
        titleEn: "Luxury Villa with Private Pool",
        city: "القاهرة الجديدة",
        propertyType: "فيلا",
        price: "8500000",
        sizeSqm: "450",
        description: "مش مجرد فيلا — بداية جديدة لحياة العائلة. تصميم عصري مع حديقة خاصة ومسبح.",
        descriptionEn: "Not just a villa - a new beginning for family life. Modern design with private garden and pool.",
        images: ["/assets/generated_images/Luxury_villa_exterior_property_2b7f2ac4.png"],
        status: "available"
      },
      {
        title: "شقة أنيقة في برج سكني",
        titleEn: "Elegant Apartment in Residential Tower",
        city: "القاهرة",
        propertyType: "شقة",
        price: "3200000",
        sizeSqm: "180",
        description: "مش مجرد شقة — بداية جديدة لحياتك. موقع استراتيجي وإطلالة ساحرة.",
        descriptionEn: "Not just an apartment - a new beginning for your life. Strategic location with stunning views.",
        images: ["/assets/generated_images/Elegant_apartment_interior_081d6ca6.png"],
        status: "available"
      },
      {
        title: "بنتهاوس فاخر مع إطلالة بانورامية",
        titleEn: "Luxury Penthouse with Panoramic View",
        city: "الإسكندرية",
        propertyType: "بنتهاوس",
        price: "12000000",
        sizeSqm: "320",
        description: "قمة الفخامة والرفاهية. عيش حلم الإطلالة الكاملة على المدينة.",
        descriptionEn: "The pinnacle of luxury and elegance. Live the dream with full city views.",
        images: ["/assets/generated_images/Luxury_residential_tower_night_44050edf.png"],
        status: "reserved"
      },
      {
        title: "دوبلكس عصري في كمبوند مغلق",
        titleEn: "Modern Duplex in Gated Compound",
        city: "القاهرة الجديدة",
        propertyType: "دوبلكس",
        price: "5500000",
        sizeSqm: "280",
        description: "استثمار ذكي في موقع مميز. أمان وراحة ومستوى معيشة عالي.",
        descriptionEn: "Smart investment in a prime location. Security, comfort, and high living standards.",
        images: ["/assets/generated_images/Luxury_villa_exterior_property_2b7f2ac4.png"],
        status: "available"
      },
      {
        title: "شقة فندقية بخدمات متكاملة",
        titleEn: "Serviced Hotel Apartment",
        city: "الإسكندرية",
        propertyType: "شقة",
        price: "2800000",
        sizeSqm: "150",
        description: "استثمار مربح مع عائد سنوي مضمون. إدارة فندقية احترافية.",
        descriptionEn: "Profitable investment with guaranteed annual returns. Professional hotel management.",
        images: ["/assets/generated_images/Elegant_apartment_interior_081d6ca6.png"],
        status: "available"
      },
      {
        title: "فيلا على البحر مباشرة",
        titleEn: "Beachfront Villa",
        city: "الساحل الشمالي",
        propertyType: "فيلا",
        price: "15000000",
        sizeSqm: "500",
        description: "حلم الحياة على البحر. استيقظ على صوت الأمواج كل يوم.",
        descriptionEn: "The dream of beachfront living. Wake up to the sound of waves every day.",
        images: ["/assets/generated_images/Luxury_villa_exterior_property_2b7f2ac4.png"],
        status: "available"
      }
    ];

    for (const property of propertiesData) {
      await storage.createProperty(property);
    }
    console.log("Properties seeded successfully");

    // Seed content/blog posts
    const contentData = [
      {
        title: "دليلك الشامل لشراء أول عقار",
        titleEn: "Your Complete Guide to Buying Your First Property",
        body: "شراء العقار الأول خطوة مهمة تحتاج تخطيط دقيق. في هذا المقال نشرح كل ما تحتاج معرفته من دراسة السوق، تحديد الميزانية، اختيار الموقع المناسب، والإجراءات القانونية.",
        bodyEn: "Buying your first property is an important step that requires careful planning. In this article, we explain everything you need to know from market research, budget determination, choosing the right location, and legal procedures.",
        category: "buying-guide"
      },
      {
        title: "5 علامات تدل على أن العقار استثمار جيد",
        titleEn: "5 Signs That a Property is a Good Investment",
        body: "كيف تعرف أن العقار اللي بتشوفه استثمار صح؟ نشرح العلامات الخمسة الأساسية: الموقع الاستراتيجي، معدل النمو، البنية التحتية، العائد المتوقع، والطلب في المنطقة.",
        bodyEn: "How do you know if the property you're looking at is a good investment? We explain the five essential signs: strategic location, growth rate, infrastructure, expected returns, and local demand.",
        category: "investment-tips"
      },
      {
        title: "أخطاء شائعة في الاستثمار العقاري",
        titleEn: "Common Mistakes in Real Estate Investment",
        body: "تجنب الأخطاء الشائعة التي يقع فيها المستثمرون الجدد. نناقش المبالغة في السعر، إهمال الموقع، عدم دراسة السوق، والتسرع في اتخاذ القرار.",
        bodyEn: "Avoid common mistakes that new investors make. We discuss overpaying, neglecting location, lack of market research, and hasty decision-making.",
        category: "investment-tips"
      }
    ];

    for (const contentItem of contentData) {
      await storage.createContent(contentItem);
    }
    console.log("Content seeded successfully");

    console.log("Database seeding completed!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
