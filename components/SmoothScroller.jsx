"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroller({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0, 
      lerp: 0.1,    
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="smooth-scroll-wrapper" style={{ transition: "opacity 0.5s ease" }}>
      {children}
    </div>
  );
}
