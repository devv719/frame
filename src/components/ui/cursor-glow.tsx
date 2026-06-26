"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CursorGlow() {
  const pathname = usePathname();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 35, stiffness: 220, mass: 0.4 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Initial center position
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  const background = "radial-gradient(circle, rgba(232, 213, 176, 0.05) 0%, transparent 70%)";
  const mixBlendMode = "screen";

  return (
    <motion.div
      className="pointer-events-none fixed z-10 size-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80"
      style={{
        left: cursorX,
        top: cursorY,
        background,
        mixBlendMode: mixBlendMode as any,
      }}
      aria-hidden="true"
    />
  );
}
