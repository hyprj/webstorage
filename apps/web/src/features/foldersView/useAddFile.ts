import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFile } from "./api";

export function useAddFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["files"] }),
  });
}
