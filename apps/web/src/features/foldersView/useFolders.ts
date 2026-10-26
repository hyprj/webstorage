import { useQuery } from "@tanstack/react-query";
import { getFolders } from "./api";

export function useFolders({
  parentId,
  enabled = true,
}: {
  parentId?: string;
  enabled?: boolean;
}) {
  return useQuery({
    enabled,
    queryKey: ["folders", parentId ?? "root"],
    queryFn: () => getFolders(parentId),
  });
}
