import { useId, useRef, useState, type FormEvent } from "react";
import { FilePlus2, LoaderCircle, X } from "lucide-react";
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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
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
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
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
          dialogRef.current?.close();
          setName("");
          setSize("0");
        },
      },
    );
  }

  return (
    <>
      <button
        type="button"
        className="inline-flex shrink-0 items-center gap-1 rounded px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        onClick={openDialog}
        aria-label={`Add file to ${folder.name}`}
      >
        <FilePlus2 className="size-4" aria-hidden="true" />
        Add file
      </button>
      <dialog
        ref={dialogRef}
        className="m-auto w-[min(28rem,calc(100%-2rem))] rounded-lg p-0 shadow-xl backdrop:bg-slate-950/40"
        aria-labelledby={titleId}
      >
        <form className="space-y-4 p-5" onSubmit={handleSubmit}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id={titleId} className="text-lg font-semibold">
                Add a file
              </h2>
              <p className="text-sm text-slate-500">
                Add simulated file metadata to {folder.name}.
              </p>
            </div>
            <button
              type="button"
              className="rounded p-1 text-slate-500 hover:bg-slate-100"
              onClick={closeDialog}
              disabled={addFile.isPending}
              aria-label="Close dialog"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          <label className="block space-y-1 text-sm">
            <span className="font-medium">File name (without extension)</span>
            <span className="flex items-center rounded border border-slate-300 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500">
              <input
                autoFocus
                required
                className="min-w-0 flex-1 rounded-l px-3 py-2 outline-none"
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
              <span className="px-3 text-slate-500">
                .{selectedType.extension}
              </span>
            </span>
          </label>

          <label className="block space-y-1 text-sm">
            <span className="font-medium">File type</span>
            <select
              className="w-full rounded border border-slate-300 px-3 py-2 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
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
            </select>
          </label>

          <label className="block space-y-1 text-sm">
            <span className="font-medium">Size (bytes)</span>
            <input
              required
              type="number"
              min="0"
              step="1"
              className="w-full rounded border border-slate-300 px-3 py-2 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              value={size}
              onChange={(event) => setSize(event.target.value)}
              disabled={addFile.isPending}
            />
          </label>

          {addFile.isError && (
            <p className="text-sm text-red-600" role="alert">
              {addFile.error.message}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="rounded px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-60"
              onClick={closeDialog}
              disabled={addFile.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded bg-amber-500 px-3 py-2 text-sm text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={
                addFile.isPending ||
                !name.trim() ||
                !Number.isSafeInteger(Number(size)) ||
                Number(size) < 0
              }
            >
              {addFile.isPending && (
                <LoaderCircle
                  className="size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Add file
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
