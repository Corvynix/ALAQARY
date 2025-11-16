import { storage } from "./storage";
import { randomUUID } from "crypto";

async function seed() {
  console.log("Starting database seed...");

  try {
    // Create sample developers
    const developer1 = await storage.createDeveloper({
      userId: null,
      companyName: "العمران للتطوير العقاري",
      trustScore: 85,
      totalContracts: 45,
      completedContracts: 42,
      complaints: 1,
      averageRating: 4.7,
      yearsInBusiness: 12,
    });

    const developer2 = await storage.createDeveloper({
      userId: null,
      companyName: "دار الخليج للاستثمار",
      trustScore: 72,
      totalContracts: 28,
      completedContracts: 24,
      complaints: 3,
      averageRating: 4.2,
      yearsInBusiness: 8,
    });

    const developer3 = await storage.createDeveloper({
      userId: null,
      companyName: "النخبة العقارية",
      trustScore: 92,
      totalContracts: 67,
      completedContracts: 65,
      complaints: 0,
      averageRating: 4.9,
      yearsInBusiness: 15,
    });

    console.log("Created developers");

    // Create sample properties
    const properties = [
      {
        developerId: developer1.id,
        title: "Luxury Villa in Al Malqa",
        titleAr: "فيلا فاخرة في المعلقة",
        description: "Stunning 5-bedroom villa with modern amenities, private pool, and garden. Located in prestigious Al Malqa district with easy access to schools and shopping.",
        descriptionAr: "فيلا مذهلة من 5 غرف نوم مع وسائل راحة عصرية ومسبح خاص وحديقة. تقع في حي المعلقة المرموق مع سهولة الوصول إلى المدارس والتسوق.",
        city: "riyadh",
        type: "villa",
        price: 3500000,
        size: 450,
        bedrooms: 5,
        bathrooms: 6,
        images: [
          "@assets/generated_images/Modern_Arabian_villa_exterior_8b44cb69.png",
          "@assets/generated_images/Dubai_luxury_apartment_interior_b5b5d6f2.png",
        ],
        status: "available",
        riskIndicators: [],
        amenities: ["Pool", "Garden", "Parking", "Security", "Gym"],
      },
      {
        developerId: developer2.id,
        title: "Modern Apartment in Jeddah Waterfront",
        titleAr: "شقة عصرية في كورنيش جدة",
        description: "Elegant 3-bedroom apartment with breathtaking Red Sea views. Premium finishes and access to building amenities including gym and pool.",
        descriptionAr: "شقة أنيقة من 3 غرف نوم مع إطلالات خلابة على البحر الأحمر. تشطيبات فاخرة وإمكانية الوصول إلى مرافق المبنى بما في ذلك صالة رياضية ومسبح.",
        city: "jeddah",
        type: "apartment",
        price: 1850000,
        size: 220,
        bedrooms: 3,
        bathrooms: 3,
        images: [
          "@assets/generated_images/Dubai_luxury_apartment_interior_b5b5d6f2.png",
          "@assets/generated_images/Dubai_penthouse_terrace_view_076587ce.png",
        ],
        status: "available",
        riskIndicators: [],
        amenities: ["Sea View", "Gym", "Pool", "Concierge", "Parking"],
      },
      {
        developerId: developer3.id,
        title: "Waterfront Villa with Pool",
        titleAr: "فيلا على الواجهة البحرية مع مسبح",
        description: "Exclusive waterfront property with infinity pool, private beach access, and panoramic sea views. Perfect for luxury living.",
        descriptionAr: "عقار حصري على الواجهة البحرية مع مسبح لا متناهي، ووصول خاص إلى الشاطئ، وإطلالات بانورامية على البحر. مثالي للحياة الفاخرة.",
        city: "dubai",
        type: "villa",
        price: 8500000,
        size: 600,
        bedrooms: 6,
        bathrooms: 7,
        images: [
          "@assets/generated_images/Waterfront_villa_with_pool_23f3a98d.png",
          "@assets/generated_images/Dubai_penthouse_terrace_view_076587ce.png",
        ],
        status: "available",
        riskIndicators: [],
        amenities: ["Private Beach", "Pool", "Garden", "Security", "Smart Home"],
      },
      {
        developerId: developer1.id,
        title: "Commercial Office Tower in Business District",
        titleAr: "برج مكاتب تجاري في الحي التجاري",
        description: "Prime office space in central business district. Modern building with excellent facilities and high-speed connectivity.",
        descriptionAr: "مساحة مكتبية رئيسية في منطقة الأعمال المركزية. مبنى حديث مع مرافق ممتازة واتصال عالي السرعة.",
        city: "riyadh",
        type: "office",
        price: 12000000,
        size: 800,
        bedrooms: 0,
        bathrooms: 8,
        images: [
          "@assets/generated_images/Modern_Riyadh_office_tower_4b27cde6.png",
        ],
        status: "available",
        riskIndicators: [],
        amenities: ["Parking", "Security", "High Speed Internet", "Meeting Rooms", "Cafeteria"],
      },
      {
        developerId: developer2.id,
        title: "Penthouse with Panoramic City Views",
        titleAr: "بنتهاوس مع إطلالات بانورامية على المدينة",
        description: "Ultra-luxury penthouse on top floor with 360-degree city views, private terrace, and premium finishes throughout.",
        descriptionAr: "بنتهاوس فاخر للغاية في الطابق العلوي مع إطلالات على المدينة بزاوية 360 درجة، وشرفة خاصة، وتشطيبات فاخرة في جميع الأنحاء.",
        city: "dubai",
        type: "apartment",
        price: 6200000,
        size: 380,
        bedrooms: 4,
        bathrooms: 5,
        images: [
          "@assets/generated_images/Dubai_penthouse_terrace_view_076587ce.png",
          "@assets/generated_images/Dubai_luxury_apartment_interior_b5b5d6f2.png",
        ],
        status: "available",
        riskIndicators: [],
        amenities: ["Terrace", "City View", "Pool", "Gym", "Concierge", "Parking"],
      },
      {
        developerId: developer3.id,
        title: "Investment Land Plot in Abu Dhabi",
        titleAr: "قطعة أرض استثمارية في أبو ظبي",
        description: "Prime investment opportunity. Large land plot in developing area with approved building permits.",
        descriptionAr: "فرصة استثمارية رئيسية. قطعة أرض كبيرة في منطقة نامية مع تصاريح بناء معتمدة.",
        city: "abu-dhabi",
        type: "land",
        price: 4500000,
        size: 1200,
        bedrooms: 0,
        bathrooms: 0,
        images: [],
        status: "available",
        riskIndicators: ["Under Development"],
        amenities: ["Approved Permits", "Prime Location"],
      },
    ];

    for (const property of properties) {
      await storage.createProperty(property);
    }

    console.log(`Created ${properties.length} properties`);

    console.log("Database seeded successfully!");
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
