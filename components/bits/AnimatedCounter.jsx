"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

export default function AnimatedCounter({ value, duration = 2, prefix = "", suffix = "" }) {
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  
  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 20,
    duration: duration * 1000
  });
  
  const displayValue = useTransform(springValue, (current) => {
    return `${prefix}${Math.round(current).toLocaleString()}${suffix}`;
  });

  useEffect(() => {
    if (inView && !hasStarted) {
      setHasStarted(true);
      springValue.set(value);
    }
  }, [inView, value, springValue, hasStarted]);

  return <motion.span ref={ref}>{displayValue}</motion.span>;
}