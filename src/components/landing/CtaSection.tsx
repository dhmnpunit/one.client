import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Grid } from "../shared/GridPattern";

const CtaSection = () => {
  return (
    <section className="pt-6 md:pt-12 pb-0 bg-white">
      <div 
        className="m-2 sm:m-4 mb-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(to top right, #DEDEDE, #E3E3E3, #EAEAEA)',
          borderRadius: '20px',
        }}
      >
        <Grid pattern={[
          [0, 2],
          [1, 3],
          [2, 0],
          [3, 1],
          [4, 2],
        ]} size={30} />
        
        <motion.div 
          className="container mx-auto px-4 sm:px-6 py-10 sm:py-16 md:py-20 relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-[0.02]">
            <svg className="h-full w-full" viewBox="0 0 800 800">
              <path d="M800 0H0V800H800V0ZM658.6 262.9C608.2 312.9 558.3 362.9 508.3 412.9C458.3 462.9 408.3 512.9 358.3 562.9C308.3 612.9 258.3 662.9 208.4 712.8C158.4 762.8 108.4 812.8 58.4 862.8C108.4 812.8 158.4 762.8 208.4 712.8C258.3 662.9 308.3 612.9 358.3 562.9C408.3 512.9 458.3 462.9 508.3 412.9C558.3 362.9 608.2 312.9 658.6 262.9C708.9 212.9 759.3 162.9 809.3 112.9C759.3 162.9 708.9 212.9 658.6 262.9Z" fill="currentColor" />
            </svg>
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-6 sm:mb-10">
              <h2 className="hero-text text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-6 leading-relaxed pb-1">
                Ready to manage all your <span className="font-bold">business in one place</span>?
              </h2>
              <p className="text-sm sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-10 max-w-2xl mx-auto px-2">
                Join the waitlist to be among the first to streamline your client work with OneClient.
              </p>
            </div>
            
            <button 
              className="bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base font-medium flex items-center whitespace-nowrap w-full sm:w-auto justify-center mx-auto"
              aria-label="Get Started"
            >
              <span>Get Started</span>
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection; 