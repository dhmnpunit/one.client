// import React, { useState, useEffect, useRef } from "react";
import React, { useEffect, useRef } from "react";
import { ContainerScroll } from "../ui/container-scroll-animation";
import { ArrowRight } from "lucide-react";
import { SimpleGrid } from "../shared/GridPattern";

// Simpler ref export/usage if needed by Navbar
export const heroEmailInputRef = {
  current: null as HTMLInputElement | null,
  focus: () => {
    if (heroEmailInputRef.current) {
      heroEmailInputRef.current.focus();
    }
  }
};

const HeroSection = () => {
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Connect our component's ref to the exported ref
  useEffect(() => {
    heroEmailInputRef.current = emailInputRef.current;
  }, []);

  return (
    <section 
      id="hero" 
      className="overflow-hidden" 
      aria-labelledby="hero-heading"
    >
      <div 
        className="m-0 sm:m-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(to top right, #DEDEDE, #E3E3E3, #EAEAEA)',
          borderRadius: '20px',
        }}
      >
        <SimpleGrid size={40} />
        <ContainerScroll
          titleComponent={
            <div className="pb-6 md:py-16">
              <h1 id="hero-heading" className="hero-text text-3xl md:text-5xl lg:text-6xl mb-4 md:mb-6 text-black px-3 sm:px-0">
                Manage Clients, Projects<br />
                <span className="font-bold mt-1 leading-tight">
                  & Invoices — All in One Place
                </span>
              </h1>
              <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-10 max-w-2xl mx-auto px-4">
                Streamline your freelancing business with OneClient — The comprehensive platform for managing clients, projects, tasks, invoices and communication.
              </p>
              
              <button 
                className="bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-medium flex items-center whitespace-nowrap w-full sm:w-auto justify-center mx-auto"
                aria-label="Get Started"
              >
                <span>Get Started</span>
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
              </button>
            </div>
          }
        >
          <div className="h-full w-full flex items-center justify-center p-0">
            <img 
              src="/placeholder.png" 
              alt="Product dashboard preview" 
              className="w-full h-auto sm:w-full sm:h-full sm:object-cover rounded-lg"
            />
          </div>
        </ContainerScroll>
      </div>
    </section>
  );
};

export default HeroSection; 