import { useId, type SelectHTMLAttributes } from "react";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
};

export function Select({
  label,
  id,
  className = "",
  children,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <label className="block space-y-1.5 text-sm" htmlFor={selectId}>
      <span className="font-medium text-foreground">{label}</span>
      <select
        id={selectId}
        className={`min-h-10 w-full rounded-control border border-border bg-surface px-3 py-2 text-foreground outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:opacity-70 ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
