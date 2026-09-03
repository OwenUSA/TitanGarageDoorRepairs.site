import type { Metadata } from 'next';
import { meta } from '@/content/copy';
import { business } from '@/lib/business';
import ServicesHero from '@/components/sections/ServicesHero';
import ServicesList from '@/components/sections/ServicesList';
import ServicesFaq from '@/components/sections/ServicesFaq';
import CtaBand from '@/components/sections/CtaBand';

export const metadata: Metadata = {
  title: meta['/services'].title,
  description: meta['/services'].description,
  alternates: { canonical: '/services' },
  openGraph: {
    title: meta['/services'].title,
    description: meta['/services'].description,
    url: '/services',
    siteName: business.name,
    type: 'website',
    images: [{ url: '/placeholders/services-hero-bg.jpg', width: 1504, height: 704, alt: 'Garage door services in Oklahoma City' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: meta['/services'].title,
    description: meta['/services'].description,
    images: ['/placeholders/services-hero-bg.jpg'],
  },
};

export default function Page() {
  return (
    <>
      <ServicesHero />
      <ServicesList />
      <ServicesFaq />
      <CtaBand />
    </>
  );
}
