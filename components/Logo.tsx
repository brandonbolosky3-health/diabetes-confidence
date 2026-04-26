"use client";

import type { SVGProps } from "react";

/**
 * Saryn Health logo.
 *
 * Usage:
 *   <Logo />                         // horizontal lockup, default size (nav / footer)
 *   <Logo variant="stacked" />       // big wordmark stacked over HEALTH (hero, about page)
 *   <Logo variant="mark" />          // just the teal "y" (compact spaces, loading states)
 *   <Logo className="h-8 w-auto" />  // Tailwind-controlled sizing
 *
 * All variants are inline SVG with `currentColor` on the dark text, so they
 * auto-adapt to dark mode when you apply a text color class:
 *   <Logo className="text-neutral-900 dark:text-white" />
 */

type LogoVariant = "horizontal" | "stacked" | "mark";

interface LogoProps extends Omit<SVGProps<SVGSVGElement>, "children"> {
  variant?: LogoVariant;
  /** Teal accent color for the "y". Defaults to Saryn teal #2a9d8f. */
  accentColor?: string;
  /** Tag text. Defaults to "HEALTH". */
  tagText?: string;
  /** Muted tag color. Defaults to #6b6b6b for light, auto-adapts via CSS if you override. */
  tagColor?: string;
}

const FONT_STACK =
  "var(--font-inter), -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif";
const ACCENT_DEFAULT = "#2a9d8f";
const TAG_DEFAULT = "#6b6b6b";

export function Logo({
  variant = "horizontal",
  accentColor = ACCENT_DEFAULT,
  tagText = "HEALTH",
  tagColor = TAG_DEFAULT,
  className,
  ...rest
}: LogoProps) {
  if (variant === "mark") {
    // Just the teal "y" — use for favicons-in-context, loading states, avatars.
    return (
      <svg
        viewBox="0 0 64 64"
        role="img"
        aria-label="Saryn Health"
        className={className}
        {...rest}
      >
        <title>Saryn Health</title>
        <text
          x="32"
          y="50"
          textAnchor="middle"
          fontFamily={FONT_STACK}
          fontSize="56"
          fontWeight="500"
          fill={accentColor}
        >
          y
        </text>
      </svg>
    );
  }

  if (variant === "stacked") {
    // Big wordmark over small-caps HEALTH — use in hero, about page, press.
    return (
      <svg
        viewBox="0 0 400 120"
        role="img"
        aria-label="Saryn Health"
        className={className}
        {...rest}
      >
        <title>Saryn Health</title>
        <text
          x="200"
          y="78"
          textAnchor="middle"
          fontFamily={FONT_STACK}
          fontSize="78"
          fontWeight="400"
          letterSpacing="-1.95"
          fill="currentColor"
        >
          sar
          <tspan fill={accentColor}>y</tspan>
          n
        </text>
        <text
          x="200"
          y="105"
          textAnchor="middle"
          fontFamily={FONT_STACK}
          fontSize="10"
          fontWeight="400"
          letterSpacing="2.4"
          fill={tagColor}
        >
          {tagText}
        </text>
      </svg>
    );
  }

  // Default: horizontal lockup for nav / footer / email.
  return (
    <svg
      viewBox="0 0 165 40"
      role="img"
      aria-label="Saryn Health"
      className={className}
      {...rest}
    >
      <title>Saryn Health</title>
      <text
        x="0"
        y="30"
        fontFamily={FONT_STACK}
        fontSize="32"
        fontWeight="400"
        letterSpacing="-0.64"
        fill="currentColor"
      >
        sar
        <tspan fill={accentColor}>y</tspan>
        n
      </text>
      <text
        x="100"
        y="24"
        fontFamily={FONT_STACK}
        fontSize="11"
        fontWeight="400"
        letterSpacing="2.4"
        fill={tagColor}
      >
        {tagText}
      </text>
    </svg>
  );
}

export default Logo;
