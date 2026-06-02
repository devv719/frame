/**
 * Shared TypeScript types.
 * Add application-wide type definitions here.
 */

/** Base entity with common fields */
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/** Navigation link */
export interface NavLink {
  label: string;
  href: string;
}

/** Social link */
export interface SocialLink extends NavLink {
  icon: string;
}
