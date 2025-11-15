import { storage } from "./storage";

async function seed() {
  try {
    console.log("Seeding database...");

    // Seed market trends - 12+ major Egyptian cities for complete coverage
    const marketTrendsData = [
      {
        city: "القاهرة",
        avgPrice: "3500000",
        demandLevel: "high",
        changePercent: "15",
        notes: "السوق العقاري في القاهرة يشهد نمواً مستمراً مع ارتفاع الطلب على الوحدات السكنية الفاخرة",
        notesEn: "Cairo real estate market continues to grow with increasing demand for luxury units"
      },
      {
        city: "الجيزة",
        avgPrice: "2900000",
        demandLevel: "high",
        changePercent: "12",
        notes: "الجيزة تشهد طفرة عقارية كبيرة خاصة في مناطق الأهرامات والشيخ زايد",
        notesEn: "Giza witnesses significant real estate boom especially in Pyramids and Sheikh Zayed areas"
      },
      {
        city: "القاهرة الجديدة",
        avgPrice: "4200000",
        demandLevel: "high",
        changePercent: "18",
        notes: "القاهرة الجديدة تتصدر قائمة المناطق الأكثر طلباً للعائلات والمستثمرين",
        notesEn: "New Cairo leads the list of most demanded areas for families and investors"
      },
      {
        city: "الإسكندرية",
        avgPrice: "2800000",
        demandLevel: "medium",
        changePercent: "8",
        notes: "الإسكندرية تشهد نمواً متوازناً مع تزايد الطلب على العقارات الساحلية",
        notesEn: "Alexandria sees balanced growth with increasing demand for coastal properties"
      },
      {
        city: "الساحل الشمالي",
        avgPrice: "5500000",
        demandLevel: "high",
        changePercent: "25",
        notes: "الساحل الشمالي يحقق أعلى معدلات نمو مع افتتاح مشاريع فاخرة جديدة",
        notesEn: "North Coast achieves highest growth rates with new luxury project openings"
      },
      {
        city: "6 أكتوبر",
        avgPrice: "2400000",
        demandLevel: "high",
        changePercent: "14",
        notes: "6 أكتوبر تجذب المستثمرين بأسعارها التنافسية وموقعها الاستراتيجي",
        notesEn: "6th of October attracts investors with competitive prices and strategic location"
      },
      {
        city: "مدينة نصر",
        avgPrice: "3800000",
        demandLevel: "medium",
        changePercent: "7",
        notes: "مدينة نصر تحافظ على مكانتها كوجهة سكنية راقية في قلب القاهرة",
        notesEn: "Nasr City maintains its status as upscale residential destination in Cairo's heart"
      },
      {
        city: "المعادي",
        avgPrice: "4500000",
        demandLevel: "medium",
        changePercent: "9",
        notes: "المعادي تستقطب العائلات الباحثة عن الهدوء والرقي في العاصمة",
        notesEn: "Maadi attracts families seeking tranquility and sophistication in the capital"
      },
      {
        city: "الشروق",
        avgPrice: "1900000",
        demandLevel: "high",
        changePercent: "20",
        notes: "الشروق تشهد إقبالاً كبيراً من الشباب والمستثمرين بفضل أسعارها المناسبة",
        notesEn: "El Shorouk sees high demand from youth and investors due to affordable prices"
      },
      {
        city: "التجمع الخامس",
        avgPrice: "4800000",
        demandLevel: "high",
        changePercent: "16",
        notes: "التجمع الخامس يواصل نموه كمركز عقاري متكامل للسكن والاستثمار",
        notesEn: "Fifth Settlement continues growth as integrated real estate hub for living and investment"
      },
      {
        city: "الغردقة",
        avgPrice: "3200000",
        demandLevel: "medium",
        changePercent: "11",
        notes: "الغردقة تجذب المستثمرين الباحثين عن عوائد سياحية مستدامة",
        notesEn: "Hurghada attracts investors seeking sustainable tourism returns"
      },
      {
        city: "العين السخنة",
        avgPrice: "2600000",
        demandLevel: "medium",
        changePercent: "13",
        notes: "العين السخنة تنمو كوجهة استثمارية للوحدات الساحلية والمنتجعات",
        notesEn: "Ain Sokhna grows as investment destination for coastal units and resorts"
      }
    ];

    for (const trend of marketTrendsData) {
      await storage.createMarketTrend(trend);
    }
    console.log("Market trends seeded successfully");

    // Seed properties - 25+ diverse listings across Egypt
    const propertiesData = [
      // Luxury Villas
      {
        title: "فيلا فاخرة بمسبح خاص ونادي صحي",
        titleEn: "Luxury Villa with Private Pool and Spa",
        city: "القاهرة الجديدة",
        propertyType: "فيلا",
        price: "8500000",
        sizeSqm: "450",
        description: "مش مجرد فيلا — بداية جديدة لحياة العائلة. تصميم عصري مع حديقة خاصة ومسبح ونادي صحي متكامل.",
        descriptionEn: "Not just a villa - a new beginning for family life. Modern design with private garden, pool, and complete spa facilities.",
        images: ["/assets/generated_images/Luxury_villa_exterior_property_2b7f2ac4.png"],
        status: "available"
      },
      {
        title: "فيلا على البحر مباشرة - ساحل الشمالي",
        titleEn: "Beachfront Villa - North Coast",
        city: "الساحل الشمالي",
        propertyType: "فيلا",
        price: "15000000",
        sizeSqm: "500",
        description: "حلم الحياة على البحر. استيقظ على صوت الأمواج كل يوم. إطلالة بانورامية على البحر الأبيض المتوسط.",
        descriptionEn: "The dream of beachfront living. Wake up to the sound of waves every day. Panoramic Mediterranean sea views.",
        images: ["/assets/generated_images/Luxury_villa_exterior_property_2b7f2ac4.png"],
        status: "available"
      },
      {
        title: "فيلا ذكية بتقنيات حديثة - التجمع الخامس",
        titleEn: "Smart Villa with Modern Technology - Fifth Settlement",
        city: "التجمع الخامس",
        propertyType: "فيلا",
        price: "12000000",
        sizeSqm: "420",
        description: "فيلا ذكية متكاملة مع نظام أتمتة منزلية متطور. حماية محيطية وأمان 24/7.",
        descriptionEn: "Fully smart villa with advanced home automation system. Perimeter security and 24/7 protection.",
        images: ["/assets/generated_images/Luxury_villa_exterior_property_2b7f2ac4.png"],
        status: "available"
      },
      {
        title: "فيلا كلاسيكية فاخرة - المعادي",
        titleEn: "Classic Luxury Villa - Maadi",
        city: "المعادي",
        propertyType: "فيلا",
        price: "18000000",
        sizeSqm: "550",
        description: "تحفة معمارية كلاسيكية في قلب المعادي. حديقة واسعة ومساحات خضراء خلابة.",
        descriptionEn: "Classic architectural masterpiece in the heart of Maadi. Spacious garden and stunning green spaces.",
        images: ["/assets/generated_images/Luxury_villa_exterior_property_2b7f2ac4.png"],
        status: "available"
      },
      {
        title: "فيلا توأم في كمبوند راقي - 6 أكتوبر",
        titleEn: "Twin Villa in Premium Compound - 6th October",
        city: "6 أكتوبر",
        propertyType: "فيلا",
        price: "6800000",
        sizeSqm: "380",
        description: "فيلا توأم في أرقى كمبوندات أكتوبر. خدمات متكاملة ومساحات خضراء.",
        descriptionEn: "Twin villa in 6th October's finest compounds. Complete services and green spaces.",
        images: ["/assets/generated_images/Luxury_villa_exterior_property_2b7f2ac4.png"],
        status: "available"
      },
      // Premium Apartments
      {
        title: "شقة أنيقة في برج سكني فاخر",
        titleEn: "Elegant Apartment in Luxury Tower",
        city: "القاهرة",
        propertyType: "شقة",
        price: "3200000",
        sizeSqm: "180",
        description: "مش مجرد شقة — بداية جديدة لحياتك. موقع استراتيجي وإطلالة ساحرة على النيل.",
        descriptionEn: "Not just an apartment - a new beginning for your life. Strategic location with stunning Nile views.",
        images: ["/assets/generated_images/Elegant_apartment_interior_081d6ca6.png"],
        status: "available"
      },
      {
        title: "شقة عائلية واسعة - مدينة نصر",
        titleEn: "Spacious Family Apartment - Nasr City",
        city: "مدينة نصر",
        propertyType: "شقة",
        price: "4100000",
        sizeSqm: "220",
        description: "شقة عائلية فاخرة في قلب مدينة نصر. 4 غرف نوم وريسبشن واسع.",
        descriptionEn: "Luxury family apartment in the heart of Nasr City. 4 bedrooms and spacious reception.",
        images: ["/assets/generated_images/Elegant_apartment_interior_081d6ca6.png"],
        status: "available"
      },
      {
        title: "شقة فندقية بخدمات متكاملة",
        titleEn: "Serviced Hotel Apartment",
        city: "الإسكندرية",
        propertyType: "شقة",
        price: "2800000",
        sizeSqm: "150",
        description: "استثمار مربح مع عائد سنوي مضمون 12%. إدارة فندقية احترافية وصيانة دورية.",
        descriptionEn: "Profitable investment with guaranteed 12% annual return. Professional hotel management and regular maintenance.",
        images: ["/assets/generated_images/Elegant_apartment_interior_081d6ca6.png"],
        status: "available"
      },
      {
        title: "شقة استوديو عصرية - الشروق",
        titleEn: "Modern Studio Apartment - El Shorouk",
        city: "الشروق",
        propertyType: "شقة",
        price: "1200000",
        sizeSqm: "75",
        description: "استوديو عصري مثالي للشباب والمستثمرين. موقع متميز وسعر تنافسي.",
        descriptionEn: "Modern studio perfect for youth and investors. Prime location and competitive price.",
        images: ["/assets/generated_images/Elegant_apartment_interior_081d6ca6.png"],
        status: "available"
      },
      {
        title: "شقة بإطلالة بحرية - العين السخنة",
        titleEn: "Sea View Apartment - Ain Sokhna",
        city: "العين السخنة",
        propertyType: "شقة",
        price: "2900000",
        sizeSqm: "140",
        description: "شقة سياحية بإطلالة مباشرة على البحر الأحمر. عائد استثماري ممتاز.",
        descriptionEn: "Tourist apartment with direct Red Sea views. Excellent investment return.",
        images: ["/assets/generated_images/Elegant_apartment_interior_081d6ca6.png"],
        status: "available"
      },
      // Penthouses
      {
        title: "بنتهاوس فاخر مع إطلالة بانورامية",
        titleEn: "Luxury Penthouse with Panoramic View",
        city: "الإسكندرية",
        propertyType: "بنتهاوس",
        price: "12000000",
        sizeSqm: "320",
        description: "قمة الفخامة والرفاهية. عيش حلم الإطلالة الكاملة 360 درجة على المدينة والبحر.",
        descriptionEn: "The pinnacle of luxury and elegance. Live the dream with 360-degree city and sea views.",
        images: ["/assets/generated_images/Luxury_residential_tower_night_44050edf.png"],
        status: "reserved"
      },
      {
        title: "بنتهاوس دوبلكس في برج فاخر - الجيزة",
        titleEn: "Duplex Penthouse in Luxury Tower - Giza",
        city: "الجيزة",
        propertyType: "بنتهاوس",
        price: "14500000",
        sizeSqm: "380",
        description: "بنتهاوس دوبلكس استثنائي مع تراس خاص وجاكوزي خارجي. إطلالة على الأهرامات.",
        descriptionEn: "Exceptional duplex penthouse with private terrace and outdoor jacuzzi. Pyramids views.",
        images: ["/assets/generated_images/Luxury_residential_tower_night_44050edf.png"],
        status: "available"
      },
      {
        title: "بنتهاوس بحديقة علوية - القاهرة الجديدة",
        titleEn: "Penthouse with Rooftop Garden - New Cairo",
        city: "القاهرة الجديدة",
        propertyType: "بنتهاوس",
        price: "10800000",
        sizeSqm: "290",
        description: "بنتهاوس فريد مع حديقة علوية مساحة 150 متر. تصميم معماري مبتكر.",
        descriptionEn: "Unique penthouse with 150sqm rooftop garden. Innovative architectural design.",
        images: ["/assets/generated_images/Luxury_residential_tower_night_44050edf.png"],
        status: "available"
      },
      // Duplexes
      {
        title: "دوبلكس عصري في كمبوند مغلق",
        titleEn: "Modern Duplex in Gated Compound",
        city: "القاهرة الجديدة",
        propertyType: "دوبلكس",
        price: "5500000",
        sizeSqm: "280",
        description: "استثمار ذكي في موقع مميز. أمان وراحة ومستوى معيشة عالي مع جميع الخدمات.",
        descriptionEn: "Smart investment in a prime location. Security, comfort, and high living standards with all services.",
        images: ["/assets/generated_images/Luxury_villa_exterior_property_2b7f2ac4.png"],
        status: "available"
      },
      {
        title: "دوبلكس بحديقة خاصة - التجمع الخامس",
        titleEn: "Duplex with Private Garden - Fifth Settlement",
        city: "التجمع الخامس",
        propertyType: "دوبلكس",
        price: "6200000",
        sizeSqm: "310",
        description: "دوبلكس فاخر بحديقة خاصة 80 متر. تشطيب سوبر لوكس وموقع راقي.",
        descriptionEn: "Luxury duplex with 80sqm private garden. Super lux finishing and upscale location.",
        images: ["/assets/generated_images/Luxury_villa_exterior_property_2b7f2ac4.png"],
        status: "available"
      },
      {
        title: "دوبلكس مودرن في كمبوند - 6 أكتوبر",
        titleEn: "Modern Duplex in Compound - 6th October",
        city: "6 أكتوبر",
        propertyType: "دوبلكس",
        price: "4300000",
        sizeSqm: "250",
        description: "دوبلكس عصري بسعر مناسب في كمبوند متكامل الخدمات. نادي رياضي ومول تجاري.",
        descriptionEn: "Modern duplex at reasonable price in full-service compound. Sports club and commercial mall.",
        images: ["/assets/generated_images/Luxury_villa_exterior_property_2b7f2ac4.png"],
        status: "available"
      },
      // Commercial & Investment Units
      {
        title: "محل تجاري في موقع حيوي - مدينة نصر",
        titleEn: "Commercial Shop in Prime Location - Nasr City",
        city: "مدينة نصر",
        propertyType: "محل تجاري",
        price: "3500000",
        sizeSqm: "85",
        description: "محل تجاري بواجهة زجاجية في أكثر المناطق حيوية. عائد استثماري 15% سنوياً.",
        descriptionEn: "Commercial shop with glass facade in busiest area. 15% annual investment return.",
        images: ["/assets/generated_images/Elegant_apartment_interior_081d6ca6.png"],
        status: "available"
      },
      {
        title: "وحدة إدارية في برج تجاري - القاهرة",
        titleEn: "Administrative Unit in Commercial Tower - Cairo",
        city: "القاهرة",
        propertyType: "مكتب إداري",
        price: "2100000",
        sizeSqm: "120",
        description: "وحدة إدارية بموقع استراتيجي للشركات. مواقف مخصصة وأمن على مدار الساعة.",
        descriptionEn: "Administrative unit in strategic location for businesses. Dedicated parking and 24/7 security.",
        images: ["/assets/generated_images/Elegant_apartment_interior_081d6ca6.png"],
        status: "available"
      },
      {
        title: "شاليه سياحي فاخر - الساحل الشمالي",
        titleEn: "Luxury Tourist Chalet - North Coast",
        city: "الساحل الشمالي",
        propertyType: "شاليه",
        price: "4800000",
        sizeSqm: "160",
        description: "شاليه سياحي على البحر مباشرة في أرقى القرى السياحية. مسبح مشترك ومرافق ترفيهية.",
        descriptionEn: "Tourist chalet directly on the beach in finest tourist villages. Shared pool and recreational facilities.",
        images: ["/assets/generated_images/Luxury_villa_exterior_property_2b7f2ac4.png"],
        status: "available"
      },
      {
        title: "شقة استثمارية جاهزة للتأجير - الغردقة",
        titleEn: "Ready-to-Rent Investment Apartment - Hurghada",
        city: "الغردقة",
        propertyType: "شقة",
        price: "1900000",
        sizeSqm: "110",
        description: "شقة سياحية مفروشة بالكامل وجاهزة للتأجير. عائد شهري مضمون من الإدارة الفندقية.",
        descriptionEn: "Fully furnished tourist apartment ready to rent. Guaranteed monthly return from hotel management.",
        images: ["/assets/generated_images/Elegant_apartment_interior_081d6ca6.png"],
        status: "available"
      },
      // Mid-range & Affordable Options
      {
        title: "شقة عائلية بسعر مناسب - الشروق",
        titleEn: "Affordable Family Apartment - El Shorouk",
        city: "الشروق",
        propertyType: "شقة",
        price: "1650000",
        sizeSqm: "140",
        description: "شقة عائلية 3 غرف بسعر ممتاز. تشطيب فاخر وموقع قريب من الخدمات.",
        descriptionEn: "3-bedroom family apartment at excellent price. Luxury finishing and close to services.",
        images: ["/assets/generated_images/Elegant_apartment_interior_081d6ca6.png"],
        status: "available"
      },
      {
        title: "شقة للتمليك بالتقسيط - 6 أكتوبر",
        titleEn: "Installment Ownership Apartment - 6th October",
        city: "6 أكتوبر",
        propertyType: "شقة",
        price: "2100000",
        sizeSqm: "165",
        description: "شقة للتمليك بنظام تقسيط ميسر. مقدم 20% والباقي على 5 سنوات.",
        descriptionEn: "Ownership apartment with easy installment plan. 20% down payment and 5-year installments.",
        images: ["/assets/generated_images/Elegant_apartment_interior_081d6ca6.png"],
        status: "available"
      },
      {
        title: "فيلا متوسطة المساحة - الشروق",
        titleEn: "Medium-Sized Villa - El Shorouk",
        city: "الشروق",
        propertyType: "فيلا",
        price: "3800000",
        sizeSqm: "240",
        description: "فيلا بمساحة متوسطة مثالية للأسر الصغيرة. حديقة صغيرة وموقف سيارات.",
        descriptionEn: "Medium-sized villa perfect for small families. Small garden and car parking.",
        images: ["/assets/generated_images/Luxury_villa_exterior_property_2b7f2ac4.png"],
        status: "available"
      },
      {
        title: "شقة بروف بإطلالة - المعادي",
        titleEn: "Roof Apartment with View - Maadi",
        city: "المعادي",
        propertyType: "شقة",
        price: "5200000",
        sizeSqm: "200",
        description: "شقة بروف فريدة في المعادي الجديدة. روف واسع 100 متر للاستمتاع بالهواء الطلق.",
        descriptionEn: "Unique roof apartment in New Maadi. 100sqm spacious roof for outdoor enjoyment.",
        images: ["/assets/generated_images/Elegant_apartment_interior_081d6ca6.png"],
        status: "available"
      },
      {
        title: "توين هاوس في كمبوند عائلي - التجمع",
        titleEn: "Townhouse in Family Compound - El Tagamoa",
        city: "التجمع الخامس",
        propertyType: "توين هاوس",
        price: "7200000",
        sizeSqm: "340",
        description: "توين هاوس فاخر في كمبوند عائلي هادئ. حديقة خاصة ومساحات خضراء واسعة.",
        descriptionEn: "Luxury townhouse in quiet family compound. Private garden and wide green spaces.",
        images: ["/assets/generated_images/Luxury_villa_exterior_property_2b7f2ac4.png"],
        status: "available"
      },
      {
        title: "شقة بجاردن في الدور الأرضي - الجيزة",
        titleEn: "Ground Floor Garden Apartment - Giza",
        city: "الجيزة",
        propertyType: "شقة",
        price: "3600000",
        sizeSqm: "190",
        description: "شقة أرضي بجاردن 120 متر. مثالية للعائلات ومحبي المساحات الخضراء.",
        descriptionEn: "Ground floor apartment with 120sqm garden. Perfect for families and green space lovers.",
        images: ["/assets/generated_images/Elegant_apartment_interior_081d6ca6.png"],
        status: "available"
      }
    ];

    for (const property of propertiesData) {
      await storage.createProperty(property);
    }
    console.log("Properties seeded successfully");

    // Seed content/blog posts - Rich educational content
    const contentData = [
      {
        title: "دليلك الشامل لشراء أول عقار في 2024",
        titleEn: "Your Complete Guide to Buying Your First Property in 2024",
        body: "شراء العقار الأول خطوة مهمة تحتاج تخطيط دقيق ومدروس. في هذا الدليل الشامل، نوضح كل خطوة من دراسة السوق العقاري بشكل احترافي، تحديد الميزانية الواقعية والتمويل المناسب، اختيار الموقع الاستراتيجي المثالي، التفاوض على السعر، والإجراءات القانونية الكاملة لضمان معاملة آمنة ومربحة.",
        bodyEn: "Buying your first property is an important step that requires careful and thoughtful planning. In this comprehensive guide, we explain every step from professional real estate market research, determining realistic budget and appropriate financing, choosing the perfect strategic location, price negotiation, and complete legal procedures to ensure a safe and profitable transaction.",
        category: "buying-guide"
      },
      {
        title: "5 علامات تدل على أن العقار استثمار ذهبي",
        titleEn: "5 Signs That a Property is a Golden Investment",
        body: "كيف تعرف أن العقار اللي بتشوفه استثمار صح يحقق عوائد مضمونة؟ نكشف العلامات الخمسة الأساسية: الموقع الاستراتيجي القريب من الخدمات الحيوية، معدل النمو المتصاعد في المنطقة، البنية التحتية المتطورة والمشاريع القادمة، العائد الإيجاري المتوقع مقارنة بالسعر، ومستوى الطلب الفعلي في المنطقة من خلال بيانات السوق الحقيقية.",
        bodyEn: "How do you know if the property you're looking at is the right investment with guaranteed returns? We reveal the five essential signs: strategic location near vital services, escalating growth rate in the area, advanced infrastructure and upcoming projects, expected rental return compared to price, and actual demand level in the area through real market data.",
        category: "investment-tips"
      },
      {
        title: "أخطاء شائعة في الاستثمار العقاري وكيف تتجنبها",
        titleEn: "Common Real Estate Investment Mistakes and How to Avoid Them",
        body: "تجنب الأخطاء الفادحة التي يقع فيها المستثمرون الجدد وتكلفهم ملايين الجنيهات. نناقش بالتفصيل: المبالغة في دفع السعر بسبب العاطفة، إهمال أهمية الموقع والمنطقة، عدم دراسة السوق والاعتماد على كلام السماسرة فقط، التسرع في اتخاذ القرار دون استشارة خبراء، وتجاهل التكاليف الخفية والصيانة المستقبلية.",
        bodyEn: "Avoid fatal mistakes that new investors make and cost them millions of pounds. We discuss in detail: overpaying due to emotion, neglecting the importance of location and area, lack of market research and relying only on broker talk, hasty decision-making without consulting experts, and ignoring hidden costs and future maintenance.",
        category: "investment-tips"
      },
      {
        title: "الساحل الشمالي 2024: أفضل المناطق للاستثمار العقاري",
        titleEn: "North Coast 2024: Best Areas for Real Estate Investment",
        body: "الساحل الشمالي يشهد طفرة عقارية غير مسبوقة مع افتتاح مشاريع فاخرة جديدة. نستعرض أفضل المناطق الاستثمارية: رأس الحكمة والعلمين الجديدة بمشاريعها الضخمة، مارينا ومراسي الساحل بعوائدها المرتفعة، وسيدي عبد الرحمن بموقعها الاستراتيجي. نقارن الأسعار والعوائد المتوقعة والمشاريع الجديدة.",
        bodyEn: "The North Coast is witnessing an unprecedented real estate boom with new luxury projects. We review the best investment areas: Ras El Hikma and New Alamein with their massive projects, Marina and Marassi Coast with their high returns, and Sidi Abdel Rahman with its strategic location. We compare prices, expected returns, and new projects.",
        category: "market-analysis"
      },
      {
        title: "التمويل العقاري في مصر: كل ما تحتاج معرفته",
        titleEn: "Real Estate Financing in Egypt: Everything You Need to Know",
        body: "التمويل العقاري أصبح الخيار الأمثل للكثيرين. نشرح أنواع التمويل المتاحة، شروط الحصول على قرض عقاري، مقارنة بين البنوك المختلفة، حساب الفائدة والأقساط الشهرية، والمستندات المطلوبة. دليل عملي لاختيار أفضل تمويل يناسب ميزانيتك.",
        bodyEn: "Real estate financing has become the optimal choice for many. We explain available financing types, mortgage requirements, comparison between different banks, calculating interest and monthly installments, and required documents. A practical guide to choosing the best financing that suits your budget.",
        category: "financing"
      },
      {
        title: "القاهرة الجديدة vs التجمع الخامس: أيهما أفضل للاستثمار؟",
        titleEn: "New Cairo vs Fifth Settlement: Which is Better for Investment?",
        body: "مقارنة شاملة بين منطقتين من أهم مناطق الاستثمار العقاري في مصر. نحلل الأسعار الحالية والنمو المتوقع، البنية التحتية والخدمات، المشاريع الجديدة، العائد الإيجاري، وإمكانات النمو المستقبلية. تحليل مبني على بيانات حقيقية من السوق.",
        bodyEn: "Comprehensive comparison between two of the most important real estate investment areas in Egypt. We analyze current prices and expected growth, infrastructure and services, new projects, rental returns, and future growth potential. Analysis based on real market data.",
        category: "market-analysis"
      },
      {
        title: "كيف تقيّم العقار قبل الشراء: دليل الخبراء",
        titleEn: "How to Evaluate Property Before Buying: Expert Guide",
        body: "تقييم العقار بشكل صحيح يوفر عليك الكثير. نشرح كيفية فحص البناء والتشطيبات، تقييم الموقع والمنطقة المحيطة، التحقق من الأوراق القانونية، حساب القيمة الحقيقية مقابل سعر البيع، والكشف عن المشاكل الخفية. خطوات عملية لاتخاذ قرار سليم.",
        bodyEn: "Proper property evaluation saves you a lot. We explain how to inspect construction and finishes, evaluate location and surrounding area, verify legal documents, calculate real value against sale price, and detect hidden problems. Practical steps for making a sound decision.",
        category: "buying-guide"
      },
      {
        title: "الاستثمار في العقارات السياحية: الغردقة والعين السخنة",
        titleEn: "Tourist Property Investment: Hurghada and Ain Sokhna",
        body: "العقارات السياحية توفر عوائد مرتفعة على مدار العام. نستعرض فرص الاستثمار في الغردقة بموقعها السياحي العالمي، والعين السخنة القريبة من القاهرة. نقارن الأسعار، العائد الإيجاري من السياح، تكاليف الإدارة والصيانة، والطلب على الإيجار الصيفي والشتوي.",
        bodyEn: "Tourist properties offer high returns year-round. We review investment opportunities in Hurghada with its global tourist location, and Ain Sokhna close to Cairo. We compare prices, rental income from tourists, management and maintenance costs, and demand for summer and winter rentals.",
        category: "investment-tips"
      },
      {
        title: "الاستثمار في الشقق الفندقية: مميزات ومخاطر",
        titleEn: "Hotel Apartment Investment: Advantages and Risks",
        body: "الشقق الفندقية أصبحت من أكثر الاستثمارات العقارية جاذبية. نحلل المميزات: عوائد شهرية ثابتة، إدارة احترافية، صيانة مستمرة. والمخاطر: ارتباط العائد بمعدلات الإشغال، رسوم الإدارة، والقيود على الاستخدام الشخصي. دليل شامل لاتخاذ القرار الصحيح.",
        bodyEn: "Hotel apartments have become one of the most attractive real estate investments. We analyze advantages: fixed monthly returns, professional management, continuous maintenance. And risks: return linked to occupancy rates, management fees, and restrictions on personal use. Comprehensive guide for making the right decision.",
        category: "investment-tips"
      },
      {
        title: "المناطق الصاعدة في القاهرة الكبرى 2024",
        titleEn: "Emerging Areas in Greater Cairo 2024",
        body: "اكتشف المناطق الواعدة التي تشهد نمواً سريعاً وأسعاراً تنافسية: الشروق ومدينتي بطلبها المتزايد، بدر والعبور بمشاريعهما الجديدة، و15 مايو بموقعها الاستراتيجي. نحلل معدلات النمو، الأسعار الحالية، المشاريع القادمة، والعائد الاستثماري المتوقع على المدى القصير والطويل.",
        bodyEn: "Discover promising areas experiencing rapid growth and competitive prices: El Shorouk and Madinaty with their increasing demand, Badr and El Obour with their new projects, and 15th of May with its strategic location. We analyze growth rates, current prices, upcoming projects, and expected investment return in short and long term.",
        category: "market-analysis"
      },
      {
        title: "الأوراق القانونية الضرورية لشراء عقار",
        titleEn: "Essential Legal Documents for Buying Property",
        body: "حماية استثمارك تبدأ من التأكد من الأوراق القانونية. نوضح المستندات الضرورية: عقد الملكية الموثق، شهادة عدم التعرض، رخصة البناء، صورة طبق الأصل من السجل العيني، مخططات البناء المعتمدة، وشهادات سداد المرافق. قائمة شاملة لضمان معاملة آمنة تماماً.",
        bodyEn: "Protecting your investment starts with verifying legal documents. We clarify necessary documents: notarized ownership deed, non-encroachment certificate, building permit, certified copy from real estate registry, approved construction plans, and utility payment certificates. Comprehensive checklist to ensure completely safe transaction.",
        category: "buying-guide"
      },
      {
        title: "الفرق بين الكمبوندات السكنية والأحياء التقليدية",
        titleEn: "Difference Between Residential Compounds and Traditional Neighborhoods",
        body: "اختيار بين الكمبوند أو الحي التقليدي قرار مهم. نقارن المميزات والعيوب: الأمان والخدمات في الكمبوندات، رسوم الصيانة الشهرية، الخصوصية والمساحات الخضراء، القرب من الخدمات العامة في الأحياء، وتكاليف المعيشة. تحليل يساعدك على الاختيار الأنسب لأسلوب حياتك.",
        bodyEn: "Choosing between compound or traditional neighborhood is an important decision. We compare pros and cons: security and services in compounds, monthly maintenance fees, privacy and green spaces, proximity to public services in neighborhoods, and living costs. Analysis helps you choose what best suits your lifestyle.",
        category: "buying-guide"
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
