export type TrashItem = {
  id: string;
  name: string;
  type: "file" | "folder";
  size: number | null;
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
  return response.json() as Promise<TrashItem[]>;
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
  const response = await fetch(`http://localhost:3001/trash/files/${id}`, {
    method: "DELETE",
  });
  await ensureSuccess(response);
}

export async function permanentlyDeleteFolder(id: string): Promise<void> {
  const response = await fetch(`http://localhost:3001/trash/folders/${id}`, {
    method: "DELETE",
  });
  await ensureSuccess(response);
}
