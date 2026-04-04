"use client";

import { motion } from "framer-motion";

export default function AnnouncementBar() {
  const items = [
    "✦ Free Shipping on Orders Over ₹999",
    "✦ Reusable Up To 8 Times",
    "✦ Professional Grade Quality",
    "✦ Made in India",
    "✦ 100% Skin Safe",
  ];
  const doubled = [...items, ...items];

  return (
    <div className="announcement-bar">
      <motion.div
        className="announcement-bar__inner"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
      >
        {doubled.map((item, i) => (
          <span key={i}>{item}</span>
        ))}
      </motion.div>
    </div>
  );
}
