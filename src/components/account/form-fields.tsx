export function TextField({
  label,
  name,
  type = "text",
  required,
  autoComplete,
  defaultValue,
  minLength,
  helper,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  defaultValue?: string;
  minLength?: number;
  helper?: string;
}) {
  return (
    <label className="block">
      <span className="font-body text-xs tracking-widest uppercase text-surface-foreground/75">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        minLength={minLength}
        className="mt-1.5 w-full bg-transparent border-b border-hairline py-2 font-body text-sm outline-none focus-visible:border-surface-foreground transition-colors duration-200"
      />
      {helper && <span className="block font-body text-xs text-surface-foreground/50 mt-1">{helper}</span>}
    </label>
  );
}

export function FormError({
  message,
  action,
}: {
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-hairline bg-surface-foreground/5 px-4 py-3">
      <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        className="mt-0.5 shrink-0 text-surface-foreground/70"
        aria-hidden
      >
        <circle cx="7.5" cy="7.5" r="6.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M7.5 4.5v3.5M7.5 10.5h.01" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
      <div className="flex-1 pt-px">
        <p className="font-body text-xs text-surface-foreground/90">{message}</p>
        {action}
      </div>
    </div>
  );
}
