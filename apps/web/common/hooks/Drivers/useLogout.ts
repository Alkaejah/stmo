import { API_URL_DRIVERS } from "@/common/constants";
import { ApiService } from "@/common/services/api";
import { useMutation } from "@tanstack/react-query";

export async function logout() {
  const apiService = new ApiService();
  return await apiService.post(`${API_URL_DRIVERS}/auth/logout`, {});
}

function useLogout() {
  const query = useMutation({
    mutationFn: () => logout(),
  });
  return query;
}

export default useLogout;
