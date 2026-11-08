export type TrashItem = {
  id: string;
  name: string;
  type: "file" | "folder";
  size: number | null;
  originalLocation: string | null;
};

export type TrashResponse = {
  files: Array<{
    id: string;
    name: string;
    size: number;
    originalLocation: string | null;
  }>;
  folders: Array<{
    id: string;
    name: string;
    originalLocation: string | null;
  }>;
};

async function ensureSuccess(response: Response) {
  if (response.ok) {
    return;
  }

  const errorData = await response.json().catch(() => null);
  throw new Error(errorData?.message || `Server error: ${response.status}`);
}

export async function getTrash(): Promise<TrashItem[]> {
  const response = await fetch("http://localhost:3001/trash");
  await ensureSuccess(response);
  const { files, folders } = (await response.json()) as TrashResponse;

  return [
    ...files.map((file) => ({
      id: file.id,
      name: file.name,
      type: "file" as const,
      size: file.size,
      originalLocation: file.originalLocation ?? null,
    })),
    ...folders.map((folder) => ({
      id: folder.id,
      name: folder.name,
      type: "folder" as const,
      size: null,
      originalLocation: folder.originalLocation ?? null,
    })),
  ];
}

export async function restoreFile(id: string): Promise<void> {
  const response = await fetch(
    `http://localhost:3001/trash/files/${id}/restore`,
    { method: "PATCH" },
  );
  await ensureSuccess(response);
}

export async function restoreFolder(id: string): Promise<void> {
  const response = await fetch(
    `http://localhost:3001/trash/folders/${id}/restore`,
    { method: "PATCH" },
  );
  await ensureSuccess(response);
}

export async function permanentlyDeleteFile(id: string): Promise<void> {
  const response = await fetch(`http://localhost:3001/trash/purge/file/${id}`, {
    method: "DELETE",
  });
  await ensureSuccess(response);
}

export async function permanentlyDeleteFolder(id: string): Promise<void> {
  const response = await fetch(
    `http://localhost:3001/trash/purge/folder/${id}`,
    {
      method: "DELETE",
    },
  );
  await ensureSuccess(response);
}
