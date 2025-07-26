// SEO structured data for better search engine visibility
// This helps Google and other search engines understand our app

interface StructuredDataProps {
  type?: 'WebApplication' | 'SoftwareApplication';
  name?: string;
  description?: string;
  url?: string;
}

/**
 * Adds structured data markup to help search engines
 * Think of this as telling Google "hey, this is a cool app!"
 */
export default function StructuredData({
  type = 'WebApplication',
  name = 'Snap2Slides',
  description = 'Transform any image into beautiful presentation slides with AI',
  url = process.env.NEXT_PUBLIC_APP_URL || 'https://snap2slides.vercel.app'
}: StructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    description,
    url,
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    author: {
      '@type': 'Person',
      name: 'Saurabh Pareek',
      email: 'saurabhpareek228@gmail.com',
      sameAs: 'https://github.com/SaurabhCodesAI'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData)
      }}
    />
  );
}