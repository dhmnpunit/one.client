import React, { useState, useEffect } from "react";
import { Menu, ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { heroEmailInputRef } from "./HeroSection";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const navItems = [
    { label: "Features", href: "#features", hasDropdown: false },
    { label: "Pricing", href: "#pricing", hasDropdown: false },
    { label: "FAQs", href: "#faq", hasDropdown: false },
  ];

  const handleWaitlistClick = () => {
    heroEmailInputRef.focus();
  };

  return (
    <header className={`fixed ${isScrolled ? 'top-3' : 'top-6'} left-0 right-0 z-50 flex justify-center p-3 transition-all duration-300`}>
      <div 
        className="bg-[#1E1E1E] transition-all duration-300 backdrop-blur-md rounded-2xl px-4 py-2 pr-2 flex items-center justify-between w-[92%] sm:w-full max-w-[980px] shadow-lg border border-white/10"
      >
        <a href="#" className="flex items-center space-x-2">
          <img src="/one-client-logo-white.svg" alt="One Client Logo" className="h-8" />
        </a>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-12 ml-10">
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              className="text-white/80 hover:text-white font-medium text-sm transition-colors flex items-center"
            >
              {item.label}
              {item.hasDropdown && <ChevronDown className="ml-1 h-4 w-4" />}
            </a>
          ))}
        </nav>
        
        <div className="hidden md:flex items-center">
          <button 
            className="flex items-center space-x-2 bg-white text-black hover:bg-gray-100 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            onClick={handleWaitlistClick}
          >
            <span>Login</span>
          </button>
        </div>
        
        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <button className="text-white hover:bg-white/10 p-2 rounded-full">
              <Menu className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>
                <img src="/one-client-logo-black.png" alt="One Client Logo" className="h-8" />
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col space-y-4 mt-8">
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="text-gray-600 hover:text-black font-medium text-base py-2 transition-colors flex items-center"
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown className="ml-1 h-4 w-4" />}
                </a>
              ))}
              <div className="flex flex-col mt-4">
                <button 
                  className="flex items-center justify-center space-x-2 bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-xl text-sm font-medium w-full"
                  onClick={handleWaitlistClick}
                >
                  <span>Login</span>
                </button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar; 