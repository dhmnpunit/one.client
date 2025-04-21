"use client"; // Mark this as a Client Component

import React, { useEffect } from "react";
import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import { deferAfterInteractive, prefetchResources } from "../lib/performance";
import FeatureSection from "../components/landing/FeatureSection";
import PricingSection from "../components/landing/PricingSection";
import CtaSection from "../components/landing/CtaSection";
import FaqSection from "../components/landing/FaqSection";

const Index = () => {
  // Smooth scroll function for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      
      if (anchor) {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        
        if (targetId && targetId !== '#') {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            window.scrollTo({
              top: targetElement.getBoundingClientRect().top + window.pageYOffset - 80,
              behavior: 'smooth'
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    
    // Prefetch resources for better performance
    deferAfterInteractive(() => {
      prefetchResources([
        // Add critical resources here
        // '/assets/fonts.css', // This likely needs to be handled differently in Next.js (e.g., via _document or layout)
      ]);
    });
    
    return () => {
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <div className="pt-20">
          <FeatureSection />
          <PricingSection />
          <FaqSection />
          <CtaSection />
        </div>
      </main>
    </div>
  );
};

export default Index;
