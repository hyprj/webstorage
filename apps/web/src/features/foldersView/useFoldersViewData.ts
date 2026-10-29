import { useQueries, type UseQueryResult } from "@tanstack/react-query";
import { useState } from "react";
import type {
  FileGridRow,
  FileMetadata,
  Folder,
  FolderContentRow,
} from "./types";
import { getFiles, getFolders } from "./api";

function appendFolder({
  rows,
  folder,
  depth,
  expandedIds,
  childrenQueries,
  filesQueries,
  setExpandedIds,
}: {
  rows: FolderContentRow[];
  folder: Folder;
  depth: number;
  expandedIds: Set<string | null>;
  childrenQueries: Map<string | null, UseQueryResult<Folder[], Error>>;
  filesQueries: Map<string | null, UseQueryResult<FileMetadata[], Error>>;
  setExpandedIds: React.Dispatch<React.SetStateAction<Set<string | null>>>;
}) {
  const isExpanded = expandedIds.has(folder.id);
  const childrenQuery = childrenQueries.get(folder.id);
  const filesQuery = filesQueries.get(folder.id);
  const children = childrenQuery?.data;

  rows.push({
    kind: "folder",
    folder,
    depth,
    isExpanded,
    isLoading:
      childrenQuery?.isLoading === true || filesQuery?.isLoading === true,
    isError: childrenQuery?.isError === true || filesQuery?.isError === true,
    hasChildren:
      children === undefined || filesQuery?.data === undefined
        ? undefined
        : children.length > 0 || filesQuery.data.length > 0,
    onExpand: () =>
      setExpandedIds((ids) => {
        const nextIds = new Set(ids);
        nextIds.add(folder.id);
        return nextIds;
      }),
    onClose: () =>
      setExpandedIds((ids) => {
        const nextIds = new Set(ids);
        nextIds.delete(folder.id);
        return nextIds;
      }),
  });

  if (isExpanded) {
    children?.forEach((child) =>
      appendFolder({
        rows,
        folder: child,
        depth: depth + 1,
        expandedIds,
        childrenQueries,
        filesQueries,
        setExpandedIds,
      }),
    );

    filesQuery?.data?.forEach((file) => {
      const fileRow: FileGridRow = {
        kind: "file",
        file,
        depth: depth + 1,
      };
      rows.push(fileRow);
    });
  }
}

function createRootFolder(): Folder {
  return {
    id: null,
    parentId: null,
    name: "Root",
  };
}

export function useFoldersViewData() {
  const [expandedIds, setExpandedIds] = useState<Set<string | null>>(
    () => new Set([null]),
  );
  const expandedFolderIds = [...expandedIds];
  const childrenResults = useQueries({
    queries: expandedFolderIds.map((parentId) => ({
      queryKey: ["folders", parentId],
      queryFn: () => (parentId === null ? getFolders() : getFolders(parentId)),
    })),
  });
  const filesResults = useQueries({
    queries: expandedFolderIds.map((folderId) => ({
      queryKey: ["files", folderId ?? "root"],
      queryFn: () => getFiles(folderId),
    })),
  });

  const childrenQueries = new Map(
    expandedFolderIds.map((parentId, index) => [
      parentId,
      childrenResults[index],
    ]),
  );
  const filesQueries = new Map(
    expandedFolderIds.map((folderId, index) => [folderId, filesResults[index]]),
  );
  const rows: FolderContentRow[] = [];

  appendFolder({
    rows,
    folder: createRootFolder(),
    depth: 0,
    expandedIds,
    childrenQueries,
    filesQueries,
    setExpandedIds,
  });

  const rootFoldersQuery = childrenQueries.get(null);
  const rootFilesQuery = filesQueries.get(null);

  return {
    rows,
    isLoading: rootFoldersQuery?.isLoading || rootFilesQuery?.isLoading,
    isError: rootFoldersQuery?.isError || rootFilesQuery?.isError,
    error: rootFoldersQuery?.error ?? rootFilesQuery?.error,
  };
}
