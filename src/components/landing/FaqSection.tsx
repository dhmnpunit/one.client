import React, { useRef } from "react";
import { FaqAccordion } from "@/components/ui/faq-accordion";
import { motion, useAnimation, useInView } from "framer-motion";
import { Grid } from "@/components/shared/GridPattern";

const faqData = [
  {
    id: 1,
    question: "What is OneClient?",
    answer: "OneClient is a comprehensive application designed to help freelancers and small businesses manage clients, projects, tasks, invoices, and communications efficiently.",
  },
  {
    id: 2,
    question: "How can OneClient benefit my business?",
    answer: "By centralizing your business operations, OneClient saves you time and reduces the complexity of managing multiple tools. It enhances productivity and improves client satisfaction.",
  },
  {
    id: 3,
    question: "Is OneClient suitable for small teams?",
    answer: "Yes, OneClient is perfect for small teams, offering f",
  },
  {
    id: 4,
    question: "How does OneClient compare to other project management tools?",
    answer: "OneClient stands out as an all-in-one solution tailored for freelancers and small businesses, combining client management, project tracking, task assignment, invoicing, and communication in a single platform. Unlike many competitors that require separate tools for billing or client portals (e.g., Asana with Harvest or ClickUp with PandaDoc), OneClient offers this integration starting at a competitive price point.",
  },
];

const FaqSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const controls = useAnimation();
  
  React.useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <section className="py-12 px-3 sm:px-4 md:py-24 lg:py-32 bg-white relative overflow-hidden" id="faq" ref={ref}>
      <div className="max-w-7xl mx-auto relative">
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden"
          aria-hidden="true"
        >
          <Grid />
        </div>
        
        <motion.div 
          className="text-center mb-10 md:mb-16 relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="hero-text text-2xl md:text-3xl lg:text-5xl font-bold mb-3 md:mb-4 text-center">
            Frequently Asked <span className="font-bold">Questions</span>
          </h2>
          <p className="text-gray-600 text-sm md:text-lg text-center max-w-2xl mx-auto px-2">
            Get answers to common questions about OneClient's features and capabilities
          </p>
        </motion.div>
        
        <motion.div 
          className="flex justify-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="w-full max-w-4xl rounded-3xl overflow-hidden">
            <FaqAccordion 
              data={faqData}
              className="w-full p-3 sm:p-6 md:p-8"
              timestamp=""
              questionClassName="text-base sm:text-lg py-3 sm:py-4 px-4 sm:px-6 bg-white border border-gray-200 shadow-sm"
              answerClassName="text-sm sm:text-base max-w-none"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FaqSection; 