import type { FileMetadata, Folder } from "./types";

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

export async function getFiles(
  folderId: string | null,
): Promise<FileMetadata[]> {
  const url = new URL("http://localhost:3001/files");

  if (folderId) {
    url.searchParams.set("folderId", folderId);
  }

  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Server error: ${response.status}`);
  }

  return response.json() as Promise<FileMetadata[]>;
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

export async function createFile({
  name,
  contentType,
  size,
  folderId,
}: {
  name: string;
  contentType: string;
  size: number;
  folderId: string | null;
}): Promise<FileMetadata> {
  const response = await fetch("http://localhost:3001/files", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, contentType, size, folderId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Server error: ${response.status}`);
  }

  return response.json() as Promise<FileMetadata>;
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
