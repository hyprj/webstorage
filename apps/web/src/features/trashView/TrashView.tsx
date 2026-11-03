import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "../../components/Button";
import { DataGrid } from "../../components/DataGrid";
import type { Column } from "../../components/DataGrid/DataGrid";
import { Icon } from "../../components/Icon";
import {
  getTrash,
  permanentlyDeleteFile,
  permanentlyDeleteFolder,
  restoreFile,
  restoreFolder,
  type TrashItem,
} from "./api";

function formatSize(size: number | null) {
  if (size === null) {
    return "—";
  }

  if (size < 1024) {
    return `${size} B`;
  }

  const units = ["KB", "MB", "GB", "TB"];
  let value = size / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(1)} ${units[unitIndex]}`;
}

export function TrashView() {
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState<string | null>(null);
  const trashQuery = useQuery({
    queryKey: ["trash"],
    queryFn: getTrash,
  });

  const refreshRelatedQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["trash"] }),
      queryClient.invalidateQueries({ queryKey: ["files"] }),
      queryClient.invalidateQueries({ queryKey: ["folders"] }),
    ]);
  };

  const restoreMutation = useMutation({
    mutationFn: (item: TrashItem) =>
      item.type === "file" ? restoreFile(item.id) : restoreFolder(item.id),
    onSuccess: refreshRelatedQueries,
    onError: (error: Error) => setActionError(error.message),
  });

  const permanentlyDeleteMutation = useMutation({
    mutationFn: (item: TrashItem) =>
      item.type === "file"
        ? permanentlyDeleteFile(item.id)
        : permanentlyDeleteFolder(item.id),
    onSuccess: refreshRelatedQueries,
    onError: (error: Error) => setActionError(error.message),
  });

  const columns: Column<TrashItem>[] = [
    { id: "name", name: "Name", cell: (item) => item.name },
    {
      id: "type",
      name: "Type",
      cell: (item) => (item.type === "folder" ? "Folder" : "File"),
    },
    { id: "size", name: "Size", cell: (item) => formatSize(item.size) },
    {
      id: "originalLocation",
      name: "Original location",
      cell: (item) => item.originalLocation ?? "Root",
    },
    { id: "deleted", name: "Deleted", cell: () => "In trash" },
    {
      id: "actions",
      name: "Actions",
      cell: (item) => {
        const isRestoring =
          restoreMutation.isPending &&
          restoreMutation.variables?.id === item.id;
        const isDeleting =
          permanentlyDeleteMutation.isPending &&
          permanentlyDeleteMutation.variables?.id === item.id;

        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                setActionError(null);
                restoreMutation.mutate(item);
              }}
              disabled={restoreMutation.isPending || permanentlyDeleteMutation.isPending}
              aria-label={`Restore ${item.name}`}
            >
              {isRestoring && (
                <Icon
                  name="loader"
                  spin
                  className="size-4"
                  aria-hidden="true"
                />
              )}
              Restore
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                const confirmed = window.confirm(
                  `Permanently delete "${item.name}"? This cannot be undone.`,
                );

                if (confirmed) {
                  setActionError(null);
                  permanentlyDeleteMutation.mutate(item);
                }
              }}
              disabled={restoreMutation.isPending || permanentlyDeleteMutation.isPending}
              aria-label={`Permanently delete ${item.name}`}
            >
              {isDeleting ? (
                <Icon
                  name="loader"
                  spin
                  className="size-4"
                  aria-hidden="true"
                />
              ) : (
                <Icon name="trash" className="size-4" aria-hidden="true" />
              )}
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  if (trashQuery.isError) {
    return (
      <div role="alert" className="text-sm text-danger-600">
        Failed to load trash: {trashQuery.error.message}
      </div>
    );
  }

  if (trashQuery.isLoading) {
    return (
      <div
        className="flex min-h-40 items-center justify-center text-muted"
        role="status"
        aria-label="Loading trash"
      >
        <Icon name="loader" spin className="size-6" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {actionError && (
        <div role="alert" className="text-sm text-danger-600">
          Trash action failed: {actionError}
        </div>
      )}
      <div className="overflow-hidden rounded-panel border border-border bg-surface">
        <DataGrid<TrashItem>
          columns={columns}
          data={trashQuery.data ?? []}
          getRowKey={(item) => `${item.type}-${item.id}`}
          emptyState="Trash is empty. Deleted files and folders will appear here."
        />
      </div>
    </div>
  );
}
