/** Small inline icons (no icon font, nothing to load). */

export function Logo({ size = 28 }: { size?: number }) {
  // Todo City: a building at night whose lit windows trace a check.
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <defs>
        <linearGradient id="lg-logo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2d2770" />
          <stop offset="1" stopColor="#0f0f28" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="22" fill="url(#lg-logo)" />
      <rect x="20" y="16" width="60" height="74" rx="6" fill="#262955" />
      <path d="M33 50 L50 66 L67 30" fill="none" stroke="#ffd27a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
      <g fill="#ffd27a">
        <rect x="26" y="43" width="14" height="14" rx="3" />
        <rect x="43" y="59" width="14" height="14" rx="3" />
        <rect x="60" y="24" width="14" height="14" rx="3" />
      </g>
    </svg>
  );
}

export function AppleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.37 12.6c.02 2.4 2.1 3.2 2.13 3.21-.02.06-.33 1.14-1.1 2.26-.66.97-1.35 1.94-2.43 1.96-1.06.02-1.4-.63-2.62-.63-1.21 0-1.6.61-2.6.65-1.05.04-1.84-1.05-2.51-2.02-1.37-1.97-2.41-5.57-1.01-8 .7-1.2 1.94-1.97 3.29-1.99 1.03-.02 2 .69 2.63.69.63 0 1.81-.85 3.05-.73.52.02 1.98.21 2.92 1.58-.08.05-1.74 1.02-1.73 3.02ZM14.36 5.03c.56-.67.93-1.6.83-2.53-.8.03-1.77.53-2.34 1.2-.52.6-.97 1.55-.85 2.46.89.07 1.8-.45 2.36-1.13Z" />
    </svg>
  );
}

export function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export function Check() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3.5 8.5 6.5 11.5 12.5 4.5" />
    </svg>
  );
}

export function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.22 1.87.87 2.33.66.07-.52.28-.87.5-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}
