import type { Folder } from "./types";

export async function getFolders(parentId?: string): Promise<Folder[]> {
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
