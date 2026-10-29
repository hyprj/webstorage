import { FileText } from "lucide-react";
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
      className="flex items-center gap-2 py-1.5 text-sm text-slate-700"
      style={{ paddingLeft: `${depth * 16 + 24}px` }}
    >
      <FileText className="size-[18px] shrink-0 text-slate-500" aria-hidden />
      <span className="truncate">{file.name}</span>
    </div>
  );
}
