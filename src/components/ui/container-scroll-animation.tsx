"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // For mobile, we'll use fixed values instead of animation based on scroll
  const rotate = useTransform(scrollYProgress, [0, 1], isMobile ? [20, 20] : [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], isMobile ? [0.9, 0.9] : [1.05, 1]);
  const translate = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, -100]);

  return (
    <div
      className="h-auto min-h-[50rem] md:min-h-[60rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20"
      ref={containerRef}
    >
      <div
        className="pt-28 pb-4 md:py-40 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} isMobile={isMobile} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({ 
  translate, 
  titleComponent,
  isMobile
}: { 
  translate: MotionValue<number>; 
  titleComponent: React.ReactNode;
  isMobile?: boolean;
}) => {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="div max-w-5xl mx-auto text-center mb-2 md:mb-0"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  translate,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-5xl -mt-6 md:-mt-12 mx-auto md:h-[40rem] w-full border-4 border-[#6C6C6C] md:p-6 bg-[#222222] rounded-[30px] shadow-2xl aspect-video md:aspect-auto"
    >
      <div className="h-full w-full overflow-hidden rounded-3xl bg-gray-100 dark:bg-zinc-900 md:rounded-2xl md:p-1">
        {children}
      </div>
    </motion.div>
  );
}; 