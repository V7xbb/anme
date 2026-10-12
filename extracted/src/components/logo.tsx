export function Logo({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <rect width="48" height="48" rx="14" fill="#713CFF" />
      <path d="M14 12h12.5c6.2 0 10 3.2 10 8.1 0 3.4-2 6-5.2 7.2L38 36h-6.4l-5.8-8.2H20V36h-6V12zm6 5.1V23h6.2c2.7 0 4.4-1.3 4.4-3.4s-1.7-3.5-4.4-3.5H20z" fill="#F3F5FF" />
      <circle cx="36" cy="14" r="3" fill="#168CFF" />
    </svg>
  );
}
