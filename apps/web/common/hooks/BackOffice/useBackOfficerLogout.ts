import { API_URL_BACKOFFICE } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useMutation } from "@tanstack/react-query";

export async function backOfficerLogout() {
  const apiService = new ApiService();
  return await apiService.post(`${API_URL_BACKOFFICE}/auth/logout`, {});
}

function useBackOfficerLogout() {
  const query = useMutation({
    mutationFn: () => backOfficerLogout(),
  });
  return query;
}

export default useBackOfficerLogout;
