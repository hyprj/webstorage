import type { Folder } from "../../features/foldersView/types";
import { Icon } from "../Icon";
import { FolderIcon } from "../Icon/folderIcon";

export function FolderEntry({
  folder,
  isExpanded,
  onExpand,
  onClose,
  isLoading,
  isError,
  hasChildren,
  depth,
}: {
  folder: Folder;
  isExpanded: boolean;
  onExpand?: () => void;
  onClose?: () => void;
  isLoading: boolean;
  isError: boolean;
  hasChildren: boolean | undefined;
  depth: number;
}) {
  return (
    <button
      type="button"
      className={`flex w-full items-center gap-2 rounded-control px-2 py-1.5 text-left text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 ${
        hasChildren === false
          ? "cursor-default"
          : "cursor-pointer hover:bg-surface-subtle"
      }`}
      style={{ paddingLeft: `${depth * 16}px` }}
      onClick={isExpanded ? onClose : onExpand}
      disabled={hasChildren === false}
      aria-expanded={hasChildren === false ? undefined : isExpanded}
    >
      <span className="flex size-4 shrink-0 items-center justify-center text-muted">
        {isLoading ? (
          <Icon name="loader" spin className="size-4" aria-label="Loading" />
        ) : hasChildren === false ? null : isExpanded ? (
          <Icon name="chevron-down" className="size-4" aria-hidden="true" />
        ) : (
          <Icon name="chevron-right" className="size-4" aria-hidden="true" />
        )}
      </span>
      <FolderIcon
        width={18}
        height={18}
        className="shrink-0"
        aria-hidden="true"
      />
      <span className="truncate">{folder.name}</span>
      {isLoading && (
        <span role="status" className="sr-only">
          Loading folder contents
        </span>
      )}
      {isError && (
        <span
          title="Error loading folder contents"
          className="ml-auto shrink-0"
        >
          <Icon
            name="alert"
            className="size-4 text-danger-600"
            role="img"
            aria-label="Error loading folder contents"
          />
        </span>
      )}
    </button>
  );
}
