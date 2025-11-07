import HeroSection from '../HeroSection';

export default function HeroSectionExample() {
  return (
    <HeroSection 
      language="ar" 
      onCTAClick={() => console.log('Hero CTA clicked')} 
    />
  );
}
