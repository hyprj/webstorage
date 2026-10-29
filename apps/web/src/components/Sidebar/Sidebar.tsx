import { Icon } from "../Icon";

type NavigationItem = "files" | "trash";

export function Sidebar({
  activeItem,
  onNavigate,
}: {
  activeItem: NavigationItem;
  onNavigate: (item: NavigationItem) => void;
}) {
  const items: {
    id: NavigationItem;
    label: string;
    icon: "files" | "trash";
  }[] = [
    { id: "files", label: "Files", icon: "files" },
    { id: "trash", label: "Trash", icon: "trash" },
  ];

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-surface px-3 py-5">
      <nav aria-label="Main navigation" className="space-y-1">
        {items.map((item) => {
          const isActive = activeItem === item.id;

          return (
            <button
              key={item.id}
              type="button"
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-10 w-full items-center gap-3 rounded-control px-3 text-left text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-50 text-brand-700"
                  : "text-muted hover:bg-surface-subtle hover:text-foreground"
              }`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon
                name={item.icon}
                className="size-[18px]"
                aria-hidden="true"
              />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
