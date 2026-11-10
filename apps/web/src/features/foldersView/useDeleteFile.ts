import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFile } from "./api";

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteFile,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["files"] }),
        queryClient.invalidateQueries({ queryKey: ["trash"] }),
      ]),
  });
}
