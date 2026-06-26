// Themed wordmark — uses theme tokens so it adapts to light/dark and any palette.
export const Logo = () => {
  return (
    <span className="flex select-none items-center gap-2.5" aria-label="Patient Manager">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <rect width="32" height="32" rx="9" fill="hsl(var(--primary))" />
        <path
          d="M16 8.75V23.25M8.75 16H23.25"
          stroke="hsl(var(--primary-foreground))"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </svg>
      <span className="flex flex-col leading-[1.04]">
        <span className="font-serif text-[15px] font-semibold tracking-tight text-foreground">
          Patient
        </span>
        <span className="text-[9.5px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Manager
        </span>
      </span>
    </span>
  );
};

export default Logo;
