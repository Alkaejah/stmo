import { useMutation } from "@tanstack/react-query";
import { ApiService } from "@/common/services/api";
import { API_URL_ADMIN_MODULE } from "@/common/constants";

export async function uploadDriverCSV(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const apiService = new ApiService();
  return await apiService.post(
    `${API_URL_ADMIN_MODULE}/drivers/upload`,
    formData,
    true,
    true,
  );
}

function useUploadDriverCSV() {
  const mutation = useMutation({
    mutationFn: (file: File) => uploadDriverCSV(file),
  });
  return mutation;
}

export default useUploadDriverCSV;
