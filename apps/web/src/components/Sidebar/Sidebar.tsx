import { Icon } from "../Icon";
import { NavLink } from "react-router-dom";

export function Sidebar() {
  const items: {
    path: string;
    label: string;
    icon: "files" | "shield" | "trash";
  }[] = [
    { path: "/", label: "Files", icon: "files" },
    { path: "/trash", label: "Trash", icon: "trash" },
    {
      path: "/data-retention",
      label: "Data retention",
      icon: "shield",
    },
  ];

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-surface px-3 py-5">
      <nav aria-label="Main navigation" className="space-y-1">
        {items.map((item) => {
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex min-h-10 w-full items-center gap-3 rounded-control px-3 text-left text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-muted hover:bg-surface-subtle hover:text-foreground"
                }`
              }
            >
              <Icon
                name={item.icon}
                className="size-[18px]"
                aria-hidden="true"
              />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
