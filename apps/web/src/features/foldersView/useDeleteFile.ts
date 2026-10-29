import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFile } from "./api";

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["files"] }),
  });
}
