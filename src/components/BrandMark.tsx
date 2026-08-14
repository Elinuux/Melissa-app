type BrandMarkProps = { compact?: boolean; className?: string };

export function BrandMark({ compact = false, className = '' }: BrandMarkProps) {
  return (
    <div className={`brand-mark ${compact ? 'brand-mark--compact' : ''} ${className}`.trim()} aria-label="Mélissa app">
      <svg className="brand-mark__icon" viewBox="0 0 64 64" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="melissa-gradient" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF7A8A" />
            <stop offset="0.48" stopColor="#9B6DFF" />
            <stop offset="1" stopColor="#4C9DFF" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="56" height="56" rx="18" fill="url(#melissa-gradient)" />
        <path d="M17 43V21h6.8l8.2 11.7L40.2 21H47v22h-7V31.9l-7.8 10.4h-.5L24 31.9V43h-7Z" fill="white" />
        <circle cx="50" cy="15" r="5" fill="#FFEAA7" />
      </svg>
      {!compact && <span className="brand-mark__word">Mélissa <strong>app</strong></span>}
    </div>
  );
}
