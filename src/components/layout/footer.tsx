"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  SITE_CONFIG,
  FOOTER_LINKS,
  SOCIAL_LINKS,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";

/**
 * Footer — Site-wide footer with navigation columns,
 * social links, and branding.
 *
 * Design: Warm, minimal, with lavender accents.
 * Follows Apple-like generous spacing.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerContainer}
      className="relative mt-auto border-t border-white/5 bg-[#0e0d0b]"
    >
      <div
        className="absolute top-0 left-0 right-0 h-px bg-[#292524]"
        aria-hidden="true"
      />

      <div className="container-frame section-padding">
        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Brand column */}
          <motion.div
            variants={staggerItem}
            className="col-span-2 md:col-span-4 lg:col-span-2"
          >
            <Link href="/" className="inline-flex items-center gap-2 group">
              <span className="relative flex items-center justify-center w-7 h-7 rounded-md bg-[#161410] border border-[#e8d5b0]/20 text-[#e8d5b0]">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M2 4C2 2.89543 2.89543 2 4 2H12C13.1046 2 14 2.89543 14 4V12C14 13.1046 13.1046 14 12 14H4C2.89543 14 2 13.1046 2 12V4Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <circle cx="5.5" cy="5.5" r="1" fill="currentColor" />
                  <path
                    d="M6 10L8 7.5L10.5 10.5"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-heading text-[1.1rem] text-[#e8d5b0] font-display italic font-normal">
                {SITE_CONFIG.name}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-body-sm text-text-tertiary leading-relaxed">
              {SITE_CONFIG.description}
            </p>
 
            {/* Social links */}
            <div className="flex items-center gap-3 mt-6">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center justify-center w-9 h-9",
                    "bg-[#161410] border border-white/5 text-text-secondary",
                    "hover:border-[#e8d5b0]/30 hover:text-[#e8d5b0]",
                    "transition-all duration-[250ms]"
                  )}
                  aria-label={`Follow us on ${social.label}`}
                >
                  <SocialIcon name={social.icon} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Link columns */}
          <motion.div variants={staggerItem}>
            <h3 className="text-overline-style mb-4">Platform</h3>
            <ul className="flex flex-col gap-2.5">
              {FOOTER_LINKS.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.875rem] text-text-secondary hover:text-text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={staggerItem}>
            <h3 className="text-overline-style mb-4">Personal</h3>
            <ul className="flex flex-col gap-2.5">
              {FOOTER_LINKS.personal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.875rem] text-text-secondary hover:text-text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={staggerItem}>
            <h3 className="text-overline-style mb-4">Account</h3>
            <ul className="flex flex-col gap-2.5">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.875rem] text-text-secondary hover:text-text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          variants={fadeUp}
          className="mt-16 pt-8 border-t border-border-secondary flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-caption text-text-muted">
            &copy; {currentYear} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <p className="text-caption text-text-muted">
            Crafted for cinema lovers.
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}

/* ── Inline Social Icons ── */

function SocialIcon({ name }: { name: string }) {
  const iconSize = 16;

  switch (name) {
    case "twitter":
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
          <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
        </svg>
      );
    case "instagram":
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
        </svg>
      );
    case "film":
      return (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="2" width="20" height="20" rx="2" />
          <path d="M7 2v20M17 2v20M2 7h5M17 7h5M2 12h20M2 17h5M17 17h5" />
        </svg>
      );
    default:
      return null;
  }
}
