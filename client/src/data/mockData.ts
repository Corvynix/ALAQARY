// Mock data for frontend-only app

export interface Property {
  id: string;
  title: string;
  titleEn: string;
  city: string;
  propertyType: string;
  price: number;
  sizeSqm: number;
  description: string;
  descriptionEn: string;
  images: string[];
  status: "available" | "sold" | "reserved";
}

export interface MarketTrend {
  id: string;
  city: string;
  avgPrice: number;
  demandLevel: "high" | "medium" | "low";
  changePercent: number;
  notes: string;
  notesEn: string;
}

export interface Content {
  id: string;
  title: string;
  titleEn: string;
  body: string;
  bodyEn: string;
  category: string;
}

export const mockProperties: Property[] = [
  {
    id: "1",
    title: "شقة فاخرة في القاهرة الجديدة",
    titleEn: "Luxury Apartment in New Cairo",
    city: "القاهرة الجديدة",
    propertyType: "شقة",
    price: 2500000,
    sizeSqm: 150,
    description: "شقة فاخرة في موقع ممتاز مع إطلالة رائعة",
    descriptionEn: "Luxury apartment in excellent location with great views",
    images: ["/placeholder.png"],
    status: "available"
  },
  {
    id: "2",
    title: "فيلا في الشيخ زايد",
    titleEn: "Villa in Sheikh Zayed",
    city: "الشيخ زايد",
    propertyType: "فيلا",
    price: 5000000,
    sizeSqm: 300,
    description: "فيلا راقية مع حديقة واسعة ومسابح",
    descriptionEn: "Elegant villa with spacious garden and pools",
    images: ["/placeholder.png"],
    status: "available"
  },
  {
    id: "3",
    title: "شقة في الزمالك",
    titleEn: "Apartment in Zamalek",
    city: "الزمالك",
    propertyType: "شقة",
    price: 3500000,
    sizeSqm: 180,
    description: "شقة أنيقة في قلب الزمالك",
    descriptionEn: "Elegant apartment in the heart of Zamalek",
    images: ["/placeholder.png"],
    status: "available"
  }
];

export const mockMarketTrends: MarketTrend[] = [
  {
    id: "1",
    city: "القاهرة",
    avgPrice: 12000000,
    demandLevel: "high",
    changePercent: 15.5,
    notes: "الطلب مرتفع في القاهرة مع زيادة في الأسعار",
    notesEn: "High demand in Cairo with price increases"
  },
  {
    id: "2",
    city: "الإسكندرية",
    avgPrice: 8000000,
    demandLevel: "medium",
    changePercent: 8.2,
    notes: "السوق مستقر في الإسكندرية",
    notesEn: "Stable market in Alexandria"
  },
  {
    id: "3",
    city: "الجيزة",
    avgPrice: 10000000,
    demandLevel: "high",
    changePercent: 12.3,
    notes: "نمو قوي في منطقة الجيزة",
    notesEn: "Strong growth in Giza area"
  }
];

export const mockContent: Content[] = [
  {
    id: "1",
    title: "دليل الاستثمار العقاري للمبتدئين",
    titleEn: "Real Estate Investment Guide for Beginners",
    body: "دليل شامل للبدء في الاستثمار العقاري",
    bodyEn: "Comprehensive guide to start real estate investment",
    category: "استثمار"
  },
  {
    id: "2",
    title: "كيف تختار العقار المناسب",
    titleEn: "How to Choose the Right Property",
    body: "نصائح مهمة لاختيار العقار الذي يناسب احتياجاتك",
    bodyEn: "Important tips for choosing the property that suits your needs",
    category: "نصائح"
  }
];

