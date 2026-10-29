import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFolder } from "./api";

export function useAddFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createFolder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["folders"] }),
  });
}
