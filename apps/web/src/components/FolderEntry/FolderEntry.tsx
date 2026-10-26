import {
  AlertCircle,
  ChevronDown,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";
import { FolderIcon } from "../Icon/folderIcon";

export type Folder = {
  id: string;
  parentId: string | null;
  name: string;
};

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
      className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
        hasChildren === false
          ? "cursor-default"
          : "cursor-pointer hover:bg-slate-100"
      }`}
      style={{ paddingLeft: `${depth * 16}px` }}
      onClick={isExpanded ? onClose : onExpand}
      disabled={hasChildren === false}
      aria-expanded={hasChildren === false ? undefined : isExpanded}
    >
      <span className="flex size-4 shrink-0 items-center justify-center text-slate-500">
        {isLoading ? (
          <LoaderCircle className="size-4 animate-spin" aria-label="Loading" />
        ) : hasChildren === false ? null : isExpanded ? (
          <ChevronDown className="size-4" aria-hidden="true" />
        ) : (
          <ChevronRight className="size-4" aria-hidden="true" />
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
          Loading subfolders
        </span>
      )}
      {isError && (
        <span title="Error loading subfolders" className="ml-auto shrink-0">
          <AlertCircle
            className="size-4 text-red-600"
            role="img"
            aria-label="Error loading subfolders"
          />
        </span>
      )}
    </button>
  );
}
