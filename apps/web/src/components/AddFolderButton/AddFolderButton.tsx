import { useState, type FormEvent } from "react";
import { LoaderCircle, Plus, X } from "lucide-react";
import type { Folder } from "../../features/foldersView/types";
import { useAddFolder } from "../../features/foldersView/useAddFolder";

export function AddFolderButton({ folder }: { folder: Folder }) {
  const [isOpened, setIsOpened] = useState(false);
  const [name, setName] = useState("");
  const addFolder = useAddFolder();

  function closeForm() {
    setIsOpened(false);
    setName("");
    addFolder.reset();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    addFolder.mutate(
      { name: trimmedName, parentId: folder.id },
      { onSuccess: closeForm },
    );
  }

  if (!isOpened) {
    return (
      <button
        type="button"
        className="inline-flex shrink-0 items-center gap-1 rounded px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        onClick={() => setIsOpened(true)}
        aria-label={`Add subfolder to ${folder.name}`}
      >
        <Plus className="size-4" aria-hidden="true" />
        Add folder
      </button>
    );
  }

  return (
    <form className="flex shrink-0 items-center gap-1" onSubmit={handleSubmit}>
      <input
        autoFocus
        className="w-40 rounded border border-slate-300 px-2 py-1 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
          if (addFolder.isError) {
            addFolder.reset();
          }
        }}
        placeholder="Folder name"
        aria-label="Folder name"
        aria-invalid={addFolder.isError}
        disabled={addFolder.isPending}
      />
      <button
        type="submit"
        className="inline-flex items-center gap-1 rounded bg-amber-500 px-2 py-1 text-xs text-white hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={addFolder.isPending || !name.trim()}
      >
        {addFolder.isPending ? (
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <Plus className="size-4" aria-hidden="true" />
        )}
        Add
      </button>
      <button
        type="button"
        className="rounded p-1 text-slate-500 hover:bg-slate-100"
        onClick={closeForm}
        disabled={addFolder.isPending}
        aria-label="Cancel adding folder"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
      {addFolder.isError && (
        <span className="text-xs text-red-600" role="alert">
          {addFolder.error.message}
        </span>
      )}
    </form>
  );
}
