"use client"

import { useState, useRef, useEffect, useId } from "react"
import { motion, useAnimation, useInView, AnimatePresence } from "framer-motion"
import { Check, Sparkles, Zap, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

// Import the Grid and GridPattern components from FeatureSection
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

interface Feature {
  name: string;
  description: string;
  included: boolean;
}

interface PricingTier {
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  description: string;
  features: Feature[];
  highlight?: boolean;
  badge?: string;
  icon: React.ReactNode;
  color?: string;
}

interface PricingSectionProps {
  tiers?: PricingTier[];
  className?: string;
}

const defaultTiers: PricingTier[] = [
    {
      name: "Freelancer",
      price: {
        monthly: 25,
        yearly: 240,
      },
      description: "For independent freelancers managing their own clients",
      color: "amber",
      icon: <Zap className="w-7 h-7" />,
      features: [
        {
          name: "Manage up to 10 clients",
          description: "Perfect for solo practitioners",
          included: true,
        },
        {
          name: "Clean, focused dashboard",
          description: "Simple, intuitive interface",
          included: true,
        },
        {
          name: "Basic client portal",
          description: "Client access to essential information",
          included: true,
        },
        {
          name: "Project management",
          description: "Track projects and deadlines",
          included: true,
        },
        {
          name: "Invoice generation",
          description: "Create professional invoices",
          included: true,
        },
        {
          name: "Document storage",
          description: "Store client files securely",
          included: true,
        },
        {
          name: "Email support",
          description: "Get help when you need it",
          included: true,
        },
        {
          name: "Best for solo consultants, coaches, creatives",
          description: "Ideal for independent professionals",
          included: true,
        },
      ],
    },
    {
      name: "Agency",
      price: {
        monthly: 29,
        yearly: 300,
      },
      description: "Each team member gets their own 10-client space",
      highlight: true,
      color: "blue",
      icon: <Sparkles className="w-7 h-7" />,
      features: [
        {
          name: "15 clients per team member",
          description: "Expanded client capacity",
          included: true,
        },
        {
          name: "Central team workspace",
          description: "Collaborate with your team",
          included: true,
        },
        {
          name: "Advanced client portal",
          description: "Enhanced client experience",
          included: true,
        },
        {
          name: "Project management with templates",
          description: "Streamline your workflow",
          included: true,
        },
        {
          name: "Automated invoicing",
          description: "Save time with automation",
          included: true,
        },
        {
          name: "Client onboarding workflows",
          description: "Create professional client experiences",
          included: true,
        },
        {
          name: "Analytics dashboard",
          description: "Track your business performance",
          included: true,
        },
        {
          name: "Priority support",
          description: "Get faster responses",
          included: true,
        },
        {
          name: "Built for studios, agencies, and distributed teams",
          description: "Perfect for collaborative teams",
          included: true,
        },
      ],
    },
    {
      name: "Enterprise",
      price: {
        monthly: 0,
        yearly: 0,
      },
      description: "For large teams or organizations with advanced needs",
      color: "purple",
      icon: <Sparkles className="w-7 h-7" />,
      features: [
        {
          name: "Unlimited clients & team members",
          description: "No limits on your growth",
          included: true,
        },
        {
          name: "Dedicated account manager",
          description: "Personalized support for your business",
          included: true,
        },
        {
          name: "White-labeled client portal",
          description: "Your branding, our technology",
          included: true,
        },
        {
          name: "Custom workflow automation",
          description: "Tailor processes to your needs",
          included: true,
        },
        {
          name: "Advanced analytics and reporting",
          description: "Get deep insights into your business",
          included: true,
        },
        {
          name: "Team collaboration",
          description: "Work efficiently with your team",
          included: true,
        },
        {
          name: "Tailored for enterprise agencies, consultancies, and SaaS providers",
          description: "Enterprise-grade solution",
          included: true,
        },
      ],
    },
  ]

const PricingSection = ({ tiers = defaultTiers, className }: PricingSectionProps) => {
  const [isYearly, setIsYearly] = useState(false)
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <section
      className={cn(
        "relative bg-white",
        "py-12 px-3 sm:px-4 md:py-24 lg:py-32",
        "overflow-hidden",
        className,
      )}
      id="pricing"
      ref={ref}
    >
      <div className="w-full max-w-7xl mx-auto">
        <motion.div 
          className="flex flex-col items-center gap-2 sm:gap-4 mb-10 md:mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="hero-text text-2xl md:text-3xl lg:text-5xl font-bold mb-2 md:mb-4 text-center">
            Simple, transparent <span className="font-bold">pricing</span>
          </h2>
          <p className="text-gray-600 text-sm md:text-lg text-center max-w-2xl px-2">
            Choose the plan that's right for your business
          </p>
          
          <div className="relative inline-flex items-center p-1 sm:p-1.5 mt-4 sm:mt-6 bg-white rounded-full border border-gray-200 shadow-sm">
            {/* Sliding background element */}
            <motion.div 
              className="absolute top-1 sm:top-1.5 left-1 sm:left-1.5 h-[calc(100%-8px)] rounded-full bg-black"
              animate={{
                x: isYearly ? 'calc(100%)' : 0
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30
              }}
              style={{ 
                width: 'calc(50% - 4px)'
              }}
            />
            
            {["Monthly", "Yearly"].map((period) => (
              <button
                key={period}
                onClick={() => setIsYearly(period === "Yearly")}
                className={cn(
                  "px-4 sm:px-8 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-full transition-all duration-300 ease-in-out z-10 relative",
                  (period === "Yearly") === isYearly
                    ? "text-white"
                    : "text-gray-600 hover:text-gray-900",
                )}
              >
                {period}
              </button>
            ))}
          </div>
 
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              variants={cardVariants}
              className="relative bg-gradient-to-b from-neutral-100 to-white p-4 sm:p-6 rounded-3xl overflow-hidden"
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.2 }
              }}
            >
              <Grid />
              
              <div className="relative z-10">
                {tier.badge && (
                  <div className={`absolute -top-2 -right-2 z-20 ${tier.highlight ? 'translate-y-0' : 'translate-y-0'}`}>
                    <span className={`px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-full shadow-lg ${tier.highlight ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'}`}>
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div className="mb-3 sm:mb-4 text-primary">
                  {tier.icon}
                </div>

                <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-gray-900">
                  {tier.name}
                </h3>

                <div className="mb-4 sm:mb-6">
                  <div className="flex items-baseline gap-1 sm:gap-2">
                    {tier.name === "Enterprise" ? (
                      <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Custom
                      </span>
                    ) : (
                      <>
                        <AnimatePresence mode="wait">
                          <motion.span 
                            key={`${tier.name}-${isYearly ? 'yearly' : 'monthly'}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="text-2xl sm:text-4xl font-bold text-gray-900"
                          >
                            ${isYearly ? Math.round(tier.price.yearly / 12) : tier.price.monthly}
                          </motion.span>
                        </AnimatePresence>
                        <AnimatePresence mode="wait">
                          <motion.span 
                            key={`${tier.name}-suffix-${isYearly ? 'yearly' : 'monthly'}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="text-xs sm:text-sm text-gray-500"
                          >
                            {tier.name === "Agency" ? 
                              `/member/month${isYearly ? ", billed annually" : ""}` : 
                              `/month${isYearly ? ", billed annually" : ""}`}
                          </motion.span>
                        </AnimatePresence>
                      </>
                    )}
                  </div>
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-600">
                    {tier.description}
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {tier.features.map((feature) => (
                    <div key={feature.name} className="flex gap-2 sm:gap-4">
                      <div className="mt-0.5 sm:mt-1 p-0.5 rounded-full text-black">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-medium text-gray-900">
                          {feature.name}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          {feature.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
