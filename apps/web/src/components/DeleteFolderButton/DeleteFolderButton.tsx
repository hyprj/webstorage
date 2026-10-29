import { LoaderCircle, Trash2 } from "lucide-react";
import type { Folder } from "../../features/foldersView/types";
import { useDeleteFolder } from "../../features/foldersView/useDeleteFolder";

export function DeleteFolderButton({ folder }: { folder: Folder }) {
  const deleteFolder = useDeleteFolder();

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${folder.name}" and all of its subfolders? This cannot be undone.`,
    );

    if (confirmed && folder.id) {
      deleteFolder.mutate(folder.id);
    }
  }

  if (!folder.id) {
    return null;
  }

  return (
    <span className="inline-flex shrink-0 items-center gap-1">
      <button
        type="button"
        className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-60"
        onClick={handleDelete}
        disabled={deleteFolder.isPending}
        aria-label={`Delete ${folder.name}`}
      >
        {deleteFolder.isPending ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Trash2 className="size-4" aria-hidden="true" />
        )}
        Delete
      </button>
      {deleteFolder.isError && (
        <span className="text-xs text-red-600" role="alert">
          {deleteFolder.error.message}
        </span>
      )}
    </span>
  );
}
