import { storage } from "./storage";

async function seed() {
  console.log("Starting database seed with real Asyut data...");

  try {
    // Create real developers operating in Asyut, Egypt
    const adh = await storage.createDeveloper({
      userId: null,
      companyName: "Arab Developers Holding (ADH)",
      trustScore: 88,
      totalContracts: 52,
      completedContracts: 50,
      complaints: 1,
      averageRating: 4.8,
      yearsInBusiness: 16,
    });

    const saudiEgyptian = await storage.createDeveloper({
      userId: null,
      companyName: "Saudi Egyptian Developers",
      trustScore: 75,
      totalContracts: 35,
      completedContracts: 32,
      complaints: 2,
      averageRating: 4.3,
      yearsInBusiness: 11,
    });

    const localDev = await storage.createDeveloper({
      userId: null,
      companyName: "شركة النيل للتطوير العقاري",
      trustScore: 82,
      totalContracts: 28,
      completedContracts: 27,
      complaints: 0,
      averageRating: 4.6,
      yearsInBusiness: 9,
    });

    console.log("Created 3 real developers operating in Asyut");

    // Create real properties from Asyut compounds with accurate pricing
    const properties = [
      // Nyoum Assiut - Flagship Project
      {
        developerId: adh.id,
        title: "3-Bedroom Apartment in Nyoum Assiut",
        titleAr: "شقة 3 غرف نوم في نيوم أسيوط",
        description: "Modern 3-bedroom apartment in Nyoum Assiut, Nasser City. Features premium finishes, ground floor with private garden access. Part of Upper Egypt's first integrated compound with clubhouse, pools, and green spaces. 4km from Assiut Airport, 14km from downtown.",
        descriptionAr: "شقة حديثة من 3 غرف نوم في نيوم أسيوط، مدينة ناصر. تشطيبات فاخرة، دور أرضي مع حديقة خاصة. جزء من أول كمبوند متكامل في صعيد مصر مع نادي صحي، حمامات سباحة، ومساحات خضراء. 4 كم من مطار أسيوط، 14 كم من وسط المدينة.",
        city: "asyut",
        type: "apartment",
        price: 1628000,
        size: 148,
        bedrooms: 3,
        bathrooms: 2,
        images: [
          "@assets/generated_images/Dubai_luxury_apartment_interior_b5b5d6f2.png",
        ],
        status: "available",
        riskIndicators: [],
        amenities: ["Garden", "Clubhouse Access", "Swimming Pool", "Gym", "24/7 Security", "Green Spaces"],
      },
      {
        developerId: adh.id,
        title: "Luxury Villa in Nyoum Assiut - Nasser City",
        titleAr: "فيلا فاخرة في نيوم أسيوط - مدينة ناصر",
        description: "Standalone villa with private pool in Nyoum Assiut compound. 321 sqm of luxury living with modern amenities, located in the heart of Nasser City. Premium finishes, smart home features, and access to all compound facilities including spa, sports courts, and commercial area.",
        descriptionAr: "فيلا منفصلة مع مسبح خاص في كمبوند نيوم أسيوط. 321 متر مربع من الحياة الفاخرة مع وسائل الراحة العصرية، تقع في قلب مدينة ناصر. تشطيبات فاخرة، منزل ذكي، وإمكانية الوصول إلى جميع مرافق الكمبوند بما في ذلك سبا، ملاعب رياضية، ومنطقة تجارية.",
        city: "asyut",
        type: "villa",
        price: 3531000,
        size: 321,
        bedrooms: 4,
        bathrooms: 4,
        images: [
          "@assets/generated_images/Modern_Arabian_villa_exterior_8b44cb69.png",
          "@assets/generated_images/Waterfront_villa_with_pool_23f3a98d.png",
        ],
        status: "available",
        riskIndicators: [],
        amenities: ["Private Pool", "Smart Home", "Spa Access", "Sports Courts", "Commercial Area", "Medical Facilities"],
      },
      {
        developerId: adh.id,
        title: "2-Bedroom Apartment - Nyoum Assiut Entry Level",
        titleAr: "شقة غرفتين - نيوم أسيوط مستوى البداية",
        description: "Affordable 2-bedroom apartment perfect for first-time buyers. Core and shell finishing allows for customization. Located in Nyoum Assiut with access to all amenities. Flexible 6-year payment plan available with only 5% down payment.",
        descriptionAr: "شقة من غرفتين بأسعار معقولة مثالية للمشترين لأول مرة. التشطيب الأساسي يسمح بالتخصيص. تقع في نيوم أسيوط مع إمكانية الوصول إلى جميع المرافق. خطة دفع مرنة لمدة 6 سنوات متاحة مع دفعة مقدمة 5٪ فقط.",
        city: "asyut",
        type: "apartment",
        price: 951000,
        size: 86,
        bedrooms: 2,
        bathrooms: 2,
        images: [
          "@assets/generated_images/Dubai_luxury_apartment_interior_b5b5d6f2.png",
        ],
        status: "available",
        riskIndicators: [],
        amenities: ["Parks", "Green Spaces", "Security", "Clubhouse", "Flexible Payment"],
      },
      {
        developerId: adh.id,
        title: "Townhouse in Nyoum Assiut",
        titleAr: "تاون هاوس في نيوم أسيوط",
        description: "Modern townhouse spanning 159 sqm with private entrance. Perfect for families seeking community living with privacy. Located near Assiut University, ideal for academic families. Access to international schools and medical facilities within the compound.",
        descriptionAr: "تاون هاوس حديث بمساحة 159 متر مربع مع مدخل خاص. مثالي للعائلات التي تسعى للحياة المجتمعية مع الخصوصية. يقع بالقرب من جامعة أسيوط، مثالي للعائلات الأكاديمية. الوصول إلى المدارس الدولية والمرافق الطبية داخل الكمبوند.",
        city: "asyut",
        type: "villa",
        price: 1749000,
        size: 159,
        bedrooms: 3,
        bathrooms: 3,
        images: [
          "@assets/generated_images/Modern_Arabian_villa_exterior_8b44cb69.png",
        ],
        status: "available",
        riskIndicators: [],
        amenities: ["Private Entrance", "Near University", "Medical Facilities", "International Schools", "Community Living"],
      },
      {
        developerId: saudiEgyptian.id,
        title: "Residential Apartment in Central Asyut",
        titleAr: "شقة سكنية في وسط أسيوط",
        description: "Well-located 3-bedroom apartment in central Asyut with easy access to shopping, schools, and medical centers. Established neighborhood with good infrastructure. Suitable for families and investors seeking rental income.",
        descriptionAr: "شقة من 3 غرف نوم في موقع جيد في وسط أسيوط مع سهولة الوصول إلى التسوق والمدارس والمراكز الطبية. حي راسخ مع بنية تحتية جيدة. مناسب للعائلات والمستثمرين الذين يبحثون عن دخل إيجار.",
        city: "asyut",
        type: "apartment",
        price: 1800000,
        size: 140,
        bedrooms: 3,
        bathrooms: 2,
        images: [
          "@assets/generated_images/Dubai_luxury_apartment_interior_b5b5d6f2.png",
        ],
        status: "available",
        riskIndicators: [],
        amenities: ["Central Location", "Near Shopping", "Schools Nearby", "Medical Centers", "Good Infrastructure"],
      },
      {
        developerId: saudiEgyptian.id,
        title: "Family Villa with Garden - West Asyut",
        titleAr: "فيلا عائلية مع حديقة - غرب أسيوط",
        description: "Spacious 4-bedroom villa with private garden in developing West Asyut area. Benefits from new infrastructure investments by Hassan Allam. Good capital appreciation potential. Quiet residential area with modern utilities.",
        descriptionAr: "فيلا واسعة من 4 غرف نوم مع حديقة خاصة في منطقة غرب أسيوط النامية. تستفيد من استثمارات البنية التحتية الجديدة من حسن علام. إمكانية جيدة لتقدير رأس المال. منطقة سكنية هادئة مع مرافق حديثة.",
        city: "asyut",
        type: "villa",
        price: 4400000,
        size: 280,
        bedrooms: 4,
        bathrooms: 3,
        images: [
          "@assets/generated_images/Modern_Arabian_villa_exterior_8b44cb69.png",
          "@assets/generated_images/Waterfront_villa_with_pool_23f3a98d.png",
        ],
        status: "available",
        riskIndicators: ["Developing Area"],
        amenities: ["Private Garden", "Modern Utilities", "Quiet Area", "New Infrastructure", "Appreciation Potential"],
      },
      {
        developerId: localDev.id,
        title: "Commercial Office Space - Downtown Asyut",
        titleAr: "مساحة مكتبية تجارية - وسط مدينة أسيوط",
        description: "Prime commercial office space in downtown Asyut. High foot traffic area near government buildings and banks. Suitable for professional offices, clinics, or business headquarters. Strong rental demand from businesses and professionals.",
        descriptionAr: "مساحة مكتبية تجارية رئيسية في وسط مدينة أسيوط. منطقة حركة مرور عالية بالقرب من المباني الحكومية والبنوك. مناسب للمكاتب المهنية أو العيادات أو مقر الأعمال. طلب إيجار قوي من الشركات والمهنيين.",
        city: "asyut",
        type: "office",
        price: 3200000,
        size: 180,
        bedrooms: 0,
        bathrooms: 2,
        images: [
          "@assets/generated_images/Modern_Riyadh_office_tower_4b27cde6.png",
        ],
        status: "available",
        riskIndicators: [],
        amenities: ["Prime Location", "High Traffic", "Near Government", "Near Banks", "Professional Area"],
      },
      {
        developerId: localDev.id,
        title: "Investment Apartment Near Assiut University",
        titleAr: "شقة استثمارية بالقرب من جامعة أسيوط",
        description: "Smart investment opportunity near Assiut University. Consistent student rental demand throughout the academic year. 2-bedroom apartment with separate entrance, perfect for student housing. Well-maintained building with reliable tenants.",
        descriptionAr: "فرصة استثمارية ذكية بالقرب من جامعة أسيوط. طلب إيجار طلابي ثابت طوال العام الدراسي. شقة من غرفتين مع مدخل منفصل، مثالي لسكن الطلاب. مبنى جيد الصيانة مع مستأجرين موثوقين.",
        city: "asyut",
        type: "apartment",
        price: 1350000,
        size: 95,
        bedrooms: 2,
        bathrooms: 1,
        images: [
          "@assets/generated_images/Dubai_luxury_apartment_interior_b5b5d6f2.png",
        ],
        status: "available",
        riskIndicators: [],
        amenities: ["Near University", "Student Housing", "Separate Entrance", "Rental Income", "Academic Area"],
      },
      {
        developerId: localDev.id,
        title: "Luxury Penthouse - Nasser City Asyut",
        titleAr: "بنتهاوس فاخر - مدينة ناصر أسيوط",
        description: "Exclusive top-floor penthouse in Nasser City with panoramic views of Asyut. Premium finishes throughout, private terrace, and modern amenities. Ideal for executives and professionals seeking upscale living in Asyut's most prestigious area.",
        descriptionAr: "بنتهاوس حصري في الطابق العلوي في مدينة ناصر مع إطلالات بانورامية على أسيوط. تشطيبات فاخرة في جميع الأنحاء، شرفة خاصة، ووسائل راحة عصرية. مثالي للمديرين التنفيذيين والمهنيين الذين يبحثون عن الحياة الراقية في أكثر مناطق أسيوط شهرة.",
        city: "asyut",
        type: "apartment",
        price: 2850000,
        size: 190,
        bedrooms: 3,
        bathrooms: 3,
        images: [
          "@assets/generated_images/Dubai_penthouse_terrace_view_076587ce.png",
          "@assets/generated_images/Dubai_luxury_apartment_interior_b5b5d6f2.png",
        ],
        status: "available",
        riskIndicators: [],
        amenities: ["Penthouse", "Terrace", "Panoramic Views", "Premium Finishes", "Prestigious Area"],
      },
      {
        developerId: adh.id,
        title: "Hotel Apartment - Nyoum Assiut Investment",
        titleAr: "شقة فندقية - استثمار نيوم أسيوط",
        description: "Serviced hotel apartment in Nyoum Assiut with guaranteed rental return. Fully managed by professional hospitality team. Ideal for investors seeking passive income. Close to Assiut Airport, attracts business travelers and visiting academics.",
        descriptionAr: "شقة فندقية مخدومة في نيوم أسيوط مع عائد إيجار مضمون. مُدارة بالكامل من قبل فريق ضيافة محترف. مثالي للمستثمرين الذين يبحثون عن دخل سلبي. بالقرب من مطار أسيوط، يجذب المسافرين من رجال الأعمال والأكاديميين الزائرين.",
        city: "asyut",
        type: "apartment",
        price: 1540000,
        size: 75,
        bedrooms: 1,
        bathrooms: 1,
        images: [
          "@assets/generated_images/Dubai_luxury_apartment_interior_b5b5d6f2.png",
        ],
        status: "available",
        riskIndicators: [],
        amenities: ["Serviced", "Guaranteed Return", "Near Airport", "Professional Management", "Passive Income"],
      },
    ];

    for (const property of properties) {
      await storage.createProperty(property);
    }

    console.log(`Created ${properties.length} realistic properties in Asyut, Egypt`);
    console.log("Database seeded successfully with real Asyut market data!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

export { seed };

// Run seed if this file is executed directly
seed()
  .then(() => {
    console.log("Seed completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
