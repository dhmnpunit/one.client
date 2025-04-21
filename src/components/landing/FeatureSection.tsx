import React, { useId } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import { UserGroupIcon, BriefcaseIcon, DocumentTextIcon, ChartBarIcon, ClockIcon, FolderIcon } from "@heroicons/react/24/outline";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.6, 
            delay: index * 0.1,
            ease: "easeOut" 
          }
        }
      }}
      className="relative bg-gradient-to-b from-neutral-100 to-white p-4 sm:p-6 rounded-3xl overflow-hidden"
      whileHover={{ 
        scale: 1.03,
        transition: { duration: 0.2 }
      }}
    >
      <Grid />
      <div className="mb-3 md:mb-4 text-primary">{icon}</div>
      <h3 className="text-base md:text-lg font-bold mb-1 md:mb-2 text-gray-900 relative z-20">
        {title}
      </h3>
      <p className="text-gray-600 mt-1 md:mt-2 text-xs sm:text-sm relative z-20">
        {description}
      </p>
    </motion.div>
  );
};

export const Grid = ({ pattern, size }: { pattern?: number[][]; size?: number }) => {
  const p = pattern ?? [
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
  ];
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] from-zinc-100/30 to-zinc-300/30 opacity-100">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full mix-blend-overlay stroke-black/10 fill-black/10"
        />
      </div>
    </div>
  );
};

// Define proper types for GridPattern props
interface GridPatternProps {
  width: number;
  height: number;
  x: string;
  y: string;
  squares?: number[][];
  className?: string;
  [key: string]: unknown;
}

export function GridPattern({ width, height, x, y, squares, ...props }: GridPatternProps) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([squareX, squareY], index: number) => (
            <rect
              strokeWidth="0"
              key={`${squareX}-${squareY}-${index}`}
              width={width + 1}
              height={height + 1}
              x={squareX * width}
              y={squareY * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}

const FeatureSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  
  const features = [
    {
      title: "Centralized Client Management",
      description: "Efficiently manage client information, track interactions, and maintain detailed profiles for personalized service.",
      icon: <UserGroupIcon className="w-6 h-6" />
    },
    {
      title: "Streamlined Project Workflow",
      description: "Plan, track, and execute projects with powerful tools for task assignment, progress tracking, and deadline management.",
      icon: <BriefcaseIcon className="w-6 h-6" />
    },
    {
      title: "Professional Invoice Management",
      description: "Create, send, and track invoices with ease. Get paid faster with professional-looking invoices linked directly to projects.",
      icon: <DocumentTextIcon className="w-6 h-6" />
    },
    {
      title: "Realtime Communication",
      description: "Streamline invoicing, payment processing, and financial reporting with integrated tools for business finances.",
      icon: <ChartBarIcon className="w-6 h-6" />
    },
    {
      title: "Time Saving Dashboard",
      description: "Gain insights into your business performance with comprehensive analytics and customizable reporting dashboards.",
      icon: <ClockIcon className="w-6 h-6" />
    },
    {
      title: "Document Management",
      description: "Securely store, organize, and share documents with clients and team members with version control and access permissions.",
      icon: <FolderIcon className="w-6 h-6" />
    }
  ];

  return (
    <section className="py-12 lg:py-32 px-3 sm:px-4 bg-white" id="features" ref={containerRef}>
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-10 md:mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="hero-text text-2xl md:text-3xl lg:text-5xl font-bold mb-3 md:mb-4">
            Powerful Features for Your <span className="font-bold">Business</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-lg px-2">
            Our comprehensive suite of tools helps you manage every aspect of your business
            with efficiency and ease.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection; 