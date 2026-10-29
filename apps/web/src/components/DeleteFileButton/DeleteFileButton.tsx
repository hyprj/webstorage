import { Button } from "../Button";
import { Icon } from "../Icon";
import type { FileMetadata } from "../../features/foldersView/types";
import { useDeleteFile } from "../../features/foldersView/useDeleteFile";

export function DeleteFileButton({ file }: { file: FileMetadata }) {
  const deleteFile = useDeleteFile();

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${file.name}"? This cannot be undone.`,
    );

    if (confirmed) {
      deleteFile.mutate(file.id);
    }
  }

  return (
    <span className="inline-flex shrink-0 items-center gap-1">
      <Button
        variant="danger"
        size="sm"
        onClick={handleDelete}
        disabled={deleteFile.isPending}
        aria-label={`Delete ${file.name}`}
      >
        {deleteFile.isPending ? (
          <Icon name="loader" spin className="size-4" aria-hidden="true" />
        ) : (
          <Icon name="trash" className="size-4" aria-hidden="true" />
        )}
        Delete
      </Button>
      {deleteFile.isError && (
        <span className="text-xs text-danger-600" role="alert">
          {deleteFile.error.message}
        </span>
      )}
    </span>
  );
}
