import { Button } from "../Button";
import { Icon } from "../Icon";
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
      <Button
        variant="danger"
        size="sm"
        onClick={handleDelete}
        disabled={deleteFolder.isPending}
        aria-label={`Delete ${folder.name}`}
      >
        {deleteFolder.isPending ? (
          <Icon
            name="loader"
            className="size-4 animate-spin"
            aria-hidden="true"
          />
        ) : (
          <Icon name="trash" className="size-4" aria-hidden="true" />
        )}
        Delete
      </Button>
      {deleteFolder.isError && (
        <span className="text-xs text-danger-600" role="alert">
          {deleteFolder.error.message}
        </span>
      )}
    </span>
  );
}
