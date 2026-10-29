import { useState, type FormEvent } from "react";
import { Button } from "../Button";
import { Icon } from "../Icon";
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
      <Button
        variant="ghost"
        size="sm"
        className="text-muted"
        onClick={() => setIsOpened(true)}
        aria-label={`Add subfolder to ${folder.name}`}
      >
        <Icon name="plus" className="size-4" aria-hidden="true" />
        Add folder
      </Button>
    );
  }

  return (
    <form className="flex shrink-0 items-center gap-1" onSubmit={handleSubmit}>
      <input
        autoFocus
        className="min-h-8 w-40 rounded-control border border-border bg-surface px-2 py-1 text-sm text-foreground outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
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
      <Button
        type="submit"
        variant="primary"
        size="sm"
        disabled={addFolder.isPending || !name.trim()}
      >
        {addFolder.isPending ? (
          <Icon name="loader" spin className="size-4" aria-hidden="true" />
        ) : (
          <Icon name="plus" className="size-4" aria-hidden="true" />
        )}
        Add
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="size-8 min-h-8 px-0"
        onClick={closeForm}
        disabled={addFolder.isPending}
        aria-label="Cancel adding folder"
      >
        <Icon name="x" className="size-4" aria-hidden="true" />
      </Button>
      {addFolder.isError && (
        <span className="text-xs text-red-600" role="alert">
          {addFolder.error.message}
        </span>
      )}
    </form>
  );
}
