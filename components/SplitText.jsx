"use client";

import { motion } from "framer-motion";

export default function SplitText({
  text = "",
  className = "",
  delay = 0,
  stagger = 0.03,
  as: Tag = "span",
}) {
  const words = text.split(" ");

  return (
    <Tag className={className} style={{ display: "flex", flexWrap: "wrap", gap: "0.3em" }} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} style={{ display: "inline-flex", overflow: "hidden" }}>
          {word.split("").map((char, ci) => (
            <motion.span
              key={ci}
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: delay + (wi * word.length + ci) * stagger,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ display: "inline-block" }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
