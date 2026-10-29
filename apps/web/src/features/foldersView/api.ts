import type { Folder } from "./types";

export async function getFolders(parentId?: string | null): Promise<Folder[]> {
  const url = parentId
    ? `http://localhost:3001/folders?parentId=${parentId}`
    : "http://localhost:3001/folders";

  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Server error: ${response?.status}`);
  }

  return response.json() as Promise<Folder[]>;
}

export async function createFolder({
  name,
  parentId,
}: {
  name: string;
  parentId: string | null;
}): Promise<Folder> {
  const response = await fetch("http://localhost:3001/folders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, parentId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Server error: ${response.status}`);
  }

  return response.json() as Promise<Folder>;
}

export async function deleteFolder(id: string): Promise<void> {
  const response = await fetch(`http://localhost:3001/folders/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Server error: ${response.status}`);
  }
}
