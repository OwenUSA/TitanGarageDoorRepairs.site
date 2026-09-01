import type { Metadata } from 'next';
import { meta } from '@/content/copy';
import ServicesHero from '@/components/sections/ServicesHero';
import ServicesList from '@/components/sections/ServicesList';
import ServicesFaq from '@/components/sections/ServicesFaq';
import CtaBand from '@/components/sections/CtaBand';

export const metadata: Metadata = {
  title: meta['/services'].title,
  description: meta['/services'].description,
  alternates: { canonical: '/services' },
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
