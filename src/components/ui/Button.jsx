/**
 * src/components/ui/Button.jsx
 * Reusable button component with clay/primary/secondary/ghost/outline variants.
 * All variants have hover, focus-visible and active states.
 */
import React from 'react';

const BASE =
  'inline-flex items-center justify-center gap-2 font-outfit font-semibold rounded-2xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

const SIZES = {
  sm:  'px-4 py-2 text-sm min-h-[36px]',
  md:  'px-6 py-3 text-sm min-h-[44px]',
  lg:  'px-8 py-4 text-base min-h-[52px]',
  xl:  'px-10 py-5 text-lg min-h-[60px]',
};

const VARIANTS = {
  primary:
    'bg-clay text-white hover:bg-clay-dark active:scale-[0.97] hover:scale-[1.02] shadow-clay',
  secondary:
    'bg-moss text-cream hover:bg-forest active:scale-[0.97] hover:scale-[1.02]',
  ghost:
    'bg-transparent text-moss border border-line hover:bg-moss/5 hover:border-moss active:scale-[0.97]',
  outline:
    'bg-transparent text-clay border-2 border-clay hover:bg-clay hover:text-white active:scale-[0.97]',
  'ghost-light':
    'bg-transparent text-cream/80 border border-cream/20 hover:bg-cream/10 hover:text-cream active:scale-[0.97]',
  'outline-light':
    'bg-transparent text-cream border border-cream/40 hover:bg-cream/15 hover:border-cream active:scale-[0.97]',
  link:
    'bg-transparent text-clay hover:text-clay-dark underline-offset-4 hover:underline p-0 min-h-0 font-medium',
};

/**
 * @param {{
 *   variant?: keyof VARIANTS,
 *   size?: keyof SIZES,
 *   as?: React.ElementType,
 *   href?: string,
 *   className?: string,
 *   children: React.ReactNode,
 *   [key: string]: any
 * }} props
 */
export function Button({
  variant = 'primary',
  size = 'md',
  as: Tag = 'button',
  href,
  className = '',
  children,
  ...rest
}) {
  const Element = href ? 'a' : Tag;
  const hrefProps = href ? { href } : {};

  return (
    <Element
      className={`${BASE} ${SIZES[size] ?? SIZES.md} ${VARIANTS[variant] ?? VARIANTS.primary} ${className}`}
      {...hrefProps}
      {...rest}
    >
      {children}
    </Element>
  );
}

export default Button;
