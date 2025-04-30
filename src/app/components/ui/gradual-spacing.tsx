"use client";

import { AnimatePresence, motion, Variants } from "framer-motion";
import { cn } from "../../lib/utils";

interface GradualSpacingProps {
  text: string;
  duration?: number;
  delayMultiple?: number;
  framerProps?: Variants;
  className?: string;
}

export default function GradualSpacing({
  text,
  duration = 0.5,
  delayMultiple = 0.04,
  framerProps = {
    hidden: { opacity: 0, scale: 0.8, color: "#000000" },
    visible: { opacity: 1, scale: 1, color: "#00FF00" },
  },
  className,
}: GradualSpacingProps) {
  return (
    <div className="flex justify-center flex-wrap space-x-1 text-center sm:space-x-0 z-[-1]">
      <AnimatePresence>
        {text.split(" ").map((word, wordIndex) => (
          <div key={wordIndex} className="flex">
            {word.split("").map((char, charIndex) => (
              <motion.h1
                key={charIndex}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={framerProps}
                transition={{
                  duration,
                  delay: wordIndex * 0.2 + charIndex * delayMultiple,
                }}
                className={cn(
                  "drop-shadow-sm",
                  className,
                  "text-6xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl z-[-1]"
                )}
              >
                {char === " " ? <span>&nbsp;</span> : char}
              </motion.h1>
            ))}
            <span>&nbsp;</span>
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}