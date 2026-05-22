import type { Metadata } from 'next';
import { Suspense } from 'react';
import PropertiesClient from './PropertiesClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { WhatsAppFloatingButton } from '@/components/WhatsAppButton';
import ChatWidget from '@/components/ChatWidget';

export const metadata: Metadata = {
  title: 'Properties — PropAI | Search Flats, Villas & More Across India',
  description: 'Browse 12,400+ AI-verified properties for sale and rent across Mumbai, Delhi, Bangalore, Hyderabad, Gurgaon, Noida and more. Filter by price, BHK, city and more.',
};

export default function PropertiesPage() {
  return (
    <main className="min-h-screen bg-[#0a1120]">
      <Navbar />
      <Suspense fallback={<div className="min-h-[420px]" />}> 
        <PropertiesClient />
      </Suspense>
      <Footer />
      <ChatWidget />
      <WhatsAppFloatingButton />
    </main>
  );
}
