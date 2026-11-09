/**
 * src/components/ui/Badge.jsx
 * Reusable badge / pill component for status labels, demo indicators,
 * bounty amounts and category tags.
 */
import React from 'react';

const VARIANTS = {
  demo:        'bg-amber-100 text-amber-800 border border-amber-200',
  sample:      'bg-blue-50 text-blue-700 border border-blue-200',
  submitted:   'bg-cream text-moss border border-line',
  assigned:    'bg-blue-50 text-blue-700 border border-blue-200',
  'in-progress': 'bg-orange-50 text-orange-700 border border-orange-200',
  'pending-approval': 'bg-amber-50 text-amber-700 border border-amber-200',
  resolved:    'bg-emerald-50 text-emerald-700 border border-emerald-200',
  bounty:      'bg-clay/10 text-clay-dark border border-clay/20',
  worker:      'bg-moss/10 text-moss border border-moss/20',
  citizen:     'bg-sage/30 text-forest border border-sage',
  area:        'bg-line text-muted',
  muted:       'bg-line text-muted border border-line',
  moss:        'bg-moss text-cream',
  clay:        'bg-clay text-white',
};

const SIZES = {
  xs: 'px-2 py-0.5 text-xs font-mono-cf',
  sm: 'px-2.5 py-1 text-xs font-outfit font-medium',
  md: 'px-3 py-1.5 text-sm font-outfit font-medium',
};

/**
 * @param {{
 *   variant?: keyof typeof VARIANTS,
 *   size?: keyof typeof SIZES,
 *   className?: string,
 *   children: React.ReactNode,
 *   [key: string]: any
 * }} props
 */
export function Badge({
  variant = 'muted',
  size = 'sm',
  className = '',
  children,
  ...rest
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full ${SIZES[size] ?? SIZES.sm} ${VARIANTS[variant] ?? VARIANTS.muted} ${className}`}
      {...rest}
    >
      {children}
    </span>
  );
}

export default Badge;
