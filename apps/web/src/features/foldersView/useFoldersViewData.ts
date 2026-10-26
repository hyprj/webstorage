import {
  useQueries,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";
import { useState } from "react";
import type { Folder, FolderGridRow } from "./types";
import { getFolders } from "./api";

function appendFolder({
  rows,
  folder,
  depth,
  expandedIds,
  childrenQueries,
  setExpandedIds,
}: {
  rows: FolderGridRow[];
  folder: Folder;
  depth: number;
  expandedIds: Set<string>;
  childrenQueries: Map<string, UseQueryResult<Folder[], Error>>;
  setExpandedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
}) {
  const isExpanded = expandedIds.has(folder.id);
  const childrenQuery = childrenQueries.get(folder.id);
  const children = childrenQuery?.data;

  rows.push({
    folder,
    depth,
    isExpanded,
    isLoading: childrenQuery?.isLoading ?? false,
    isError: childrenQuery?.isError ?? false,
    hasChildren: children === undefined ? undefined : children.length > 0,
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
        setExpandedIds,
      }),
    );
  }
}

export function useFoldersViewData() {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());
  const rootsQuery = useQuery({
    queryKey: ["folders", "root"],
    queryFn: () => getFolders(),
  });

  const expandedFolderIds = [...expandedIds];
  const childrenResults = useQueries({
    queries: expandedFolderIds.map((parentId) => ({
      queryKey: ["folders", parentId],
      queryFn: () => getFolders(parentId),
    })),
  });

  const childrenQueries = new Map(
    expandedFolderIds.map((parentId, index) => [
      parentId,
      childrenResults[index],
    ]),
  );
  const rows: FolderGridRow[] = [];

  rootsQuery.data?.forEach((folder) =>
    appendFolder({
      rows,
      folder,
      depth: 0,
      expandedIds,
      childrenQueries,
      setExpandedIds,
    }),
  );

  return {
    rows,
    roots: rootsQuery.data ?? [],
    isLoading: rootsQuery.isLoading,
    isError: rootsQuery.isError,
  };
}
