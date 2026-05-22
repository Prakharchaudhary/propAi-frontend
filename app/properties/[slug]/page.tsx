import type { Metadata } from 'next';
import PropertyDetailClient from './PropertyDetailClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { WhatsAppFloatingButton } from '@/components/WhatsAppButton';
import ChatWidget from '@/components/ChatWidget';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${title} — PropAI | Property Details`,
    description: `View full details, photos, amenities, and pricing for ${title} on PropAI. RERA verified listing with AI match score.`,
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  return (
    <main className="min-h-screen bg-[#0a1120]">
      <Navbar />
      <PropertyDetailClient slug={slug} />
      <Footer />
      <ChatWidget />
      <WhatsAppFloatingButton />
    </main>
  );
}
