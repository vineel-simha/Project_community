/**
 * src/components/ui/Modal.jsx
 * Fully accessible modal dialog with:
 * - Focus trap
 * - Escape key to close
 * - aria-modal, role="dialog"
 * - Scroll lock on body
 * - Animated entrance
 */
import React, { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

/**
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   title: string,
 *   description?: string,
 *   children: React.ReactNode,
 *   size?: 'sm'|'md'|'lg'|'xl',
 *   className?: string,
 * }} props
 */
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  className = '',
}) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);

  const SIZE_MAP = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  // Focus trap
  const trapFocus = useCallback((e) => {
    if (!panelRef.current) return;
    const focusable = panelRef.current.querySelectorAll(
      'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    }
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    // Scroll lock
    const scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    // Focus the close button after mount
    requestAnimationFrame(() => closeBtnRef.current?.focus());

    document.addEventListener('keydown', trapFocus);

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
      document.removeEventListener('keydown', trapFocus);
    };
  }, [isOpen, trapFocus]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="presentation"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby={description ? 'modal-description' : undefined}
        className={`
          relative bg-surface rounded-4xl shadow-card-lg
          w-full ${SIZE_MAP[size] ?? SIZE_MAP.md}
          max-h-[90dvh] overflow-y-auto
          animate-[fadeSlideIn_0.25s_ease-out]
          ${className}
        `}
        style={{
          animation: 'fadeSlideIn 0.25s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-0">
          <div className="flex-1 pr-4">
            <h2 id="modal-title" className="font-jakarta font-bold text-xl text-moss tracking-tighter">
              {title}
            </h2>
            {description && (
              <p id="modal-description" className="mt-1 text-sm text-muted font-jakarta">
                {description}
              </p>
            )}
          </div>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close dialog"
            className="
              flex-shrink-0 w-9 h-9 rounded-xl
              flex items-center justify-center
              text-muted hover:text-moss hover:bg-cream
              transition-colors focus:outline-none
              focus-visible:ring-2 focus-visible:ring-clay focus-visible:ring-offset-1
            "
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {children}
        </div>
      </div>

      {/* Keyframe animation (injected inline for portability) */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
}

export default Modal;
