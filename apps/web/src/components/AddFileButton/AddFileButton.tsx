import { useId, useState, type FormEvent } from "react";
import { Button } from "../Button";
import { Dialog } from "../Dialog";
import { Icon } from "../Icon";
import { Select } from "../Select";
import type { Folder } from "../../features/foldersView/types";
import { useAddFile } from "../../features/foldersView/useAddFile";

const fileTypes = [
  { label: "PDF document", contentType: "application/pdf", extension: "pdf" },
  { label: "Text file", contentType: "text/plain", extension: "txt" },
  { label: "Markdown file", contentType: "text/markdown", extension: "md" },
  { label: "PNG image", contentType: "image/png", extension: "png" },
  { label: "JPEG image", contentType: "image/jpeg", extension: "jpg" },
  { label: "JSON file", contentType: "application/json", extension: "json" },
  { label: "CSV spreadsheet", contentType: "text/csv", extension: "csv" },
  {
    label: "Excel spreadsheet",
    contentType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    extension: "xlsx",
  },
  {
    label: "Word document",
    contentType:
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    extension: "docx",
  },
] as const;

export function AddFileButton({ folder }: { folder: Folder }) {
  const [isOpen, setIsOpen] = useState(false);
  const formId = useId();
  const [name, setName] = useState("");
  const [contentType, setContentType] = useState<string>(
    fileTypes[0].contentType,
  );
  const [size, setSize] = useState("0");
  const addFile = useAddFile();

  const selectedType =
    fileTypes.find((fileType) => fileType.contentType === contentType) ??
    fileTypes[0];

  function openDialog() {
    addFile.reset();
    setIsOpen(true);
  }

  function closeDialog() {
    setIsOpen(false);
    setName("");
    setContentType(fileTypes[0].contentType);
    setSize("0");
    addFile.reset();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    const parsedSize = Number(size);

    if (!trimmedName || !Number.isSafeInteger(parsedSize) || parsedSize < 0) {
      return;
    }

    addFile.mutate(
      {
        name: `${trimmedName}.${selectedType.extension}`,
        contentType: selectedType.contentType,
        size: parsedSize,
        folderId: folder.id,
      },
      {
        onSuccess: () => {
          setIsOpen(false);
          setName("");
          setSize("0");
        },
      },
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="text-muted"
        onClick={openDialog}
        aria-label={`Add file to ${folder.name}`}
      >
        <Icon name="file-plus" className="size-4" aria-hidden="true" />
        Add file
      </Button>
      <Dialog
        open={isOpen}
        title="Add a file"
        description={`Add simulated file metadata to ${folder.name}.`}
        onClose={closeDialog}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={closeDialog}
              disabled={addFile.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              form={formId}
              disabled={
                addFile.isPending ||
                !name.trim() ||
                !Number.isSafeInteger(Number(size)) ||
                Number(size) < 0
              }
            >
              {addFile.isPending && (
                <Icon
                  name="loader"
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Add file
            </Button>
          </>
        }
      >
        <form id={formId} className="space-y-5" onSubmit={handleSubmit}>
          <label className="block space-y-1.5 text-sm">
            <span className="font-medium text-foreground">
              File name (without extension)
            </span>
            <span className="flex min-h-10 items-center rounded-control border border-border bg-surface focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-100">
              <input
                autoFocus
                required
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-foreground outline-none placeholder:text-muted"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (addFile.isError) {
                    addFile.reset();
                  }
                }}
                placeholder="e.g. project-notes"
                disabled={addFile.isPending}
              />
              <span className="px-3 text-muted">.{selectedType.extension}</span>
            </span>
          </label>

          <Select
            label="File type"
            className="w-full"
            value={contentType}
            onChange={(event) => {
              setContentType(event.target.value);
              if (addFile.isError) {
                addFile.reset();
              }
            }}
            disabled={addFile.isPending}
          >
            {fileTypes.map((fileType) => (
              <option key={fileType.contentType} value={fileType.contentType}>
                {fileType.label}
              </option>
            ))}
          </Select>

          <label className="block space-y-1.5 text-sm">
            <span className="font-medium text-foreground">Size (bytes)</span>
            <input
              required
              type="number"
              min="0"
              step="1"
              className="min-h-10 w-full rounded-control border border-border bg-surface px-3 py-2 text-foreground outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-surface-subtle disabled:opacity-70"
              value={size}
              onChange={(event) => setSize(event.target.value)}
              disabled={addFile.isPending}
            />
          </label>

          {addFile.isError && (
            <p
              className="rounded-control bg-danger-50 px-3 py-2 text-sm text-danger-700"
              role="alert"
            >
              {addFile.error.message}
            </p>
          )}
        </form>
      </Dialog>
    </>
  );
}
