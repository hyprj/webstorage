import type { SVGProps } from "react";

export type IconName =
  | "alert"
  | "chevron-down"
  | "chevron-right"
  | "file"
  | "file-plus"
  | "files"
  | "loader"
  | "plus"
  | "trash"
  | "x";

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  spin?: boolean;
};

export function Icon({
  name,
  spin = false,
  className = "",
  ...props
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${spin ? "animate-spin" : ""} ${className}`.trim()}
      {...props}
    >
      {name === "alert" && (
        <>
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
          <path d="M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
        </>
      )}
      {name === "chevron-down" && <path d="m6 9 6 6 6-6" />}
      {name === "chevron-right" && <path d="m9 18 6-6-6-6" />}
      {name === "file" && (
        <>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
        </>
      )}
      {name === "file-plus" && (
        <>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M12 18v-6" />
          <path d="M9 15h6" />
        </>
      )}
      {name === "files" && (
        <>
          <path d="M8 6V4a2 2 0 0 1 2-2h8l4 4v12a2 2 0 0 1-2 2h-2" />
          <path d="M18 6h4" />
          <path d="M18 6v4h4" />
          <path d="M4 6h8l4 4v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
          <path d="M12 6v4h4" />
        </>
      )}
      {name === "loader" && (
        <>
          <path d="M12 2v4" />
          <path d="M12 18v4" />
          <path d="m4.93 4.93 2.83 2.83" />
          <path d="m16.24 16.24 2.83 2.83" />
          <path d="M2 12h4" />
          <path d="M18 12h4" />
          <path d="m4.93 19.07 2.83-2.83" />
          <path d="m16.24 7.76 2.83-2.83" />
        </>
      )}
      {name === "plus" && (
        <>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </>
      )}
      {name === "trash" && (
        <>
          <path d="M3 6h18" />
          <path d="M8 6V4h8v2" />
          <path d="m19 6-1 14H6L5 6" />
          <path d="M10 11v5" />
          <path d="M14 11v5" />
        </>
      )}
      {name === "x" && (
        <>
          <path d="m18 6-12 12" />
          <path d="m6 6 12 12" />
        </>
      )}
    </svg>
  );
}
