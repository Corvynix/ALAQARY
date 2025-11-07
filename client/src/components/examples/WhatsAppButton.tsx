import WhatsAppButton from '../WhatsAppButton';

export default function WhatsAppButtonExample() {
  return (
    <div className="h-96 relative">
      <WhatsAppButton 
        phoneNumber="201234567890" 
        language="ar" 
      />
    </div>
  );
}
