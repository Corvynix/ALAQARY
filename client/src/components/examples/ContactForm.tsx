import ContactForm from '../ContactForm';

export default function ContactFormExample() {
  return (
    <ContactForm 
      language="ar" 
      onSubmit={(data) => console.log('Form submitted:', data)} 
    />
  );
}
