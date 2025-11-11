import { useMutation } from "@tanstack/react-query";
import { ApiService } from "@/common/services/api";
import { API_URL_ADMIN_MODULE } from "@/common/constants";

export async function uploadHistoricalTicketsCSV(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const apiService = new ApiService();
  return await apiService.post(
    `${API_URL_ADMIN_MODULE}/tickets/historical/upload`,
    formData,
    true,
    true,
  );
}

function useUploadHistoricalTicketsCSV() {
  const mutation = useMutation({
    mutationFn: (file: File) => uploadHistoricalTicketsCSV(file),
  });
  return mutation;
}

export default useUploadHistoricalTicketsCSV;
