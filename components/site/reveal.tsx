"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export const fadeBlur: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease } },
};

export const stagger = (delayChildren = 0, staggerChildren = 0.08): Variants => ({
  hidden: {},
  show: { transition: { delayChildren, staggerChildren } },
});

/** Bloco que entra com fade + blur quando aparece na tela. */
export function Reveal({ delay = 0, ...props }: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{
        hidden: fadeBlur.hidden,
        show: { ...(fadeBlur.show as object), transition: { duration: 0.8, ease, delay } },
      }}
      {...props}
    />
  );
}

/** Container que escalona a entrada dos filhos marcados com `variants={fadeBlur}`. */
export function Stagger({
  delay = 0,
  gap = 0.08,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; gap?: number }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={stagger(delay, gap)}
      {...props}
    />
  );
}
