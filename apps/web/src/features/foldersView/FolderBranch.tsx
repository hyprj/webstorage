import { useState } from "react";
import { FolderEntry } from "../../components/FolderEntry";
import type { Folder } from "./types";
import { useFolders } from "./useFolders";

export function FolderBranch({
  folder,
  depth = 0,
}: {
  folder: Folder;
  depth?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    data,
    isLoading,
    isError,
  } = useFolders({ parentId: folder.id, enabled: isExpanded });

  return (
    <>
      <FolderEntry
        folder={folder}
        isExpanded={isExpanded}
        onExpand={() => setIsExpanded(true)}
        onClose={() => setIsExpanded(false)}
        isLoading={isLoading}
        isError={isError}
        hasChildren={data === undefined ? undefined : data.length > 0}
        depth={depth}
      />
      {isExpanded &&
        data?.map((f) => (
          <FolderBranch key={f.id} folder={f} depth={depth + 1} />
        ))}
    </>
  );
}
