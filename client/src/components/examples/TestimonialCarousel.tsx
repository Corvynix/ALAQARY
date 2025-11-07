import TestimonialCarousel from '../TestimonialCarousel';

export default function TestimonialCarouselExample() {
  const mockTestimonials = [
    {
      name: "أحمد محمود",
      role: "مستثمر عقاري",
      content: "ساعدني في اختيار العقار المثالي. التوجيه كان احترافي جداً والنتيجة فاقت توقعاتي. استثماري نما بنسبة 40% في سنة واحدة.",
      initial: "أ"
    },
    {
      name: "سارة عبد الله",
      role: "مالكة منزل",
      content: "مش مجرد مستشار عقاري، ده شريك نجاح حقيقي. فهم احتياجاتي وساعدني أوصل لحلم البيت اللي كنت بحلم بيه.",
      initial: "س"
    },
    {
      name: "محمد علي",
      role: "رجل أعمال",
      content: "الخبرة والاحترافية في أعلى مستوياتها. كل نصيحة كانت مبنية على دراسة عميقة للسوق. أنصح بشدة بالتعامل معه.",
      initial: "م"
    }
  ];

  return <TestimonialCarousel language="ar" testimonials={mockTestimonials} />;
}
