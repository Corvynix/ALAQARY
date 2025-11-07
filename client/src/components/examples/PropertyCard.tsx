import PropertyCard from '../PropertyCard';
import villaImage from '@assets/generated_images/Luxury_villa_exterior_property_2b7f2ac4.png';

export default function PropertyCardExample() {
  return (
    <div className="p-6 max-w-md">
      <PropertyCard
        id="1"
        title="فيلا فاخرة بمسبح"
        city="القاهرة الجديدة"
        propertyType="فيلا"
        price="8.5M EGP"
        sizeSqm={450}
        description="مش مجرد فيلا — بداية جديدة لحياة العائلة. تصميم عصري مع حديقة خاصة."
        image={villaImage}
        status="available"
        language="ar"
        onLearnMore={(id) => console.log('Learn more clicked:', id)}
      />
    </div>
  );
}
