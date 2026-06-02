/**
 * Utility for conditionally joining classNames together.
 * Lightweight alternative to `clsx` + `twMerge` for cases
 * where Tailwind class conflicts need resolution.
 */

type ClassValue = string | undefined | null | false | 0;

export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(" ");
}
