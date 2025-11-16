export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    // Navigation
    home: 'الرئيسية',
    properties: 'العقارات',
    dashboard: 'لوحة التحكم',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    profile: 'الملف الشخصي',
    
    // Hero
    heroTitle: 'اكتشف عقارك المثالي في أسيوط',
    heroSubtitle: 'منصة عقارية ذكية في أسيوط تجمع بينك وبين أفضل العقارات باستخدام تقنيات الذكاء الاصطناعي',
    searchPlaceholder: 'ابحث عن موقع أو نوع العقار',
    getStarted: 'ابدأ الآن',
    exploreProperties: 'استكشف العقارات',
    
    // Property
    price: 'السعر',
    bedrooms: 'غرف النوم',
    bathrooms: 'الحمامات',
    size: 'المساحة',
    sqm: 'م²',
    trustScore: 'درجة الثقة',
    matchScore: 'نسبة التطابق',
    viewDetails: 'عرض التفاصيل',
    contactDeveloper: 'تواصل مع المطور',
    
    // Trust Score
    trustScoreTitle: 'درجة ثقة المطور',
    contracts: 'العقود',
    completed: 'منجز',
    complaints: 'الشكاوى',
    rating: 'التقييم',
    
    // AI Closer
    aiAssistant: 'المساعد الذكي',
    startChat: 'ابدأ المحادثة',
    purchaseProbability: 'احتمالية الشراء',
    
    // Profile Builder
    buildProfile: 'بناء ملفك الشخصي',
    riskTolerance: 'تحمل المخاطر',
    decisionType: 'نوع القرار',
    budget: 'الميزانية',
    preferredCities: 'المدن المفضلة',
    propertyTypes: 'أنواع العقارات',
    
    // Developer Dashboard
    leads: 'العملاء المحتملون',
    analytics: 'التحليلات',
    optimization: 'التحسين',
    
    // Admin
    users: 'المستخدمين',
    developers: 'المطورين',
    behavioralFunnel: 'مسار السلوك',
    aiPerformance: 'أداء الذكاء الاصطناعي',
    
    // Common
    save: 'حفظ',
    cancel: 'إلغاء',
    edit: 'تعديل',
    delete: 'حذف',
    loading: 'جاري التحميل...',
    error: 'حدث خطأ',
    success: 'نجح',
    noData: 'لا توجد بيانات',
  },
  en: {
    // Navigation
    home: 'Home',
    properties: 'Properties',
    dashboard: 'Dashboard',
    login: 'Login',
    logout: 'Logout',
    profile: 'Profile',
    
    // Hero
    heroTitle: 'Discover Your Perfect Property in Asyut',
    heroSubtitle: 'Smart real estate platform in Asyut matching you with the best properties using AI technology',
    searchPlaceholder: 'Search for location or property type',
    getStarted: 'Get Started',
    exploreProperties: 'Explore Properties',
    
    // Property
    price: 'Price',
    bedrooms: 'Bedrooms',
    bathrooms: 'Bathrooms',
    size: 'Size',
    sqm: 'sqm',
    trustScore: 'Trust Score',
    matchScore: 'Match Score',
    viewDetails: 'View Details',
    contactDeveloper: 'Contact Developer',
    
    // Trust Score
    trustScoreTitle: 'Developer Trust Score',
    contracts: 'Contracts',
    completed: 'Completed',
    complaints: 'Complaints',
    rating: 'Rating',
    
    // AI Closer
    aiAssistant: 'AI Assistant',
    startChat: 'Start Chat',
    purchaseProbability: 'Purchase Probability',
    
    // Profile Builder
    buildProfile: 'Build Your Profile',
    riskTolerance: 'Risk Tolerance',
    decisionType: 'Decision Type',
    budget: 'Budget',
    preferredCities: 'Preferred Cities',
    propertyTypes: 'Property Types',
    
    // Developer Dashboard
    leads: 'Leads',
    analytics: 'Analytics',
    optimization: 'Optimization',
    
    // Admin
    users: 'Users',
    developers: 'Developers',
    behavioralFunnel: 'Behavioral Funnel',
    aiPerformance: 'AI Performance',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success',
    noData: 'No data available',
  },
};

export function formatPrice(price: number, lang: Language): string {
  const formatted = new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
  
  return formatted;
}
