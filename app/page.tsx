"use client";

import Navbar from '../app/components/Navbar';
import HeroSection from '../app/components/HeroSection';
import FeaturesSection from '../app/components/FeaturesSection';
import ProductsPreview from '../app/components/ProductsPreview';
import AboutSection from '../app/components/AboutSection';
import ContactSection from '../app/components/ContactSection';
import Footer from '../app/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <ProductsPreview />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
}