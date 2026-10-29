import { Icon } from "../Icon";
import type { FileMetadata } from "../../features/foldersView/types";

export function FileEntry({
  file,
  depth,
}: {
  file: FileMetadata;
  depth: number;
}) {
  return (
    <div
      className="flex items-center gap-2 py-1.5 text-sm text-foreground"
      style={{ paddingLeft: `${depth * 16 + 24}px` }}
    >
      <Icon
        name="file"
        className="size-[18px] shrink-0 text-muted"
        aria-hidden="true"
      />
      <span className="truncate">{file.name}</span>
    </div>
  );
}
