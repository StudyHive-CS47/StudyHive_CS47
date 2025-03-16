"use client";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./RotatingText.css";

const RotatingText = forwardRef((props, ref) => {
  const {
    texts,
    transition = { type: "spring", damping: 30, stiffness: 400 },
    initial = { y: "100%" },
    animate = { y: 0 },
    exit = { y: "-120%" },
    rotationInterval = 2000,
    staggerDuration = 0.025,
    staggerFrom = "last",
    mainClassName,
    splitLevelClassName,
  } = props;

  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const next = useCallback(() => {
    setCurrentTextIndex((current) => (current + 1) % texts.length);
  }, [texts.length]);

  useEffect(() => {
    const intervalId = setInterval(next, rotationInterval);
    return () => clearInterval(intervalId);
  }, [next, rotationInterval]);

  return (
    <motion.span className={`rotating-text ${mainClassName}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTextIndex}
          className="rotating-text-content"
        >
          <span className="rotating-text-word">
            {texts[currentTextIndex].split('').map((char, idx) => (
              <motion.span
                key={idx}
                initial={initial}
                animate={animate}
                exit={exit}
                transition={{
                  ...transition,
                  delay: staggerDuration * (staggerFrom === "last" ? texts[currentTextIndex].length - 1 - idx : idx)
                }}
                className="rotating-text-char"
              >
                {char}
              </motion.span>
            ))}
          </span>
        </motion.div>
      </AnimatePresence>
    </motion.span>
  );
});

RotatingText.displayName = "RotatingText";
export default RotatingText; 